/*
  # Add sample content for OTT platform

  ## Changes
    - Add sample YouTube videos
    - Add sample Instagram video references
    - Add sample live news streams
    - This provides demo content for the platform
*/

-- Get category IDs
DO $$
DECLARE
  youtube_cat_id uuid;
  instagram_cat_id uuid;
  news_cat_id uuid;
BEGIN
  SELECT id INTO youtube_cat_id FROM categories WHERE slug = 'youtube' LIMIT 1;
  SELECT id INTO instagram_cat_id FROM categories WHERE slug = 'instagram' LIMIT 1;
  SELECT id INTO news_cat_id FROM categories WHERE slug = 'live-news' LIMIT 1;

  -- Insert sample YouTube content
  INSERT INTO content (title, description, content_type, content_url, thumbnail_url, category_id, duration, is_featured, is_published) VALUES
    ('Getting Started with Web Development', 'Learn the basics of web development in this comprehensive tutorial', 'youtube', 'dQw4w9WgXcQ', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', youtube_cat_id, 600, true, true),
    ('Advanced React Patterns', 'Deep dive into advanced React patterns and best practices', 'youtube', 'jNQXAC9IVRw', 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800', youtube_cat_id, 900, true, true),
    ('CSS Grid Tutorial', 'Master CSS Grid layout with practical examples', 'youtube', 'M3YiPvHPcLQ', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', youtube_cat_id, 720, false, true);

  -- Insert sample Instagram content placeholders
  INSERT INTO content (title, description, content_type, content_url, thumbnail_url, category_id, duration, is_featured, is_published) VALUES
    ('Coding Tips & Tricks', 'Quick coding tips for developers', 'instagram', 'https://www.instagram.com/p/example1/', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800', instagram_cat_id, 60, false, true),
    ('Tech Product Review', 'Latest tech gadget unboxing and review', 'instagram', 'https://www.instagram.com/p/example2/', 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800', instagram_cat_id, 90, false, true);

  -- Insert sample live news streams
  INSERT INTO content (title, description, content_type, content_url, thumbnail_url, category_id, duration, is_featured, is_published) VALUES
    ('Tech News Live', '24/7 Technology news and updates', 'live_news', 'https://www.youtube.com/embed/9Auq9mYxFEE', 'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=800', news_cat_id, 0, true, true),
    ('Business News Live', 'Latest business and market updates', 'live_news', 'https://www.youtube.com/embed/dp8PhLsUcFE', 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800', news_cat_id, 0, false, true);
END $$;
