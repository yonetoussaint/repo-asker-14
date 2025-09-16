-- Add seller_id column to profiles table to link users to their stores
ALTER TABLE profiles ADD COLUMN seller_id uuid REFERENCES sellers(id);

-- Connect the user yonetoussat25@gmail.com to the iStore seller
UPDATE profiles 
SET seller_id = 'e303b19c-13d7-48d5-a81d-197ace06d9eb'
WHERE email = 'yonetoussat25@gmail.com';