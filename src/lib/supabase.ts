import { createClient } from '@supabase/supabase-js'

// テストモード用のダミー値
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-anon-key-for-test-mode'

// テストモードでは実際の接続は行わない
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベースの型定義
export interface Project {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: string
  project_id: string
  name: string
  category: string
  quantity: number
  assignee?: string
  notes?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  project_id: string
  name: string
  type: 'storyboard' | 'script' | 'schedule' | 'other'
  file_path: string
  created_at: string
  updated_at: string
} 