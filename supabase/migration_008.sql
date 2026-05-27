-- migration_008.sql
-- Correct admin email — was incorrectly set to jonathon8604@gmail.com.
-- Only jonathonv.trade@gmail.com should have admin role.

UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'jonathonv.trade@gmail.com');

UPDATE profiles
SET role = 'user'
WHERE id != (SELECT id FROM auth.users WHERE email = 'jonathonv.trade@gmail.com');
