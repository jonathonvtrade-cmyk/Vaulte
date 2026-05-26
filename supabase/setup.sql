-- ============================================================
-- Vaulte — Supabase setup
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ── 1. Tables ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name    TEXT,
  last_name     TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'pro' | 'team'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_progress (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche       TEXT NOT NULL,
  step_index  INTEGER NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, niche, step_index)
);

CREATE TABLE IF NOT EXISTS message_counts (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date     DATE NOT NULL,
  count    INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  niche        TEXT NOT NULL,
  content      TEXT NOT NULL,
  author_name  TEXT NOT NULL DEFAULT 'Anonymous',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email_notifications   BOOLEAN NOT NULL DEFAULT TRUE,
  roadmap_reminders     BOOLEAN NOT NULL DEFAULT TRUE,
  public_profile        BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Row Level Security ───────────────────────────────────

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_counts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings    ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "own_profile_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_profile_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own_profile_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- roadmap_progress
CREATE POLICY "own_progress_all" ON roadmap_progress FOR ALL USING (auth.uid() = user_id);

-- message_counts
CREATE POLICY "own_counts_all" ON message_counts FOR ALL USING (auth.uid() = user_id);

-- community_posts — anyone can read; only own user can insert
CREATE POLICY "posts_select_all"  ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "posts_insert_own"  ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_delete_own"  ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- user_settings
CREATE POLICY "own_settings_all" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- ── 3. Auto-create profile + settings on signup ─────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, plan)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
