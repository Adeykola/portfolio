/*
  # Add contacts table for contact form submissions

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `status` (text, default: 'new')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contacts` table
    - Add policy for authenticated users to manage contacts
    - Add policy for anyone to insert contacts (for contact form)
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact forms
CREATE POLICY "Anyone can submit contact forms"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all contacts
CREATE POLICY "Authenticated users can read contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update contact status
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);