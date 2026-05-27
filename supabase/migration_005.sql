-- migration_005.sql
-- Run this in the Supabase SQL editor

-- ── Profiles additions ──────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned  boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email   text;

-- ── contact_submissions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── announcements ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  content    text        NOT NULL,
  created_by uuid        REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read announcements"
  ON announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated can insert announcements"
  ON announcements FOR INSERT TO authenticated WITH CHECK (true);

-- ── Admin profile policies ────────────────────────────────────────────────────
-- Allow admins to read ALL profiles (needed for /admin/users)
DROP POLICY IF EXISTS "Admins read all profiles" ON profiles;
CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid()
        AND p.role IN ('admin','founder')
    )
  );

-- Allow admins to update any profile (ban, upgrade, make-admin)
DROP POLICY IF EXISTS "Admins update any profile" ON profiles;
CREATE POLICY "Admins update any profile"
  ON profiles FOR UPDATE TO authenticated
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid()
        AND p.role IN ('admin','founder')
    )
  );
