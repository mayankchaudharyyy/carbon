import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Carbon Footprint Tracker</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-base font-bold text-gray-800 capitalize hover:text-blue-600 transition-colors duration-300">
                {profile?.full_name || user?.email}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>

          <div className="md:hidden">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex items-center gap-2 text-gray-600 px-2">
                <User className="w-4 h-4" />
                <span className="text-base font-bold text-gray-800 capitalize hover:text-blue-600 transition-colors duration-300">
                  {profile?.full_name || user?.email}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}