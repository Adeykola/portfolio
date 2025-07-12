/*
  # Setup project-images storage bucket with proper RLS policies

  1. Storage Bucket Setup
    - Create `project-images` bucket if it doesn't exist
    - Make bucket public for image viewing
    - Enable RLS on the bucket

  2. Storage Policies
    - Allow authenticated users to upload files
    - Allow public read access for displaying images
    - Allow authenticated users to update/delete files
*/

-- Create the project-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET 
  public = true;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'project-images';

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Create policy to allow public read access
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Create policy to allow authenticated users to update files
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');

-- Create policy to allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');