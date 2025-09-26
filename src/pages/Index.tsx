import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InputSection } from "@/components/InputSection";
import { ResultsSection } from "@/components/ResultsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

// Mock AI-generated content (replace with real API later)
const generateMockContent = (description: string) => {
  const templates = {
    titles: [
      "🔥 This Will BLOW Your Mind! (You Won't Believe What Happens Next)",
      "The SECRET That Everyone's Talking About - REVEALED!",
      "I Tried This For 30 Days... The Results Were INSANE",
      "VIRAL: The One Thing Nobody Tells You About...",
      "This Changes EVERYTHING! (Viral Moment Caught on Camera)"
    ],
    description: `🌟 Get ready for an incredible journey! This content will absolutely transform your perspective and leave you wanting more.

🔥 In this amazing video, you'll discover:
• Mind-blowing insights that will change everything
• Exclusive tips that most people don't know
• Behind-the-scenes secrets revealed for the first time
• Life-changing moments caught on camera

💡 Don't forget to SMASH that like button if this helped you, SUBSCRIBE for more incredible content, and SHARE with your friends who need to see this!

🔔 Turn on notifications so you never miss our latest uploads!

#Viral #MustWatch #GameChanger`,
    hashtags: [
      "#viral", "#trending", "#fyp", "#amazing", "#incredible", "#mindblown",
      "#secret", "#revealed", "#exclusive", "#behindthescenes", "#epic",
      "#insane", "#wow", "#unbelievable", "#gamechanger", "#mustsee",
      "#viralcontent", "#trending2024", "#popular", "#explore"
    ]
  };

  return templates;
};

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = generateMockContent(description);
    setGeneratedContent(content);
    setIsGenerating(false);
    
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate slightly different content
    const content = generateMockContent("regenerated");
    setGeneratedContent(content);
    setIsRegenerating(false);
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
