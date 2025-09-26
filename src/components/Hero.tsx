import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="PopMitra Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Content Optimization</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Make Your Videos
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent block">
            Go Viral
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Generate optimized titles, descriptions, and hashtags that boost your content's reach using advanced AI technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={onGetStarted}
            className="text-lg px-8 py-6 h-auto group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex items-center gap-2 text-white/80">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">5 free generations daily</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">10K+</div>
            <div className="text-white/70">Content Creators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">2M+</div>
            <div className="text-white/70">Titles Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">85%</div>
            <div className="text-white/70">Increased Engagement</div>
          </div>
        </div>
      </div>
    </section>
  );
};