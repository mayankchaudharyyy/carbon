/*
  # Carbon Footprint Tracker Database Schema

  1. New Tables
    - `profiles` - User profiles with settings and preferences
    - `activities` - Individual carbon footprint activities
    - `achievements` - Available achievements in the system
    - `user_achievements` - User's earned achievements
    - `goals` - User's carbon reduction goals
    - `suggestions` - Eco-friendly suggestions and tips

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policy for reading public achievements and suggestions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  subcategory text,
  description text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  carbon_footprint numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value numeric NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  target_reduction numeric NOT NULL,
  current_footprint numeric DEFAULT 0,
  target_date date NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  potential_reduction numeric NOT NULL,
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for activities
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for achievements
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for suggestions
CREATE POLICY "Anyone can view suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, points) VALUES
  ('First Steps', 'Log your first activity', '🌱', 'activities_count', 1, 10),
  ('Week Warrior', 'Log activities for 7 consecutive days', '🏆', 'consecutive_days', 7, 50),
  ('Carbon Conscious', 'Reduce your carbon footprint by 10%', '🌍', 'reduction_percentage', 10, 100),
  ('Eco Explorer', 'Try 5 different eco-friendly suggestions', '🔍', 'suggestions_tried', 5, 75),
  ('Green Pioneer', 'Maintain under 2 tons CO2 per month', '⭐', 'monthly_limit', 2000, 150);

-- Insert sample suggestions
INSERT INTO suggestions (category, title, description, potential_reduction, difficulty) VALUES
  ('transport', 'Use Public Transport', 'Switch from driving to using buses, trains, or subways for daily commutes', 1200, 'easy'),
  ('transport', 'Bike to Work', 'Cycle instead of driving for short trips and daily commutes', 800, 'easy'),
  ('transport', 'Work from Home', 'Reduce commuting by working remotely 2-3 days per week', 1500, 'medium'),
  ('electricity', 'LED Light Bulbs', 'Replace incandescent bulbs with energy-efficient LED lighting', 300, 'easy'),
  ('electricity', 'Smart Thermostat', 'Install a programmable thermostat to optimize heating and cooling', 600, 'medium'),
  ('electricity', 'Solar Panels', 'Install solar panels to generate clean energy for your home', 3000, 'hard'),
  ('food', 'Meatless Mondays', 'Reduce meat consumption by having plant-based meals one day per week', 500, 'easy'),
  ('food', 'Local Produce', 'Buy locally sourced fruits and vegetables to reduce transportation emissions', 200, 'easy'),
  ('food', 'Reduce Food Waste', 'Plan meals better and compost organic waste', 400, 'medium');