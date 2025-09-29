import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Wand2, Upload, Type, Lock, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface GenerationSettings {
  language: string;
  tone: string;
  audience: string;
  contentType: string;
}

interface InputSectionProps {
  onGenerate: (description: string, settings?: GenerationSettings) => void;
  isGenerating: boolean;
  remainingGenerations: number | string;
  isAuthenticated: boolean;
}

export const InputSection = ({ onGenerate, isGenerating, remainingGenerations, isAuthenticated }: InputSectionProps) => {
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    language: "english",
    tone: "engaging",
    audience: "general",
    contentType: "general"
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === "text" && description.trim()) {
      onGenerate(description.trim(), settings);
    } else if (inputMode === "upload" && uploadedFile) {
      // Generate description based on uploaded video
      const fileDescription = `Video file: ${uploadedFile.name} (${(uploadedFile.size / (1024 * 1024)).toFixed(2)}MB)`;
      onGenerate(fileDescription, settings);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, MOV, AVI)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
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

      if (error) throw error;

      setUploadedFile(file);
      toast({
        title: "Video uploaded successfully",
        description: "Your video has been uploaded and is ready for content generation",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoUpload(file);
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
            Tell us about your video content or upload a video file, and we'll generate viral-ready titles, descriptions, and hashtags.
          </p>
        </div>

        <Card className="shadow-medium animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Content Description
            </CardTitle>
            
            {/* Mode Selector */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={inputMode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("text")}
                className="flex items-center justify-center gap-2"
              >
                <Type className="w-4 h-4" />
                Text Description
              </Button>
              <Button
                variant={inputMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!user) {
                    setShowSignInDialog(true);
                    return;
                  }
                  setInputMode("upload");
                }}
                className="flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Video
                {!user && <Lock className="w-3 h-3 ml-1" />}
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
                    className="min-h-32 resize-none text-sm sm:text-base"
                    disabled={isGenerating}
                  />
                  <div className="text-sm text-muted-foreground">
                    {description.length}/500 characters
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center bg-muted/50 hover:bg-muted/70 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="video-upload" className="cursor-pointer block">
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-lg font-medium text-muted-foreground mb-2">
                            Uploading...
                          </p>
                        </>
                      ) : uploadedFile ? (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-green-500" />
                          <p className="text-lg font-medium text-foreground mb-2">
                            Video Uploaded Successfully
                          </p>
                          <p className="text-sm text-muted-foreground mb-2 break-all">
                            {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)}MB)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to upload a different video
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium text-muted-foreground mb-2">
                            Upload Video File
                          </p>
                          <p className="text-sm text-muted-foreground px-2">
                            Click to select or drag & drop your video file here
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supports MP4, WebM, MOV, AVI (max 100MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium mb-1">Ready for content generation:</p>
                      <p>We'll analyze your video and generate optimized titles, descriptions, and hashtags based on the content.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Settings */}
              <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Advanced Settings (Optional)
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Language</label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="nepali">Nepali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Tone</label>
                      <Select
                        value={settings.tone}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engaging">Engaging</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="funny">Funny</SelectItem>
                          <SelectItem value="dramatic">Dramatic</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Target Audience</label>
                      <Select
                        value={settings.audience}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, audience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Audience</SelectItem>
                          <SelectItem value="teens">Teens (13-19)</SelectItem>
                          <SelectItem value="young-adults">Young Adults (20-35)</SelectItem>
                          <SelectItem value="adults">Adults (35-50)</SelectItem>
                          <SelectItem value="seniors">Seniors (50+)</SelectItem>
                          <SelectItem value="kids">Kids & Families</SelectItem>
                          <SelectItem value="professionals">Professionals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Content Type</label>
                      <Select
                        value={settings.contentType}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, contentType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="food">Food & Cooking</SelectItem>
                          <SelectItem value="fitness">Fitness & Health</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="art">Art & Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Button
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full"
                disabled={
                  (inputMode === "text" && !description.trim()) || 
                  (inputMode === "upload" && !uploadedFile) || 
                  isGenerating || 
                  isUploading
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
              
              {/* Usage Counter */}
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated ? (
                    <span className="text-success font-medium">✨ Unlimited generations</span>
                  ) : (
                    <span>
                      {remainingGenerations} free generation{remainingGenerations !== 1 ? 's' : ''} remaining
                    </span>
                  )}
                </p>
                {!isAuthenticated && remainingGenerations === 0 && (
                  <p className="text-sm text-primary font-medium mt-1">
                    <a href="/auth" className="underline hover:no-underline">
                      Sign in for unlimited generations
                    </a>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Dialog */}
        <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sign In Required
              </DialogTitle>
              <DialogDescription className="text-left">
                You need to be signed in to upload video files for content generation. 
                Sign in to access this feature and get personalized content recommendations.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link to="/auth" className="flex-1">
                <Button className="w-full" onClick={() => setShowSignInDialog(false)}>
                  Sign In Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setShowSignInDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};