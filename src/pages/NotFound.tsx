import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6 animate-fade-in">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Oops! Page not found
          </h2>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Auto-redirect Notice */}
        <div className="mb-8 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <RotateCcw className="h-4 w-4 animate-spin" />
            Redirecting to home in {countdown} seconds
          </p>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => navigate("/")}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-medium"
        >
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Button>

        {/* Current Path Info */}
        <p className="mt-6 text-xs text-muted-foreground/70 font-mono">
          Path: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
