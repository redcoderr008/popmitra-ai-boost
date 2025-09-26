import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, MessageCircle, Sparkles, Users, Zap, Trophy } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            About PopMitra
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your AI-powered companion for creating viral social media content. We help content creators, influencers, and businesses optimize their videos for maximum engagement across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">AI-Powered Optimization</h3>
            <p className="text-muted-foreground">
              Advanced algorithms analyze trending patterns to generate titles, descriptions, and hashtags that maximize your content's viral potential.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Multi-Platform Support</h3>
            <p className="text-muted-foreground">
              Optimized content suggestions for YouTube, Instagram, TikTok, Twitter, and other major social media platforms.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Proven Results</h3>
            <p className="text-muted-foreground">
              Join thousands of creators who have increased their engagement rates by up to 300% using our AI-generated content strategies.
            </p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Connect With Us</h3>
            <p className="text-muted-foreground">
              Follow our journey and get the latest updates on social media optimization
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a 
              href="https://github.com/redcoder-008" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub
              </Button>
            </a>
            
            <a 
              href="https://x.com/karankewat_008" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                Twitter
              </Button>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/krnkmt/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </Button>
            </a>
            
            <a 
              href="https://wa.me/9779804005610" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Support
              </Button>
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Reach out to our customer support via WhatsApp at{" "}
              <a 
                href="https://wa.me/9779804005610" 
                className="text-primary hover:underline font-medium"
                target="_blank" 
                rel="noopener noreferrer"
              >
                +977 9804005610
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};