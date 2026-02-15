
-- Create resources storage bucket (private, accessed via signed URLs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the resources bucket
CREATE POLICY "Authenticated users can upload resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read their own uploads
CREATE POLICY "Users can read their own resource files"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to read all resource files
CREATE POLICY "Admins can read all resource files"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));

-- Allow users to delete their own resource files
CREATE POLICY "Users can delete their own resource files"
ON storage.objects FOR DELETE
USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);
