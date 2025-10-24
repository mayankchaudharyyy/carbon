import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingDown, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

export function SuggestionPanel({ expanded = false }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('potential_reduction', { ascending: false });

    if (error) {
      console.error('Error fetching suggestions:', error);
      return;
    }

    setSuggestions(data || []);
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴'
    };
    return icons[difficulty] || '⚪';
  };

  const displaySuggestions = expanded ? suggestions : suggestions.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Eco-Friendly Suggestions</h3>
        <Lightbulb className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="space-y-4">
        {displaySuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-emerald-900">{suggestion.title}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                  {getDifficultyIcon(suggestion.difficulty)} {suggestion.difficulty}
                </span>
              </div>
            </div>
            <p className="text-sm text-emerald-800 mb-3">{suggestion.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-emerald-700">
                <TrendingDown className="w-4 h-4" />
                <span>Reduces {suggestion.potential_reduction}kg CO₂/year</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <Clock className="w-4 h-4" />
                <span className="capitalize">{suggestion.difficulty} to implement</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!expanded && suggestions.length > 3 && (
        <div className="mt-4 text-center">
           
        </div>
      )}
    </div>
  );
}