-- Create content_generations table to track all content generations
CREATE TABLE IF NOT EXISTS public.content_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  description TEXT NOT NULL,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.content_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert generations"
  ON public.content_generations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own generations"
  ON public.content_generations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all generations"
  ON public.content_generations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_content_generations_user_id ON public.content_generations(user_id);
CREATE INDEX idx_content_generations_created_at ON public.content_generations(created_at DESC);

-- RPC function to get total users count
CREATE OR REPLACE FUNCTION public.get_total_users()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM auth.users;
$$;

-- RPC function to get total generations count
CREATE OR REPLACE FUNCTION public.get_total_generations()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.content_generations;
$$;