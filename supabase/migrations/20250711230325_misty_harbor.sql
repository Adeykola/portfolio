/*
  # Portfolio Website Database Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `technologies` (text array)
      - `live_url` (text)
      - `github_url` (text)
      - `image_url` (text)
      - `featured` (boolean)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `position` (text)
      - `company` (text)
      - `content` (text)
      - `image_url` (text)
      - `rating` (integer)
      - `featured` (boolean)
      - `created_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `percentage` (integer)
      - `order` (integer)
      - `created_at` (timestamp)

    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  technologies text[] DEFAULT '{}',
  live_url text,
  github_url text,
  image_url text,
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  company text NOT NULL,
  content text NOT NULL,
  image_url text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  percentage integer DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write policies (only authenticated users can modify)
CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', 'Adekola Afolabi'),
  ('hero_subtitle', 'Frontend Developer & UI/UX Designer'),
  ('hero_tagline', 'Merging Aesthetics with Functionality'),
  ('about_bio', 'Passionate frontend developer with expertise in React, UI/UX design, and creating beautiful, functional web experiences.'),
  ('contact_email', 'hello@adekolaafolabi.com'),
  ('contact_phone', '+234 123 456 7890'),
  ('linkedin_url', 'https://linkedin.com/in/adekolaafolabi'),
  ('github_url', 'https://github.com/adekolaafolabi'),
  ('twitter_url', 'https://twitter.com/adekolaafolabi')
ON CONFLICT (key) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, category, technologies, live_url, github_url, image_url, featured, order_index) VALUES
  ('E-Commerce Platform', 'Modern e-commerce platform with React and Node.js', 'Frontend', '{"React","TypeScript","TailwindCSS","Node.js"}', 'https://example.com', 'https://github.com', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1),
  ('Mobile Banking App', 'Intuitive mobile banking interface design', 'UI/UX', '{"Figma","Adobe XD","Principle"}', 'https://dribbble.com', '', 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800', true, 2),
  ('Brand Identity Design', 'Complete brand identity for tech startup', 'Graphics', '{"Adobe Illustrator","Photoshop","InDesign"}', 'https://behance.net', '', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', false, 3)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, position, company, content, rating, featured) VALUES
  ('Sarah Johnson', 'Product Manager', 'TechCorp', 'Adekola delivered exceptional work on our project. His attention to detail and technical expertise exceeded our expectations.', 5, true),
  ('Michael Chen', 'CEO', 'StartupXYZ', 'Working with Adekola was a game-changer for our product. His UI/UX skills transformed our user experience.', 5, true)
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, percentage, order_index) VALUES
  ('React', 'Frontend', 95, 1),
  ('TypeScript', 'Frontend', 90, 2),
  ('TailwindCSS', 'Frontend', 85, 3),
  ('Figma', 'Design', 92, 4),
  ('Adobe Creative Suite', 'Design', 88, 5),
  ('Node.js', 'Backend', 75, 6)
ON CONFLICT DO NOTHING;