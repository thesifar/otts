/*
  # OTT Platform Database Schema

  ## New Tables
  
  ### 1. profiles
    - `id` (uuid, primary key, references auth.users)
    - `email` (text)
    - `role` (text, default 'user') - 'admin' or 'user'
    - `full_name` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 2. categories
    - `id` (uuid, primary key)
    - `name` (text, unique)
    - `slug` (text, unique)
    - `description` (text)
    - `created_at` (timestamptz)
  
  ### 3. content
    - `id` (uuid, primary key)
    - `title` (text)
    - `description` (text)
    - `content_type` (text) - 'youtube', 'instagram', 'live_news', 'uploaded'
    - `content_url` (text) - URL or video ID
    - `thumbnail_url` (text)
    - `category_id` (uuid, references categories)
    - `duration` (integer) - in seconds
    - `view_count` (integer, default 0)
    - `is_featured` (boolean, default false)
    - `is_published` (boolean, default true)
    - `created_by` (uuid, references auth.users)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ### 4. content_views
    - `id` (uuid, primary key)
    - `content_id` (uuid, references content)
    - `user_id` (uuid, references auth.users)
    - `watched_at` (timestamptz)
  
  ## Security
    - Enable RLS on all tables
    - profiles: Users can read all, update own profile; Admins can manage all
    - categories: Everyone can read; Admins can manage
    - content: Everyone can read published content; Admins can manage all
    - content_views: Users can create own views; Admins can read all
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL CHECK (content_type IN ('youtube', 'instagram', 'live_news', 'uploaded')),
  content_url text NOT NULL,
  thumbnail_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  duration integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_by uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published content"
  ON content FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can read all content"
  ON content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update content"
  ON content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete content"
  ON content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create content_views table
CREATE TABLE IF NOT EXISTS content_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  watched_at timestamptz DEFAULT now()
);

ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own views"
  ON content_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own views"
  ON content_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all views"
  ON content_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(is_featured);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_views_content ON content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user ON content_views(user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Movies', 'movies', 'Feature films and cinema'),
  ('TV Shows', 'tv-shows', 'Television series and episodes'),
  ('YouTube', 'youtube', 'YouTube videos'),
  ('Instagram', 'instagram', 'Instagram videos and reels'),
  ('Live News', 'live-news', 'Live news broadcasts'),
  ('Documentaries', 'documentaries', 'Documentary content')
ON CONFLICT (slug) DO NOTHING;