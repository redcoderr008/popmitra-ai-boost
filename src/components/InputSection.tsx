import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Upload, Type, X, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface InputSectionProps {
  onGenerate: (description: string) => void;
  isGenerating: boolean;
}

export const InputSection = ({ onGenerate, isGenerating }: InputSectionProps) => {
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === "text" && description.trim()) {
      onGenerate(description.trim());
    } else if (inputMode === "upload" && uploadedVideo) {
      const videoDescription = `Video analysis for: ${uploadedVideo.name}`;
      onGenerate(videoDescription);
    }
  };

  const validateVideoFile = (file: File): string | null => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid video file (MP4, AVI, MOV, WMV, or WebM)';
    }
    
    if (file.size > maxSize) {
      return 'Video file must be less than 100MB';
    }
    
    return null;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validationError = validateVideoFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      setUploadedVideo(file);
      toast({
        title: "Video uploaded",
        description: "Your video has been uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = () => {
    setUploadedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            Tell us about your video content or upload a video file to generate viral-ready titles, descriptions, and hashtags.
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
                disabled={!user}
              >
                <Upload className="w-4 h-4" />
                Upload Video {!user && "(Sign in required)"}
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
              ) : user ? (
                <div className="space-y-4">
                  {!uploadedVideo ? (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-lg font-medium text-foreground mb-2">
                            Uploading Video...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium text-foreground mb-2">
                            Click to Upload Video
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Support: MP4, AVI, MOV, WMV, WebM (Max 100MB)
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{uploadedVideo.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeVideo}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Sign in to Upload Videos
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to be signed in to upload and analyze video content.
                  </p>
                  <Link to="/auth">
                    <Button variant="default">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
              
              <Button 
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full"
                disabled={
                  isGenerating || 
                  (inputMode === "text" && !description.trim()) || 
                  (inputMode === "upload" && (!uploadedVideo || !user))
                }
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