import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);

    try {
      // Check if user signed up with phone or email
      const isPhoneUser = user?.email?.includes('@temp.popmitra.com');
      
      if (isPhoneUser) {
        // Get phone number from user metadata
        const phoneNumber = user?.user_metadata?.phone_number;
        
        if (!phoneNumber) {
          throw new Error('Phone number not found');
        }

        // Generate and send OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const { error } = await supabase.functions.invoke('send-otp', {
          body: { phoneNumber, otp: otpCode }
        });

        if (error) throw error;

        toast({
          title: "Code Sent!",
          description: "Check your phone for a new verification code.",
        });
      } else {
        // Resend email verification
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user?.email || '',
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;

        toast({
          title: "Email Sent!",
          description: "Check your email for a new verification link.",
        });
      }
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPhoneUser = user?.email?.includes('@temp.popmitra.com');
  const contactInfo = isPhoneUser 
    ? user?.user_metadata?.phone_number 
    : user?.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            View and manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-medium">
                    {profile?.display_name || user?.user_metadata?.display_name || "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {isPhoneUser ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    {isPhoneUser ? "Phone Number" : "Email"}
                  </p>
                  <p className="text-lg font-medium">{contactInfo}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {profile?.email_verified ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-lg font-medium text-green-500">Verified ✅</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="text-lg font-medium text-amber-500">Unverified ⚠️</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!profile?.email_verified && (
              <Alert>
                <AlertDescription className="space-y-4">
                  <p>
                    Your account is not verified. Please check your {isPhoneUser ? "phone" : "email"} for the verification {isPhoneUser ? "code" : "link"}.
                  </p>
                  <Button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full sm:w-auto"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      `Resend Verification ${isPhoneUser ? "Code" : "Email"}`
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/signin");
              }}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
