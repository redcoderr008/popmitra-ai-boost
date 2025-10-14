import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useComingSoon } from "@/hooks/useComingSoon";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out PopMitra",
    icon: Star,
    features: [
      "5 generations per day",
      "Basic titles & descriptions",
      "Up to 10 hashtags",
      "Community support"
    ],
    cta: "Try Free Now",
    popular: false,
    variant: "outline" as const
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    description: "For serious content creators",
    icon: Zap,
    features: [
      "Unlimited generations",
      "Advanced SEO optimization",
      "Up to 30 trending hashtags",
      "Thumbnail suggestions",
      "Best posting time analysis",
      "Save & export results",
      "Priority support"
    ],
    cta: "Start Pro Trial",
    popular: true,
    variant: "hero" as const
  },
  {
    name: "Business",
    price: "$69",
    period: "/month",
    description: "For teams and agencies",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Bulk content processing",
      "Team collaboration",
      "Analytics dashboard",
      "White-label options",
      "Custom integrations",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    popular: false,
    variant: "default" as const
  }
];

export const PricingSection = () => {
  const { showComingSoon } = useComingSoon();
  return (
    <section className="py-20 px-6 bg-gradient-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as your content creation grows. All plans include our core AI-powered optimization features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.name} 
                className={`
                  shadow-medium animate-slide-up relative overflow-hidden
                  transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-strong
                  ${plan.popular ? 'ring-2 ring-primary shadow-strong' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={plan.popular ? 'pt-12' : ''}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full"
                    onClick={showComingSoon}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Free plan requires no signup • Pro plans include 7-day free trial • Cancel anytime
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};