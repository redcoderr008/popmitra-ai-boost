import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InputSection } from "@/components/InputSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Testimonials } from "@/components/Testimonials";
import { UserMetrics } from "@/components/UserMetrics";
import { PricingSection } from "@/components/PricingSection";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { Toaster } from "@/components/ui/toaster";


const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    incrementUsage, 
    hasExceededLimit, 
    getRemainingGenerations, 
    isAuthenticated,
    isEmailVerified
  } = useUsageLimit();

  const handleGetStarted = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async (description: string, settings?: any) => {
    // Check usage limits for non-authenticated users
    if (hasExceededLimit()) {
      toast({
        title: "Free limit reached",
        description: "Sign in to continue generating unlimited content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Stage 1: Sending data
      setGenerationStatus("Sending data...");
      setGenerationProgress(20);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 2: Processing data
      setGenerationStatus("Processing data...");
      setGenerationProgress(40);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 3: Connecting to API
      setGenerationStatus("Connecting to API...");
      setGenerationProgress(60);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 4: Generating content
      setGenerationStatus("Generating content...");
      setGenerationProgress(80);
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { description, settings }
      });
      
      // Stage 5: Getting data from API
      setGenerationStatus("Getting data from API");
      setGenerationProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (!data?.titles || !data?.description || !data?.hashtags) {
        throw new Error('Invalid response format');
      }
      
      // Stage 6: Done
      setGenerationStatus("Done!");
      setGenerationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedContent(data);
      
      // Increment usage count after successful generation
      await incrementUsage();
      
      toast({
        title: "Content generated!",
        description: "Your viral content is ready",
      });
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
      setGenerationProgress(0);
    }
  };

  const handleRegenerate = async () => {
    if (!generatedContent) return;
    
    setIsRegenerating(true);
    
    try {
      // Use the previous description to regenerate
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { description: "regenerate with different creative approach" }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to regenerate content');
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (!data?.titles || !data?.description || !data?.hashtags) {
        throw new Error('Invalid response format');
      }
      
      setGeneratedContent(data);
      
      toast({
        title: "Content regenerated!",
        description: "New viral content variations are ready",
      });
      
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast({
        title: "Regeneration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero onGetStarted={handleGetStarted} />
        
        <div ref={inputRef}>
        <InputSection 
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationStatus={generationStatus}
          generationProgress={generationProgress}
          remainingGenerations={getRemainingGenerations()}
          isAuthenticated={isAuthenticated}
          isEmailVerified={isEmailVerified}
        />
        </div>
        
        <div ref={resultsRef}>
          <ResultsSection 
            content={generatedContent}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        </div>
        
        <UserMetrics />
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <Testimonials />
        
        <About />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
