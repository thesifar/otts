import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Admin } from './components/Admin';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      {currentView === 'home' ? <Home /> : <Admin />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
