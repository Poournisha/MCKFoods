/*
# Create Custom Admin User

## Purpose
Create a new admin user with custom credentials:
- Username: mangocitykitchen
- Email: mangocitykitchen@mckfoods.com
- Password: paramscottage
- Role: admin

## Changes
1. Create user in auth.users table
2. Create corresponding profile with admin role
3. Remove old mock admin user

## Security
- Password is securely hashed by Supabase Auth
- Admin role assigned in profiles table
*/

-- Create the new admin user with Supabase Auth
-- Note: We'll use the email format for authentication
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert into auth.users (Supabase handles password hashing)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'mangocitykitchen@mckfoods.com',
    crypt('paramscottage', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Mango City Kitchen Admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create profile for the new admin user
  INSERT INTO profiles (id, email, full_name, role, created_at)
  VALUES (
    new_user_id,
    'mangocitykitchen@mckfoods.com',
    'Mango City Kitchen Admin',
    'admin',
    NOW()
  );

  -- Delete the old mock admin user
  DELETE FROM profiles WHERE email = 'mock@example.com';
  DELETE FROM auth.users WHERE email = 'mock@example.com';

END $$;
