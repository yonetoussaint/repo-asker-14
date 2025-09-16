-- Link the user profile to the iStore seller
UPDATE profiles 
SET seller_id = 'e303b19c-13d7-48d5-a81d-197ace06d9eb'
WHERE email = 'yonetoussat25@gmail.com';

-- If profile doesn't exist, create it
INSERT INTO profiles (id, email, seller_id)
SELECT 
    auth.uid() as id,
    'yonetoussat25@gmail.com' as email,
    'e303b19c-13d7-48d5-a81d-197ace06d9eb' as seller_id
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'yonetoussat25@gmail.com');