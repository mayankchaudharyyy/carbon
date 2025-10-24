import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export function CarbonChart({ activities }) {
  const getWeeklyData = () => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === day.toDateString();
      });

      const totalCarbon = dayActivities.reduce((sum, activity) => sum + activity.carbon_footprint, 0);

      return {
        date: format(day, 'EEE'),
        carbon: totalCarbon,
        activities: dayActivities.length
      };
    });
  };

  const getCategoryData = () => {
    const categories = activities.reduce((acc, activity) => {
      const category = activity.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += activity.carbon_footprint;
      return acc;
    }, {});

    return Object.entries(categories).map(([category, carbon]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      carbon,
      percentage: ((carbon / Object.values(categories).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }));
  };

  const weeklyData = getWeeklyData();
  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Carbon Footprint</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} kg CO₂`, 'Carbon Footprint']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="carbon" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Footprint by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} kg CO₂`, 'Carbon Footprint']}
            />
            <Bar dataKey="carbon" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}