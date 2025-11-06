import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: 'pro' | 'business';
  planPrice: string;
}

const paymentSchema = z.object({
  transactionCode: z.string()
    .trim()
    .min(5, "Transaction code must be at least 5 characters")
    .max(100, "Transaction code must be less than 100 characters"),
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
});

export const PaymentModal = ({ open, onOpenChange, plan, planPrice }: PaymentModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'qr' | 'form' | 'success'>('qr');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    transactionCode: "",
    name: "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    setStep('form');
  };

  const handleBack = () => {
    setStep('qr');
  };

  const validateForm = () => {
    try {
      paymentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit payment verification",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("payment_verifications")
        .insert({
          user_id: user.id,
          transaction_code: formData.transactionCode,
          name: formData.name,
          email: formData.email,
          plan: plan,
          status: 'pending'
        });

      if (error) throw error;

      setStep('success');
      toast({
        title: "Success",
        description: "Your payment verification has been submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Error",
        description: "Failed to submit payment verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('qr');
    setFormData({
      transactionCode: "",
      name: "",
      email: user?.email || "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'qr' && (
          <>
            <DialogHeader>
              <DialogTitle>Payment for {plan === 'pro' ? 'Pro' : 'Business'} Plan</DialogTitle>
              <DialogDescription>
                Scan the QR code below to make payment of {planPrice}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
                <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center mb-4">
                  {/* Placeholder for QR code - replace with actual QR code image */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Mobile Banking QR Code</p>
                    <div className="w-48 h-48 bg-card border-2 border-dashed border-border flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">QR Code Here</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium">Amount: {planPrice}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Open your mobile banking app</li>
                  <li>Scan the QR code above</li>
                  <li>Complete the payment of {planPrice}</li>
                  <li>Save your transaction code</li>
                  <li>Click "I've Made Payment" below</li>
                </ol>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                I've Made Payment
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Enter Payment Details</DialogTitle>
              <DialogDescription>
                Please provide your transaction details for verification
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionCode">Transaction Code *</Label>
                <Input
                  id="transactionCode"
                  value={formData.transactionCode}
                  onChange={(e) => setFormData({ ...formData, transactionCode: e.target.value })}
                  placeholder="Enter your transaction code"
                  required
                  maxLength={100}
                />
                {errors.transactionCode && (
                  <p className="text-sm text-destructive">{errors.transactionCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>Verification Submitted</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-success" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Your payment verification has been submitted successfully!
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team will verify your payment within 24 hours. You'll receive an email once your subscription is activated.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
