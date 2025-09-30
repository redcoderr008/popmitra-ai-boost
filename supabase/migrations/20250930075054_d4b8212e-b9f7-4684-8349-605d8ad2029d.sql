-- Add trigger to update email_verified when user confirms their email
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update email_verified in profiles when email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at != NEW.email_confirmed_at) THEN
    UPDATE public.profiles
    SET email_verified = true
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for email confirmation
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_confirmation();