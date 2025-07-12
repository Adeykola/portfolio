/*
  # Add image_url column to projects table

  1. Changes
    - Add `image_url` column to `projects` table
    - Column type: text (nullable)
    - Default value: null

  This fixes the schema cache error where the application expects an image_url column that doesn't exist in the database.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN image_url text;
  END IF;
END $$;