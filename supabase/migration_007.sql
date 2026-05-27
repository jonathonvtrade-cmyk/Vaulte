-- migration_007.sql
-- Ensure only the correct account has admin role.
-- All other accounts are reset to 'user'.

UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'jonathon8604@gmail.com');

UPDATE profiles
SET role = 'user'
WHERE id != (SELECT id FROM auth.users WHERE email = 'jonathon8604@gmail.com');
