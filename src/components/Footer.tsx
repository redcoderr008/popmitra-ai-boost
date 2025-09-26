import { Sparkles, Twitter, Linkedin, Github, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PopMitra</span>
            </div>
            <p className="text-background/70 text-sm">
              Make your videos go viral with AI-powered content optimization. Generate titles, descriptions, and hashtags that boost engagement.
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="https://x.com/karankewat_008" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="hover:bg-background/10">
                  <Twitter className="w-4 h-4" />
                </Button>
              </a>
              <a 
                href="https://www.linkedin.com/in/krnkmt/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="hover:bg-background/10">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </a>
              <a 
                href="https://github.com/redcoder-008" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="hover:bg-background/10">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
              <a 
                href="https://wa.me/9779804005610" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="hover:bg-background/10">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-background transition-colors">API</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">About</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/70">
            © 2024 PopMitra. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/70">
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};