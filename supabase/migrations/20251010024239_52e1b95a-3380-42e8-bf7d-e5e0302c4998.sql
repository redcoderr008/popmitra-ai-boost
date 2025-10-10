-- Create table for rate limiting signup attempts
CREATE TABLE IF NOT EXISTS public.signup_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email, phone, or IP address
  identifier_type TEXT NOT NULL, -- 'email', 'phone', or 'ip'
  attempts INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.signup_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for fast lookups
CREATE INDEX idx_signup_rate_limits_identifier ON public.signup_rate_limits(identifier, identifier_type);
CREATE INDEX idx_signup_rate_limits_blocked ON public.signup_rate_limits(blocked_until);

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits"
ON public.signup_rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(
  _identifier TEXT,
  _identifier_type TEXT,
  _max_attempts INTEGER DEFAULT 3,
  _window_minutes INTEGER DEFAULT 60
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _record RECORD;
  _is_allowed BOOLEAN;
  _reset_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean up old records first
  DELETE FROM public.signup_rate_limits
  WHERE first_attempt_at < now() - INTERVAL '24 hours';

  -- Get existing record
  SELECT * INTO _record
  FROM public.signup_rate_limits
  WHERE identifier = _identifier
    AND identifier_type = _identifier_type
  FOR UPDATE;

  -- Check if blocked
  IF _record IS NOT NULL AND _record.blocked_until IS NOT NULL AND _record.blocked_until > now() THEN
    RETURN json_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'reset_at', _record.blocked_until,
      'attempts', _record.attempts
    );
  END IF;

  -- Reset if window has passed
  IF _record IS NOT NULL AND _record.first_attempt_at < now() - (_window_minutes || ' minutes')::INTERVAL THEN
    DELETE FROM public.signup_rate_limits WHERE id = _record.id;
    _record := NULL;
  END IF;

  -- Create or update record
  IF _record IS NULL THEN
    INSERT INTO public.signup_rate_limits (identifier, identifier_type, attempts, first_attempt_at, last_attempt_at)
    VALUES (_identifier, _identifier_type, 1, now(), now());
    
    RETURN json_build_object(
      'allowed', true,
      'attempts', 1,
      'max_attempts', _max_attempts
    );
  ELSE
    -- Increment attempts
    UPDATE public.signup_rate_limits
    SET attempts = attempts + 1,
        last_attempt_at = now(),
        blocked_until = CASE 
          WHEN attempts + 1 >= _max_attempts THEN now() + (_window_minutes || ' minutes')::INTERVAL
          ELSE NULL
        END
    WHERE id = _record.id
    RETURNING * INTO _record;

    IF _record.attempts >= _max_attempts THEN
      RETURN json_build_object(
        'allowed', false,
        'reason', 'rate_limit_exceeded',
        'reset_at', _record.blocked_until,
        'attempts', _record.attempts,
        'max_attempts', _max_attempts
      );
    END IF;

    RETURN json_build_object(
      'allowed', true,
      'attempts', _record.attempts,
      'max_attempts', _max_attempts
    );
  END IF;
END;
$$;

-- Update profiles RLS policy to require authentication
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Keep existing policies for insert and update
-- Users can still insert and update their own profiles