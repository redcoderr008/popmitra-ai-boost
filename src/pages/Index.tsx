import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InputSection } from "@/components/InputSection";
import { ResultsSection } from "@/components/ResultsSection";
import { PricingSection } from "@/components/PricingSection";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { description }
      });
      
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
      
      setGeneratedContent(data);
      
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
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
        title: "Regeneration failed",
        description: error instanceof Error ? error.message : "Please try again",
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
          />
        </div>
        
        <div ref={resultsRef}>
          <ResultsSection 
            content={generatedContent}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        </div>
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <About />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
