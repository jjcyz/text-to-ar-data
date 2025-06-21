import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Prompt {
  id: string
  text: string
  created_at: string
}

export interface Model {
  id: string
  prompt_id: string
  model_url: string
  created_at: string
}

export interface Feedback {
  id: string
  model_id: string
  feedback: 'up' | 'down'
  created_at: string
}
