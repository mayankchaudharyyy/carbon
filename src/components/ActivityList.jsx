import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { format } from 'date-fns';

export function ActivityList({ activities, onUpdate }) {
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting activity:', error);
      return;
    }

    onUpdate();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: '🚗',
      electricity: '⚡',
      food: '🍽️',
      waste: '🗑️',
      home: '🏠'
    };
    return icons[category] || '📊';
  };

  const getCategoryColor = (category) => {
    const colors = {
      transport: 'bg-blue-100 text-blue-800',
      electricity: 'bg-yellow-100 text-yellow-800',
      food: 'bg-green-100 text-green-800',
      waste: 'bg-red-100 text-red-800',
      home: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
        <p className="text-gray-500">Start tracking your carbon footprint by adding your first activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getCategoryIcon(activity.category)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{activity.description}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{activity.amount} {activity.unit}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {activity.carbon_footprint.toFixed(2)} kg
                  </div>
                  <div className="text-sm text-gray-500">CO₂ equivalent</div>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}