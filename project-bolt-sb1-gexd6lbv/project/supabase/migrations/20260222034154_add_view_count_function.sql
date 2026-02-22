/*
  # Add view count increment function

  ## Changes
    - Create a function to increment the view count for content
    - This function will be called when a user views content
    - Safely increments the counter without race conditions
*/

CREATE OR REPLACE FUNCTION increment_view_count(content_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE content
  SET view_count = view_count + 1
  WHERE id = content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
