-- Get the user ID for the email and link to seller
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get user ID from auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'yonetoussat25@gmail.com';
    
    -- If user found, insert/update profile
    IF user_uuid IS NOT NULL THEN
        INSERT INTO profiles (id, email, seller_id)
        VALUES (user_uuid, 'yonetoussat25@gmail.com', 'e303b19c-13d7-48d5-a81d-197ace06d9eb')
        ON CONFLICT (id) DO UPDATE SET
            seller_id = 'e303b19c-13d7-48d5-a81d-197ace06d9eb',
            email = 'yonetoussat25@gmail.com';
    END IF;
END $$;