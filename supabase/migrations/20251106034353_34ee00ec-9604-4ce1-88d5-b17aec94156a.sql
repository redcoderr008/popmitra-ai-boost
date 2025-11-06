-- Create payment verification status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'verified', 'rejected');

-- Create payment verifications table
CREATE TABLE public.payment_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_code TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan subscription_plan NOT NULL DEFAULT 'pro',
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  rejection_reason TEXT
);

-- Enable RLS
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment verifications
CREATE POLICY "Users can view their own payment verifications"
  ON public.payment_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own payment verifications
CREATE POLICY "Users can create their own payment verifications"
  ON public.payment_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can view all payment verifications
CREATE POLICY "Admins can view all payment verifications"
  ON public.payment_verifications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can update payment verifications
CREATE POLICY "Admins can update payment verifications"
  ON public.payment_verifications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX idx_payment_verifications_user_id ON public.payment_verifications(user_id);
CREATE INDEX idx_payment_verifications_status ON public.payment_verifications(status);
CREATE INDEX idx_payment_verifications_created_at ON public.payment_verifications(created_at DESC);