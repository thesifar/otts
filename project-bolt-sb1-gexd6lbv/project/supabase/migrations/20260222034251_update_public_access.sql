/*
  # Update public access policies

  ## Changes
    - Allow public (unauthenticated) users to view published content
    - Allow public users to view categories
    - Keep authentication required for creating content views
    - Keep admin-only access for content management

  ## Notes
    - This makes the OTT platform more accessible
    - Users can browse content without signing in
    - Sign in is required to track viewing history
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read published content" ON content;
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;

-- Create new public policies for content
CREATE POLICY "Public can read published content"
  ON content FOR SELECT
  USING (is_published = true);

-- Create new public policies for categories  
CREATE POLICY "Public can read categories"
  ON content FOR SELECT
  USING (true);

-- Update categories to allow public read
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);
