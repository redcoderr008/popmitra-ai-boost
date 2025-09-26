import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Upload, Type } from "lucide-react";

interface InputSectionProps {
  onGenerate: (description: string) => void;
  isGenerating: boolean;
}

export const InputSection = ({ onGenerate, isGenerating }: InputSectionProps) => {
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onGenerate(description.trim());
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Describe Your Content
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your video content and we'll generate viral-ready titles, descriptions, and hashtags.
          </p>
        </div>

        <Card className="shadow-medium animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Content Description
            </CardTitle>
            
            {/* Mode Selector */}
            <div className="flex gap-2">
              <Button
                variant={inputMode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("text")}
                className="flex items-center gap-2"
              >
                <Type className="w-4 h-4" />
                Text Description
              </Button>
              <Button
                variant={inputMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("upload")}
                className="flex items-center gap-2"
                disabled
              >
                <Upload className="w-4 h-4" />
                Upload Video (Coming Soon)
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputMode === "text" ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Describe your video content... 

Example: 'A travel vlog showing the top 5 hidden beaches in Bali with stunning sunset shots, local food recommendations, and budget travel tips for backpackers.'"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32 resize-none"
                    disabled={isGenerating}
                  />
                  <div className="text-sm text-muted-foreground">
                    {description.length}/500 characters
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Video Upload Coming Soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upload your video files to automatically extract content and generate optimized metadata.
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full"
                disabled={!description.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};