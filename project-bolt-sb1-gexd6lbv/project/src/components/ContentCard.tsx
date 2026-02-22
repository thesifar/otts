import { Content } from '../lib/supabase';
import { Play, Youtube, Instagram, Radio } from 'lucide-react';

interface ContentCardProps {
  content: Content;
  onClick: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  const getIcon = () => {
    switch (content.content_type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'live_news':
        return <Radio className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all transform hover:scale-105"
    >
      <div className="relative aspect-video bg-gray-700">
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-16 h-16 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <div className="bg-blue-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {content.is_featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}

        {content.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(content.duration)}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-gray-400">{getIcon()}</div>
          <span className="text-xs text-gray-400 uppercase">
            {content.content_type.replace('_', ' ')}
          </span>
        </div>

        <h3 className="text-white font-semibold mb-2 line-clamp-2">
          {content.title}
        </h3>

        {content.description && (
          <p className="text-gray-400 text-sm line-clamp-2">
            {content.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{content.view_count} views</span>
        </div>
      </div>
    </div>
  );
}
