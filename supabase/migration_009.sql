-- migration_009.sql
-- RLS policies for community_posts deletion.
-- Run this in the Supabase SQL Editor.

-- Drop existing delete policies if they exist to avoid conflicts
DROP POLICY IF EXISTS allow_admin_delete ON community_posts;
DROP POLICY IF EXISTS allow_own_delete   ON community_posts;

-- Admins can delete any post
CREATE POLICY allow_admin_delete ON community_posts
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can delete their own posts
CREATE POLICY allow_own_delete ON community_posts
FOR DELETE USING (auth.uid() = user_id);
