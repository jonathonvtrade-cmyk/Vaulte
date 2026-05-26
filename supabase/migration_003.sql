-- ── Migration 003: roles, bio, socials, avatar, messages, announcements ──

-- Add new columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role       TEXT    DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS bio        TEXT,
  ADD COLUMN IF NOT EXISTS socials    JSONB,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS founder    BOOLEAN DEFAULT false;

-- ── messages table ──
CREATE TABLE IF NOT EXISTS messages (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id   UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name   TEXT,
  receiver_name TEXT,
  subject       TEXT        NOT NULL,
  niche         TEXT,
  content       TEXT        NOT NULL,
  read          BOOLEAN     DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can only insert messages where they are the sender
CREATE POLICY "Users insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Receivers can mark messages as read
CREATE POLICY "Receivers update read status"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- ── announcements table ──
CREATE TABLE IF NOT EXISTS announcements (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  content    TEXT        NOT NULL,
  created_by UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read announcements
CREATE POLICY "Public read announcements"
  ON announcements FOR SELECT
  USING (true);

-- Only admins/founders can create announcements
CREATE POLICY "Admins insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'founder')
    )
  );

-- ── NOTE ──
-- Create a storage bucket called 'avatars' in your Supabase dashboard:
--   Storage → New bucket → Name: avatars → Public bucket: true
-- Then add this policy in the SQL editor:
--   CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
--   CREATE POLICY "Auth avatar upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
