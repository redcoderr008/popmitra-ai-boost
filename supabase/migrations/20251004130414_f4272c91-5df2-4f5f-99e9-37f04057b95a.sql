-- Create pending_users table for OTP verification
CREATE TABLE public.pending_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_pending_users_email ON public.pending_users(email);
CREATE INDEX idx_pending_users_expires_at ON public.pending_users(expires_at);

-- Enable RLS
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage pending users
CREATE POLICY "Service role can manage pending users"
ON public.pending_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.pending_users
  WHERE expires_at < now();
END;
$$;