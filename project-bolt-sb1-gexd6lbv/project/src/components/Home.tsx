import { useState, useEffect } from 'react';
import { supabase, Content, Category } from '../lib/supabase';
import { ContentCard } from './ContentCard';
import { VideoPlayer } from './VideoPlayer';
import { Film, Youtube, Instagram, Radio } from 'lucide-react';

export function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadContents();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadContents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (contentId: string) => {
    try {
      await supabase.from('content_views').insert({
        content_id: contentId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      await supabase.rpc('increment_view_count', { content_id: contentId });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const featuredContent = contents.filter((c) => c.is_featured);
  const youtubeContent = contents.filter((c) => c.content_type === 'youtube');
  const instagramContent = contents.filter((c) => c.content_type === 'instagram');
  const liveNewsContent = contents.filter((c) => c.content_type === 'live_news');
  const regularContent = contents.filter(
    (c) => !c.is_featured && c.content_type === 'uploaded'
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {featuredContent.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Film className="w-6 h-6" />
                  <span>Featured</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </section>
            )}

            {liveNewsContent.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Radio className="w-6 h-6" />
                  <span>Live News</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveNewsContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </section>
            )}

            {youtubeContent.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Youtube className="w-6 h-6" />
                  <span>YouTube Videos</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {youtubeContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </section>
            )}

            {instagramContent.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Instagram className="w-6 h-6" />
                  <span>Instagram Videos</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instagramContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </section>
            )}

            {regularContent.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">All Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </section>
            )}

            {contents.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No content available yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedContent && (
        <VideoPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onView={() => recordView(selectedContent.id)}
        />
      )}
    </div>
  );
}
