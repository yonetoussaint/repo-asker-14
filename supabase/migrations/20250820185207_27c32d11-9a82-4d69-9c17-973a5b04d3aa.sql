-- First, drop the existing check constraint and create a new one that includes 'books'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;

-- Add a new constraint that includes 'books' as a valid product type
ALTER TABLE products ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('single', 'bundle', 'books'));

-- Now insert the sample ebook products
INSERT INTO products (name, description, price, discount_price, product_type, tags, inventory, flash_deal, flash_start_time) VALUES 
('Digital Marketing Mastery', 'Complete guide to modern digital marketing strategies', 29.99, 19.99, 'books', ARRAY['books', 'ebooks', 'marketing', 'business'], 100, true, NOW()),
('JavaScript Fundamentals', 'Learn JavaScript from basics to advanced concepts', 39.99, 24.99, 'books', ARRAY['books', 'ebooks', 'programming', 'web-development'], 100, true, NOW()),
('The Art of Photography', 'Master the fundamentals of photography', 24.99, 14.99, 'books', ARRAY['books', 'ebooks', 'photography', 'art'], 100, true, NOW()),
('Cooking for Beginners', 'Essential cooking techniques and recipes', 19.99, 12.99, 'books', ARRAY['books', 'ebooks', 'cooking', 'lifestyle'], 100, true, NOW()),
('Financial Freedom Guide', 'Build wealth and achieve financial independence', 34.99, 22.99, 'books', ARRAY['books', 'ebooks', 'finance', 'self-help'], 100, true, NOW());

-- Add some product images for the ebooks
INSERT INTO product_images (product_id, src, alt) 
SELECT p.id, 'https://placehold.co/300x400/4F46E5/FFFFFF?text=' || REPLACE(p.name, ' ', '+'), p.name
FROM products p 
WHERE p.product_type = 'books' AND p.name IN ('Digital Marketing Mastery', 'JavaScript Fundamentals', 'The Art of Photography', 'Cooking for Beginners', 'Financial Freedom Guide');