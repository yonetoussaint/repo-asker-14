-- Insert sample reviews for the specific product
INSERT INTO reviews (product_id, user_name, rating, comment, title, verified_purchase, helpful_count, created_at) VALUES 
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Sarah Johnson', 5, 'Amazing product! Works exactly as described and arrived quickly.', 'Perfect quality', true, 12, NOW() - INTERVAL '2 days'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Mike Chen', 4, 'Good value for money. Only minor issue was the packaging could be better.', 'Good purchase', true, 8, NOW() - INTERVAL '5 days'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Emma Wilson', 5, 'Exceeded my expectations! Highly recommend this seller.', 'Excellent!', true, 15, NOW() - INTERVAL '1 week'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'David Rodriguez', 3, 'Product is okay but took longer to arrive than expected.', 'Average experience', true, 3, NOW() - INTERVAL '10 days'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Lisa Anderson', 5, 'Outstanding quality and fast shipping. Will buy again!', 'Top notch', true, 9, NOW() - INTERVAL '3 days'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'John Smith', 4, 'Solid product, good customer service from the seller.', 'Recommended', true, 6, NOW() - INTERVAL '8 days'),
('3e9c277d-4cdd-44a5-8c04-9f66dccd52df', 'Maria Garcia', 5, 'Perfect item, fast delivery, exactly what I ordered!', 'Five stars!', true, 11, NOW() - INTERVAL '4 days');