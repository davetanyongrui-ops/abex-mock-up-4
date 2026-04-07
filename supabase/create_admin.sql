-- ABEX ADMIN AUTO-CREATE SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Variables for user (Change these if needed)
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@gmail.com';
  admin_pass TEXT := '@AbexAdmin2026!'; -- Your strong password
BEGIN
  -- 3. Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    -- 4. Insert into auth.users
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
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_pass, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- 5. Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, admin_email)::jsonb,
      'email',
      new_user_id::text, -- For email provider, provider_id is the user's UUID
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'Admin user with email % already exists.', admin_email;
  END IF;
END $$;
