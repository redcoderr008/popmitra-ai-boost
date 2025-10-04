import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!emailOrPhone || !password) {
      setError("Please enter your credentials");
      setLoading(false);
      return;
    }

    try {
      let signInEmail = emailOrPhone;
      
      // If phone number, convert to temp email format
      if (!isEmail(emailOrPhone)) {
        signInEmail = `${emailOrPhone.replace(/[^0-9]/g, '')}@temp.popmitra.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Check if user is verified
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      if (!profile?.email_verified) {
        toast({
          title: "Account Not Verified",
          description: "Please check your email or phone for the verification link/code.",
          variant: "destructive",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Welcome Back!",
          description: "Successfully signed in.",
        });
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Sign In</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="email@example.com or +1234567890"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
