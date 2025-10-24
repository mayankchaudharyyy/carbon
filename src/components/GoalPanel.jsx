import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.js';
import { format, addMonths } from 'date-fns';

export function GoalPanel() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    target_reduction: '',
    target_date: format(addMonths(new Date(), 3), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return;
    }

    setGoals(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: user.id,
          target_reduction: parseFloat(formData.target_reduction),
          target_date: formData.target_date,
          status: 'active'
        }
      ]);

    if (error) {
      console.error('Error creating goal:', error);
      return;
    }

    setShowForm(false);
    setFormData({
      target_reduction: '',
      target_date: format(addMonths(new Date(), 3), 'yyyy-MM-dd')
    });
    fetchGoals();
  };

  const updateGoalStatus = async (goalId, status) => {
    const { error } = await supabase
      .from('goals')
      .update({ status })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    fetchGoals();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Carbon Reduction Goals</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h4 className="font-medium text-blue-900 mb-4">Set a New Goal</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Target Reduction (kg CO₂)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.target_reduction}
                onChange={(e) => setFormData({ ...formData, target_reduction: e.target.value })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h4>
          <p className="text-gray-500">Set your first carbon reduction goal to start tracking your progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                goal.status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : goal.status === 'active'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      Reduce {goal.target_reduction}kg CO₂
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      goal.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : goal.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                {goal.status === 'active' && (
                  <button
                    onClick={() => updateGoalStatus(goal.id, 'completed')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    goal.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((goal.current_footprint / goal.target_reduction) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Progress: {goal.current_footprint.toFixed(1)} / {goal.target_reduction}kg CO₂
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}