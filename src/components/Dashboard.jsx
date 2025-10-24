import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Plus, 
  Calendar,
  BarChart3,
  Lightbulb,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.js';
import { ActivityForm } from './ActivityForm.jsx';
import { ActivityList } from './ActivityList.jsx';
import { CarbonChart } from './CarbonChart.jsx';
import { AchievementPanel } from './AchievementPanel.jsx';
import { SuggestionPanel } from './SuggestionPanel.jsx';
import { GoalPanel } from './GoalPanel.jsx';
import { startOfMonth, endOfMonth } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [carbonStats, setCarbonStats] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    trend: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }

    setActivities(data || []);
    calculateCarbonStats(data || []);
  };

  const calculateCarbonStats = (activities) => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));

    const total = activities.reduce((sum, activity) => sum + activity.carbon_footprint, 0);
    
    const thisMonth = activities
      .filter(activity => {
        const date = new Date(activity.date);
        return date >= thisMonthStart && date <= thisMonthEnd;
      })
      .reduce((sum, activity) => sum + activity.carbon_footprint, 0);

    const lastMonth = activities
      .filter(activity => {
        const date = new Date(activity.date);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, activity) => sum + activity.carbon_footprint, 0);

    const trend = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    setCarbonStats({ total, thisMonth, lastMonth, trend });
  };

  const handleActivityAdded = () => {
    fetchActivities();
    setShowActivityForm(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'goals', label: 'Goals', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Carbon Footprint</p>
                <p className="text-2xl font-bold text-gray-900">{carbonStats.total.toFixed(1)} kg</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{carbonStats.thisMonth.toFixed(1)} kg</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                carbonStats.trend > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  carbonStats.trend > 0 ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${
                carbonStats.trend > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {carbonStats.trend > 0 ? '+' : ''}{carbonStats.trend.toFixed(1)}% from last month
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activities Logged</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
            <button 
              className="md:hidden p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden flex flex-col space-y-2 mt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <CarbonChart activities={activities} />
              <div className="space-y-6">
                <AchievementPanel />
                <SuggestionPanel />
              </div>
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Your Activities</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActivityForm(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </motion.button>
              </div>
              <ActivityList activities={activities} onUpdate={fetchActivities} />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AchievementPanel expanded />
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SuggestionPanel expanded />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GoalPanel />
            </motion.div>
          )}
        </div>
      </div>

      {showActivityForm && (
        <ActivityForm 
          onClose={() => setShowActivityForm(false)}
          onSuccess={handleActivityAdded}
        />
      )}
    </div>
  );
}