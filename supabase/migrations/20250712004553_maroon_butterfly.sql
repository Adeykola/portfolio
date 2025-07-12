-- Create the project_images table
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for project_images
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can read project images
CREATE POLICY "Public can read project images" ON public.project_images
FOR SELECT USING (true);

-- RLS Policy: Authenticated users can create project images
CREATE POLICY "Authenticated users can create project images" ON public.project_images
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update project images
CREATE POLICY "Authenticated users can update project images" ON public.project_images
FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete project images
CREATE POLICY "Authenticated users can delete project images" ON public.project_images
FOR DELETE USING (auth.role() = 'authenticated');