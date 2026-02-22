import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Content = {
  id: string;
  title: string;
  description: string | null;
  content_type: 'youtube' | 'instagram' | 'live_news' | 'uploaded';
  content_url: string;
  thumbnail_url: string | null;
  category_id: string | null;
  duration: number;
  view_count: number;
  is_featured: boolean;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
