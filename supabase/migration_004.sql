-- Migration 004: name change cooldown tracking
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_name_changed_at TIMESTAMPTZ;

-- Index for quick cooldown lookup
CREATE INDEX IF NOT EXISTS profiles_name_changed_idx ON profiles(last_name_changed_at);
