import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, CheckCircle, Star, Hash, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContent {
  titles: string[];
  description: string;
  hashtags: string[];
}

interface ResultsSectionProps {
  content: GeneratedContent | null;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ResultsSection = ({ content, onRegenerate, isRegenerating }: ResultsSectionProps) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  if (!content) return null;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, `${type}-${text}`]));
      
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${type}-${text}`);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, type }: { text: string; type: string }) => {
    const isCopied = copiedItems.has(`${type}-${text}`);
    
    return (
      <Button
        variant="copy"
        size="sm"
        onClick={() => copyToClipboard(text, type)}
        className="shrink-0"
      >
        {isCopied ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    );
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Your Viral Content
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-generated titles, descriptions, and hashtags optimized for maximum engagement
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Titles */}
          <Card className="shadow-medium animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Viral Titles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.titles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Badge variant="secondary" className="shrink-0 mt-1">
                    #{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">{title}</p>
                  </div>
                  <CopyButton text={title} type="Title" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Optimized Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {content.description}
                  </p>
                </div>
                <CopyButton text={content.description} type="Description" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hashtags */}
        <Card className="shadow-medium mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Trending Hashtags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {content.hashtags.map((hashtag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-primary hover:bg-primary/10 cursor-pointer transition-colors"
                  onClick={() => copyToClipboard(hashtag, "Hashtag")}
                >
                  {hashtag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Click individual hashtags to copy, or copy all at once
                </p>
              </div>
              <CopyButton 
                text={content.hashtags.join(' ')} 
                type="All Hashtags" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};