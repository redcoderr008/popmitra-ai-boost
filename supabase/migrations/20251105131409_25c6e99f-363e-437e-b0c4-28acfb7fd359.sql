-- Create table to track user notice dismissals
CREATE TABLE IF NOT EXISTS public.user_notice_dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  notice_id uuid NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
  dismissed_at timestamp with time zone NOT NULL DEFAULT now(),
  dismiss_type text NOT NULL DEFAULT 'permanent', -- 'permanent' or 'temporary'
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, notice_id)
);

-- Enable RLS
ALTER TABLE public.user_notice_dismissals ENABLE ROW LEVEL SECURITY;

-- Users can view their own dismissals
CREATE POLICY "Users can view their own dismissals"
ON public.user_notice_dismissals
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own dismissals
CREATE POLICY "Users can insert their own dismissals"
ON public.user_notice_dismissals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own dismissals
CREATE POLICY "Users can delete their own dismissals"
ON public.user_notice_dismissals
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_notice_dismissals_user_id ON public.user_notice_dismissals(user_id);
CREATE INDEX idx_user_notice_dismissals_notice_id ON public.user_notice_dismissals(notice_id);