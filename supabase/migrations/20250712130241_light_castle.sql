/*
  # Fix Project Images RLS Policies

  This migration ensures that project images are publicly accessible on the frontend
  by explicitly creating RLS policies for both anonymous and authenticated users.

  ## Changes
  1. Drop existing policies to avoid conflicts
  2. Create explicit policies for anon role (public access)
  3. Create explicit policies for authenticated role (admin access)
  4. Ensure RLS is enabled
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can create project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON project_images;

-- Enable RLS on project_images table
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (public) users to read project images
CREATE POLICY "Allow public read access to project images"
  ON project_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to manage project images
CREATE POLICY "Allow authenticated users to insert project images"
  ON project_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project images"
  ON project_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project images"
  ON project_images
  FOR DELETE
  TO authenticated
  USING (true);