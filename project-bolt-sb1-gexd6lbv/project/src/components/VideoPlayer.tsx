import { useEffect } from 'react';
import { Content } from '../lib/supabase';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
  onView: () => void;
}

export function VideoPlayer({ content, onClose, onView }: VideoPlayerProps) {
  useEffect(() => {
    onView();
  }, [content.id]);

  const renderPlayer = () => {
    switch (content.content_type) {
      case 'youtube':
        const videoId = extractYouTubeId(content.content_url);
        return (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={content.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );

      case 'instagram':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <iframe
              className="w-full max-w-md h-full"
              src={`${content.content_url}embed`}
              title={content.title}
              allowFullScreen
            />
          </div>
        );

      case 'live_news':
        return (
          <iframe
            className="w-full h-full"
            src={content.content_url}
            title={content.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );

      default:
        return (
          <video
            className="w-full h-full"
            src={content.content_url}
            controls
            autoPlay
          />
        );
    }
  };

  const extractYouTubeId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return url;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <div>
          <h2 className="text-xl font-bold text-white">{content.title}</h2>
          {content.description && (
            <p className="text-gray-400 text-sm mt-1">{content.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden">
          {renderPlayer()}
        </div>
      </div>
    </div>
  );
}
