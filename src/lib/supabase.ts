import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not found.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          subcategory: string | null;
          description: string;
          amount: number;
          unit: string;
          carbon_footprint: number;
          date: string;
          created_at: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          requirement_type: string;
          requirement_value: number;
          points: number;
          created_at: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          target_reduction: number;
          current_footprint: number;
          target_date: string;
          status: string;
          created_at: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          category: string;
          title: string;
          description: string;
          potential_reduction: number;
          difficulty: string;
          created_at: string;
        };
      };
    };
  };
};