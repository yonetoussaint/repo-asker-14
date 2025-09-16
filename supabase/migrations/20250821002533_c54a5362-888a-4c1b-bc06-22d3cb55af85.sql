-- Insert digital products for existing sellers
INSERT INTO products (
  name, 
  description, 
  price, 
  discount_price, 
  product_type, 
  tags, 
  seller_id, 
  inventory, 
  status
) VALUES 
-- Sports Central digital products
(
  'Ultimate Fitness Training Program',
  'Complete digital fitness course with 12 weeks of structured training, nutrition guides, and workout videos. Includes downloadable meal plans and exercise tracking sheets.',
  49.99,
  39.99,
  'digital',
  ARRAY['digital', 'fitness', 'training', 'ebook'],
  'd4bef095-fb57-4eaa-89f3-d54776735658',
  999,
  'active'
),
(
  'Home Workout Equipment Guide',
  'Digital guide covering the best home gym equipment for every budget. Includes equipment reviews, space-saving solutions, and setup instructions.',
  19.99,
  14.99,
  'digital',
  ARRAY['digital', 'fitness', 'guide', 'ebook'],
  'd4bef095-fb57-4eaa-89f3-d54776735658',
  999,
  'active'
),
-- Mima digital products
(
  'Digital Art Masterclass',
  'Complete digital art course covering digital painting, illustration techniques, and software tutorials. Includes PSD files and brushes.',
  79.99,
  59.99,
  'digital',
  ARRAY['digital', 'art', 'course', 'tutorial'],
  'ba105311-531d-4975-a646-f223a9c5ab0d',
  999,
  'active'
),
(
  'Logo Design Templates Pack',
  'Collection of 50+ professional logo templates in AI and PSD formats. Perfect for businesses and freelancers.',
  29.99,
  19.99,
  'digital',
  ARRAY['digital', 'design', 'templates', 'logo'],
  'ba105311-531d-4975-a646-f223a9c5ab0d',
  999,
  'active'
),
-- Fashion Hub digital products
(
  'Fashion Styling E-Book',
  'Complete guide to personal styling, color coordination, and building a versatile wardrobe. Includes seasonal lookbooks and shopping guides.',
  24.99,
  19.99,
  'digital',
  ARRAY['digital', 'fashion', 'styling', 'ebook'],
  '1fa13d0a-b2d1-45da-9e7e-ef3b8a3c3041',
  999,
  'active'
),
(
  'Fashion Business Startup Guide',
  'Digital course on starting a fashion business, from concept to launch. Includes business plan templates and marketing strategies.',
  89.99,
  69.99,
  'digital',
  ARRAY['digital', 'fashion', 'business', 'course'],
  '1fa13d0a-b2d1-45da-9e7e-ef3b8a3c3041',
  999,
  'active'
),
-- Home & Garden digital products
(
  'Interior Design Software Course',
  'Learn professional interior design using popular software tools. Includes project files and design templates.',
  59.99,
  44.99,
  'digital',
  ARRAY['digital', 'design', 'interior', 'course'],
  '74a5e2e0-f07b-4f3e-83f3-b918d18b2cb4',
  999,
  'active'
),
(
  'Gardening Calendar & Planner',
  'Digital planner with seasonal gardening tasks, plant care schedules, and harvest tracking. Includes printable versions.',
  14.99,
  9.99,
  'digital',
  ARRAY['digital', 'gardening', 'planner', 'calendar'],
  '74a5e2e0-f07b-4f3e-83f3-b918d18b2cb4',
  999,
  'active'
),
-- Second Mima seller digital products
(
  'Photography Lightroom Presets',
  'Collection of 100+ professional Lightroom presets for various photography styles. Includes installation guide and tips.',
  34.99,
  24.99,
  'digital',
  ARRAY['digital', 'photography', 'presets', 'lightroom'],
  '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
  999,
  'active'
),
(
  'Social Media Content Templates',
  'Bundle of 200+ social media templates for Instagram, Facebook, and Twitter. Includes editable PSD and Canva files.',
  39.99,
  29.99,  
  'digital',
  ARRAY['digital', 'social-media', 'templates', 'marketing'],
  '7f4e937f-d215-4e86-a286-8cfa3e8b4525',
  999,
  'active'
);