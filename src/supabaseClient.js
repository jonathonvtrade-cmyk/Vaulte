import { createClient } from '@supabase/supabase-js'

// Prefer Vite env vars; fall back to hardcoded values so the bundle
// never crashes if the vars are missing from a deployment environment.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  || 'https://dewuhgrqwarelmcgddfk.supabase.co'

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRld3VoZ3Jxd2FyZWxtY2dkZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDY3ODksImV4cCI6MjA5NTMyMjc4OX0.vItdDOBBz8Lf1S8952p9_k1adZVg6aWN9h_Bv7PTvcc'

export const supabase = createClient(supabaseUrl, supabaseKey)
