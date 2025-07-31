-- Update existing users with plain text passwords for testing
-- WARNING: This is for testing only! Never use plain text passwords in production!

-- Update admin user
UPDATE public.users 
SET password_hash = 'password'
WHERE email = 'user1@gmail.com';

-- Update regular user
UPDATE public.users 
SET password_hash = 'password'
WHERE email = 'user2@gmail.com';

-- Verify the updates
SELECT id, username, email, password_hash, user_role, is_active 
FROM public.users 
ORDER BY created_at; 