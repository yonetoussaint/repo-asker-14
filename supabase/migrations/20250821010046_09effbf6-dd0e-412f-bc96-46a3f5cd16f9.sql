-- Assign existing books to different sellers
UPDATE products 
SET seller_id = 'd4bef095-fb57-4eaa-89f3-d54776735658' -- Sports Central
WHERE product_type = 'books' AND name = 'Cooking for Beginners';

UPDATE products 
SET seller_id = 'ba105311-531d-4975-a646-f223a9c5ab0d' -- Mima  
WHERE product_type = 'books' AND name = 'Financial Freedom Guide';

UPDATE products 
SET seller_id = '1fa13d0a-b2d1-45da-9e7e-ef3b8a3c3041' -- Fashion Hub
WHERE product_type = 'books' AND name = 'Digital Marketing Mastery';

UPDATE products 
SET seller_id = '74a5e2e0-f07b-4f3e-83f3-b918d18b2cb4' -- Home & Garden
WHERE product_type = 'books' AND name = 'The Art of Photography';

UPDATE products 
SET seller_id = '7f4e937f-d215-4e86-a286-8cfa3e8b4525' -- Mima (second one)
WHERE product_type = 'books' AND name = 'JavaScript Fundamentals';