import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.js';

export function AchievementPanel({ expanded = false }) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return;
    }

    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return;
    }

    setUserAchievements(data || []);
    setLoading(false);
  };

  const isAchievementUnlocked = (achievementId) => {
    return userAchievements.some((ua) => ua.achievement_id === achievementId);
  };

  const displayAchievements = expanded ? achievements : achievements.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        <Award className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {displayAchievements.map((achievement, index) => {
          const isUnlocked = isAchievementUnlocked(achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isUnlocked 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-medium ${isUnlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </h4>
                  {isUnlocked && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {achievement.points} pts
                    </span>
                  )}
                </div>
                <p className={`text-sm ${isUnlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!expanded && achievements.length > 3 && (
        <div className="mt-4 text-center">
           
        </div>
      )}
    </div>
  );
}