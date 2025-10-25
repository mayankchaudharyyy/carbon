import React, { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { useAuth } from './hooks/useAuth.js';
import { AuthForm } from './components/AuthForm.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Dashboard } from './components/Dashboard.jsx';

function ElevenLabsAgent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <elevenlabs-convai agent-id="agent_1801k8dvpcwhfw5a7cw945kdzr9m"></elevenlabs-convai>
  );
}

function App() {
  const { user, loading } = useAuth();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-4">Database Setup Required</h1>
          <p className="text-gray-600 mb-6">
            Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700 mb-2">Missing environment variables:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {!supabaseUrl && <li>• VITE_SUPABASE_URL</li>}
              {!supabaseKey && <li>• VITE_SUPABASE_ANON_KEY</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dashboard />
        <ElevenLabsAgent />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
