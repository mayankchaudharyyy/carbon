import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { calculateCarbonFootprint } from '../lib/carbonCalculator';

const ACTIVITY_CATEGORIES = {
  transport: {
    name: 'Transport',
    subcategories: [
      { id: 'car_gasoline', name: 'Car (Gasoline)', unit: 'km' },
      { id: 'car_diesel', name: 'Car (Diesel)', unit: 'km' },
      { id: 'car_electric', name: 'Car (Electric)', unit: 'km' },
      { id: 'bus', name: 'Bus', unit: 'km' },
      { id: 'train', name: 'Train', unit: 'km' },
      { id: 'airplane', name: 'Airplane', unit: 'km' },
      { id: 'motorcycle', name: 'Motorcycle', unit: 'km' },
      { id: 'bike', name: 'Bike', unit: 'km' },
    ]
  },
  electricity: {
    name: 'Electricity',
    subcategories: [
      { id: 'kwh', name: 'Grid Electricity', unit: 'kWh' },
      { id: 'natural_gas', name: 'Natural Gas', unit: 'kWh' },
      { id: 'renewable', name: 'Renewable Energy', unit: 'kWh' },
    ]
  },
  food: {
    name: 'Food',
    subcategories: [
      { id: 'beef', name: 'Beef', unit: 'kg' },
      { id: 'pork', name: 'Pork', unit: 'kg' },
      { id: 'chicken', name: 'Chicken', unit: 'kg' },
      { id: 'fish', name: 'Fish', unit: 'kg' },
      { id: 'dairy', name: 'Dairy', unit: 'kg' },
      { id: 'vegetables', name: 'Vegetables', unit: 'kg' },
      { id: 'fruits', name: 'Fruits', unit: 'kg' },
      { id: 'grains', name: 'Grains', unit: 'kg' },
    ]
  },
  waste: {
    name: 'Waste',
    subcategories: [
      { id: 'landfill', name: 'Landfill Waste', unit: 'kg' },
      { id: 'recycling', name: 'Recycling', unit: 'kg' },
      { id: 'composting', name: 'Composting', unit: 'kg' },
    ]
  }
};

interface ActivityFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ActivityForm({ onClose, onSuccess }: ActivityFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      const carbonFootprint = calculateCarbonFootprint(
        formData.category,
        formData.subcategory,
        amount
      );

      const subcategoryInfo = ACTIVITY_CATEGORIES[formData.category as keyof typeof ACTIVITY_CATEGORIES]

      const { error } = await supabase
        .from('activities')
        .insert([
          {
            user_id: user.id,
            category: formData.category,
            subcategory: formData.subcategory,
            description: formData.description,
            amount,
            unit: subcategoryInfo?.unit || 'unit',
            carbon_footprint: carbonFootprint,
            date: formData.date
          }
        ]);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = ACTIVITY_CATEGORIES[formData.category as keyof typeof ACTIVITY_CATEGORIES];
  const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.id === formData.subcategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Select a category</option>
              {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select activity type</option>
                {selectedCategory.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Drove to work"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount {selectedSubcategory && `(${selectedSubcategory.unit})`}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {formData.category && formData.subcategory && formData.amount && (
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Estimated Carbon Footprint:</strong>{' '}
                {calculateCarbonFootprint(
                  formData.category,
                  formData.subcategory,
                  parseFloat(formData.amount) || 0
                ).toFixed(2)} kg CO₂
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Activity
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}