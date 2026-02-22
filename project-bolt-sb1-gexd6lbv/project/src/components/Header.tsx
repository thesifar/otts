import { useAuth } from '../contexts/AuthContext';
import { LogOut, Video, Settings } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'admin') => void;
  currentView: 'home' | 'admin';
}

export function Header({ onNavigate, currentView }: HeaderProps) {
  const { user, profile, signOut, isAdmin } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">StreamHub</h1>
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Home
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                <p className="text-xs text-gray-400">{profile?.role}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
