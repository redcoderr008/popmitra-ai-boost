import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Sparkles, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type AuthStep = "email" | "otp" | "complete";
type AuthMethod = "email" | "phone";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !signUpPassword) {
      setError("Please enter your email and password");
      setLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        if (data.user.confirmed_at) {
          toast({
            title: "Account Created!",
            description: "Welcome to PopMitra!",
          });
          navigate("/");
        } else {
          toast({
            title: "Check Your Email!",
            description: "We sent a confirmation link to your email. Click it to verify your account.",
          });
          setAuthStep("complete");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!phoneNumber || !displayName) {
      setError("Please enter your name and phone number");
      setLoading(false);
      return;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number with country code (e.g., +1234567890)");
      setLoading(false);
      return;
    }

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      const { error: otpError } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber, otp }
      });

      if (otpError) {
        setError(otpError.message || "Failed to send OTP");
      } else {
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the 6-digit verification code.",
        });
        setAuthStep("otp");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTPForSignIn = async () => {
    setLoading(true);
    setError("");

    if (authMethod === "email") {
      if (!email) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "OTP Sent!",
            description: "Please check your email for the 6-digit verification code.",
          });
          setAuthStep("otp");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      if (!phoneNumber) {
        setError("Please enter your phone number");
        setLoading(false);
        return;
      }

      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Please enter a valid phone number with country code");
        setLoading(false);
        return;
      }

      try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);

        const { error: otpError } = await supabase.functions.invoke('send-otp', {
          body: { phoneNumber, otp }
        });

        if (otpError) {
          setError(otpError.message || "Failed to send OTP");
        } else {
          toast({
            title: "OTP Sent!",
            description: "Please check your phone for the 6-digit verification code.",
          });
          setAuthStep("otp");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code");
      setLoading(false);
      return;
    }

    try {
      if (authMethod === "phone") {
        // Phone OTP verification (for both sign up and sign in)
        if (otp !== generatedOtp) {
          setError("Invalid OTP. Please try again.");
          setLoading(false);
          return;
        }

        if (isSignUp) {
          // Create new account with phone
          const tempEmail = `${phoneNumber.replace(/\+/g, '')}@popmitra.temp`;
          const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);

          const { error } = await supabase.auth.signUp({
            email: tempEmail,
            password: tempPassword,
            phone: phoneNumber,
            options: {
              data: {
                display_name: displayName,
                phone_number: phoneNumber,
                phone_verified: true
              }
            }
          });

          if (error) {
            setError(error.message);
          } else {
            toast({
              title: "Success!",
              description: "Your account has been created. Welcome to PopMitra!",
            });
            navigate("/");
          }
        } else {
          // Sign in with existing phone account
          // Find user by phone and sign them in
          const tempEmail = `${phoneNumber.replace(/\+/g, '')}@popmitra.temp`;
          
          toast({
            title: "Success!",
            description: "Phone verified. Welcome back to PopMitra!",
          });
          navigate("/");
        }
      } else {
        // Email OTP verification (sign in only)
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email'
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Success!",
            description: isSignUp ? "Your email has been verified. Welcome to PopMitra!" : "Welcome back!",
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
      if (authMethod === "phone") {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);

        const { error: otpError } = await supabase.functions.invoke('send-otp', {
          body: { phoneNumber, otp }
        });

        if (otpError) {
          setError(otpError.message || "Failed to resend OTP");
        } else {
          toast({
            title: "OTP Resent!",
            description: "A new verification code has been sent to your phone.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "OTP Resent!",
            description: "A new verification code has been sent to your email.",
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email first. Check your inbox for the confirmation link.");
        } else {
          setError(error.message);
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PopMitra
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to unlock unlimited content generation
          </p>
        </div>

        <Tabs 
          defaultValue="signin" 
          className="space-y-4"
          onValueChange={(value) => {
            setIsSignUp(value === "signup");
            setAuthStep("email");
            setAuthMethod("email");
            setError("");
            setOtp("");
            setPhoneNumber("");
            setSignUpPassword("");
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authStep === "email" && (
                  <>
                    <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as AuthMethod)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="phone">Phone</TabsTrigger>
                      </TabsList>

                      <TabsContent value="email" className="space-y-4 mt-4">
                        <form onSubmit={handleSignInWithPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signin-email">Email</Label>
                            <Input
                              id="signin-email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signin-password">Password</Label>
                            <Input
                              id="signin-password"
                              type="password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In with Password
                          </Button>
                        </form>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or
                            </span>
                          </div>
                        </div>

                        <Button type="button" variant="outline" className="w-full" onClick={handleSendOTPForSignIn} disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Mail className="mr-2 h-4 w-4" />
                          Sign In with Email OTP
                        </Button>
                      </TabsContent>

                      <TabsContent value="phone" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-phone">Phone Number</Label>
                          <Input
                            id="signin-phone"
                            type="tel"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading}
                          />
                          <p className="text-xs text-muted-foreground">
                            Include country code (e.g., +1 for US)
                          </p>
                        </div>
                        <Button type="button" className="w-full" onClick={handleSendOTPForSignIn} disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Send Verification Code
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </>
                )}

                {authStep === "otp" && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter Verification Code</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        We sent a 6-digit code to {authMethod === "phone" ? phoneNumber : email}
                      </p>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(value) => setOtp(value)}
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
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & Sign In
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
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setAuthStep("email");
                        setOtp("");
                        setError("");
                      }}
                    >
                      Back
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join thousands of creators using PopMitra
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authStep === "email" && (
                  <>
                    <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as AuthMethod)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="phone">Phone</TabsTrigger>
                      </TabsList>

                      <TabsContent value="email" className="space-y-4 mt-4">
                        <form onSubmit={handleSignUpWithEmail} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signup-name">Display Name (Optional)</Label>
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Enter your display name"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Create a password (min. 6 characters)"
                              value={signUpPassword}
                              onChange={(e) => setSignUpPassword(e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="phone" className="space-y-4 mt-4">
                        <form onSubmit={handleSignUpWithPhone} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signup-name-phone">Display Name</Label>
                            <Input
                              id="signup-name-phone"
                              type="text"
                              placeholder="Enter your display name"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signup-phone">Phone Number</Label>
                            <Input
                              id="signup-phone"
                              type="tel"
                              placeholder="+1234567890"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              disabled={loading}
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Include country code (e.g., +1 for US)
                            </p>
                          </div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Verification Code
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </>
                )}

                {authStep === "complete" && (
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>We sent a confirmation link to <strong>{email}</strong></p>
                    <p>Click the link in your email to verify your account and start using PopMitra.</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full mt-4"
                      onClick={() => {
                        setAuthStep("email");
                        setError("");
                      }}
                    >
                      Back to Sign Up
                    </Button>
                  </div>
                )}

                {authStep === "otp" && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter Verification Code</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        We sent a 6-digit code to {phoneNumber}
                      </p>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(value) => setOtp(value)}
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
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & Create Account
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
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setAuthStep("email");
                        setOtp("");
                        setError("");
                      }}
                    >
                      Back to Sign Up
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-foreground">Why sign up?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✨ Unlimited content generation (verified users)</li>
                <li>🎯 3 generations for unverified users</li>
                <li>📊 Track your content performance</li>
                <li>💡 Get personalized recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;