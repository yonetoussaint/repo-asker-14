-- Insert sample reviews for products
INSERT INTO reviews (product_id, user_name, rating, comment, title, verified_purchase, helpful_count, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 5, 'Amazing product! Works exactly as described and arrived quickly.', 'Perfect quality', true, 12, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Mike Chen', 4, 'Good value for money. Only minor issue was the packaging could be better.', 'Good purchase', true, 8, NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Emma Wilson', 5, 'Exceeded my expectations! Highly recommend this seller.', 'Excellent!', true, 15, NOW() - INTERVAL '1 week'),
('550e8400-e29b-41d4-a716-446655440000', 'David Rodriguez', 3, 'Product is okay but took longer to arrive than expected.', 'Average experience', true, 3, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Lisa Anderson', 5, 'Outstanding quality and fast shipping. Will buy again!', 'Top notch', true, 9, NOW() - INTERVAL '3 days');

-- Update products table to add a sample product if it doesn't exist
INSERT INTO products (id, name, description, price, seller_id, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Sample Product', 'A sample product for testing reviews', 29.99, (SELECT id FROM sellers LIMIT 1), NOW())
ON CONFLICT (id) DO NOTHING;