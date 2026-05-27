-- migration_006.sql
-- Drop the auth trigger and handler function that were causing signup errors.
-- Profile creation is now handled entirely in the frontend (SignupPage.jsx).

-- Drop the trigger first (must drop trigger before the function it references)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();

-- Remove NOT NULL constraints on first_name and last_name so a partial
-- or race-condition insert never throws a constraint violation.
ALTER TABLE profiles ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN last_name  DROP NOT NULL;
