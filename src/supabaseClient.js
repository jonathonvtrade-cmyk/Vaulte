import { createClient } from '@supabase/supabase-js'

// Hard-coded fallback values — the anon key is the public browser key,
// safe to include in client-side code.
const FALLBACK_URL = 'https://dewuhgrqwarelmcgddfk.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRld3VoZ3Jxd2FyZWxtY2dkZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDY3ODksImV4cCI6MjA5NTMyMjc4OX0.vItdDOBBz8Lf1S8952p9_k1adZVg6aWN9h_Bv7PTvcc'

// Validate that env vars are actual values, not placeholder names.
// If the Vercel dashboard was misconfigured (e.g. value = "VITE_SUPABASE_URL"
// instead of the real URL), supabase-js would call new URL("VITE_SUPABASE_URL")
// which throws TypeError: Invalid URL and crashes the entire bundle.
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = (rawUrl && rawUrl.startsWith('https://'))
  ? rawUrl
  : FALLBACK_URL

const supabaseKey = (rawKey && rawKey.startsWith('eyJ'))
  ? rawKey
  : FALLBACK_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
