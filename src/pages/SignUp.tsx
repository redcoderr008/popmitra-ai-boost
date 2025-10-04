import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type AuthMethod = "email" | "phone";
type AuthStep = "form" | "otp";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [authStep, setAuthStep] = useState<AuthStep>("form");
  const navigate = useNavigate();
  const { toast } = useToast();

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isPhone = (value: string) => {
    return /^\+?[1-9]\d{1,14}$/.test(value);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!fullName || !emailOrPhone || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const inputIsEmail = isEmail(emailOrPhone);
    const inputIsPhone = isPhone(emailOrPhone);

    if (!inputIsEmail && !inputIsPhone) {
      setError("Please enter a valid email or phone number (with country code)");
      setLoading(false);
      return;
    }

    try {
      if (inputIsEmail) {
        // Email signup - send verification email
        const { data, error } = await supabase.auth.signUp({
          email: emailOrPhone,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: fullName
            }
          }
        });

        if (error) {
          setError(error.message);
        } else if (data.user) {
          toast({
            title: "Check Your Email!",
            description: "We sent a verification code to your email.",
          });
          setAuthMethod("email");
          setAuthStep("otp");
        }
      } else {
        // Phone signup - send OTP via Twilio
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otpCode);

        const { error: functionError } = await supabase.functions.invoke('send-otp', {
          body: { phoneNumber: emailOrPhone, otp: otpCode }
        });

        if (functionError) {
          throw new Error(functionError.message);
        }

        toast({
          title: "Code Sent!",
          description: "We sent a verification code to your phone.",
        });
        setAuthMethod("phone");
        setAuthStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp) {
      setError("Please enter the verification code");
      setLoading(false);
      return;
    }

    try {
      if (authMethod === "email") {
        // Verify email OTP
        const { error } = await supabase.auth.verifyOtp({
          email: emailOrPhone,
          token: otp,
          type: 'email'
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to PopMitra!",
          });
          navigate("/");
        }
      } else {
        // Verify phone OTP
        if (otp !== generatedOtp) {
          setError("Invalid verification code");
          setLoading(false);
          return;
        }

        // Create user with phone number
        const tempEmail = `${emailOrPhone.replace(/[^0-9]/g, '')}@temp.popmitra.com`;
        const { data, error } = await supabase.auth.signUp({
          email: tempEmail,
          password,
          phone: emailOrPhone,
          options: {
            data: {
              display_name: fullName,
              phone_number: emailOrPhone
            }
          }
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to PopMitra!",
          });
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      if (authMethod === "email") {
        const { error } = await supabase.auth.signUp({
          email: emailOrPhone,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: fullName
            }
          }
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Code Resent!",
            description: "Check your email for a new verification code.",
          });
        }
      } else {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otpCode);

        const { error } = await supabase.functions.invoke('send-otp', {
          body: { phoneNumber: emailOrPhone, otp: otpCode }
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: "Code Resent!",
          description: "Check your phone for a new verification code.",
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
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
              onClick={() => authStep === "otp" ? setAuthStep("form") : navigate("/")}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create Account</CardTitle>
          </div>
          <CardDescription>
            {authStep === "form" 
              ? "Join PopMitra to create viral content"
              : "Enter the verification code we sent you"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {authStep === "form" ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

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
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Code sent to {authMethod === "email" ? "email" : "phone"}: {emailOrPhone}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend Code
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
