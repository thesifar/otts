import { useState, useEffect } from 'react';
import { supabase, Content, Category } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Admin() {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'youtube' as 'youtube' | 'instagram' | 'live_news' | 'uploaded',
    content_url: '',
    thumbnail_url: '',
    category_id: '',
    duration: 0,
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    loadContents();
    loadCategories();
  }, []);

  const loadContents = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contentData = {
        ...formData,
        category_id: formData.category_id || null,
        created_by: user?.id,
      };

      if (editingContent) {
        const { error } = await supabase
          .from('content')
          .update(contentData)
          .eq('id', editingContent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('content').insert(contentData);

        if (error) throw error;
      }

      resetForm();
      loadContents();
    } catch (error: any) {
      alert('Error saving content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || '',
      content_type: content.content_type,
      content_url: content.content_url,
      thumbnail_url: content.thumbnail_url || '',
      category_id: content.category_id || '',
      duration: content.duration,
      is_featured: content.is_featured,
      is_published: content.is_published,
    });
    setShowContentForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase.from('content').delete().eq('id', id);

      if (error) throw error;
      loadContents();
    } catch (error: any) {
      alert('Error deleting content: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content_type: 'youtube',
      content_url: '',
      thumbnail_url: '',
      category_id: '',
      duration: 0,
      is_featured: false,
      is_published: true,
    });
    setEditingContent(null);
    setShowContentForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setShowContentForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Content</span>
          </button>
        </div>

        {showContentForm && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Type *
                  </label>
                  <select
                    value={formData.content_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content_type: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="live_news">Live News</option>
                    <option value="uploaded">Uploaded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content URL / Video ID *
                  </label>
                  <input
                    type="text"
                    value={formData.content_url}
                    onChange={(e) =>
                      setFormData({ ...formData, content_url: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., dQw4w9WgXcQ for YouTube"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail_url: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({ ...formData, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Featured</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({ ...formData, is_published: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Published</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Content'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {content.thumbnail_url && (
                          <img
                            src={content.thumbnail_url}
                            alt={content.title}
                            className="w-16 h-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {content.title}
                          </div>
                          {content.is_featured && (
                            <span className="text-xs text-yellow-500">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {content.content_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {content.view_count}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          content.is_published
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {content.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(content)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {contents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No content added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
