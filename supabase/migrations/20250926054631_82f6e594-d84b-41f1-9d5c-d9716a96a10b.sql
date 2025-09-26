-- Create a storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', false);

-- Create policies for video uploads - only authenticated users can upload
CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own videos
CREATE POLICY "Users can view their own videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);