-- Create iStore seller
INSERT INTO public.sellers (
  id,
  name,
  description,
  image_url,
  verified,
  rating,
  total_sales,
  followers_count,
  category,
  email,
  phone,
  address,
  trust_score,
  status
) VALUES (
  gen_random_uuid(),
  'iStore',
  'Your premium Apple authorized retailer. We offer the latest iPhone models with authentic warranty and exceptional customer service.',
  'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop&crop=center',
  true,
  4.8,
  15420,
  89500,
  'electronics',
  'support@istore.com',
  '+1-800-ISTORE',
  '123 Tech Valley Drive, Cupertino, CA 95014',
  95,
  'active'
);

-- Get the seller ID for product insertions
WITH istore_seller AS (
  SELECT id FROM sellers WHERE name = 'iStore' LIMIT 1
)
-- Insert iPhone products
INSERT INTO public.products (
  id,
  name,
  description,
  price,
  discount_price,
  category,
  tags,
  inventory,
  seller_id,
  seller_trust_score,
  status,
  location,
  product_type,
  specifications,
  bundle_deals
) 
SELECT 
  gen_random_uuid(),
  phone_data.name,
  phone_data.description,
  phone_data.price,
  phone_data.discount_price,
  'smartphones',
  phone_data.tags,
  phone_data.inventory,
  istore_seller.id,
  95,
  'active',
  'Cupertino, CA',
  'single',
  phone_data.specifications,
  phone_data.bundle_deals
FROM istore_seller,
(VALUES 
  (
    'iPhone X 64GB Space Gray',
    'The iPhone X features a stunning 5.8-inch Super Retina display, Face ID, and dual cameras. A revolutionary smartphone that changed everything.',
    399.99,
    349.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'refurbished'],
    25,
    '[{
      "title": "Display & Design",
      "icon": "📱", 
      "items": [
        {"label": "Screen Size", "value": "5.8-inch Super Retina"},
        {"label": "Resolution", "value": "2436 x 1125 pixels"},
        {"label": "Technology", "value": "OLED"},
        {"label": "Design", "value": "Glass and stainless steel"}
      ]
    }, {
      "title": "Performance",
      "icon": "⚡",
      "items": [
        {"label": "Chip", "value": "A11 Bionic"},
        {"label": "Storage", "value": "64GB"},
        {"label": "RAM", "value": "3GB"},
        {"label": "iOS", "value": "Compatible up to iOS 16"}
      ]
    }, {
      "title": "Camera",
      "icon": "📸",
      "items": [
        {"label": "Main Camera", "value": "12MP dual system"},
        {"label": "Ultra Wide", "value": "12MP"},
        {"label": "Front Camera", "value": "7MP TrueDepth"},
        {"label": "Video", "value": "4K at 60fps"}
      ]
    }]'::jsonb,
    '[{"min": 2, "max": 4, "discount": 5}, {"min": 5, "max": null, "discount": 10}]'::jsonb
  ),
  (
    'iPhone XR 128GB Product RED',
    'iPhone XR delivers breakthrough technology in a colorful all-screen design. Featuring the most advanced LCD in a smartphone.',
    449.99,
    399.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'colorful'],
    40,
    '[{
      "title": "Display & Design", 
      "icon": "📱",
      "items": [
        {"label": "Screen Size", "value": "6.1-inch Liquid Retina"},
        {"label": "Resolution", "value": "1792 x 828 pixels"},
        {"label": "Technology", "value": "LCD"},
        {"label": "Colors", "value": "6 beautiful finishes"}
      ]
    }, {
      "title": "Performance",
      "icon": "⚡", 
      "items": [
        {"label": "Chip", "value": "A12 Bionic"},
        {"label": "Storage", "value": "128GB"},
        {"label": "RAM", "value": "3GB"},
        {"label": "Battery", "value": "All-day battery life"}
      ]
    }]'::jsonb,
    '[{"min": 2, "max": 4, "discount": 5}]'::jsonb
  ),
  (
    'iPhone XS 256GB Gold',
    'iPhone XS features a 5.8-inch Super Retina display with custom-built OLED panels for an HDR display that provides the industry''s best color accuracy.',
    549.99,
    499.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'premium'],
    18,
    '[{
      "title": "Display & Design",
      "icon": "📱",
      "items": [
        {"label": "Screen Size", "value": "5.8-inch Super Retina"},
        {"label": "Resolution", "value": "2436 x 1125 pixels"},
        {"label": "HDR10", "value": "Yes"},
        {"label": "Finish", "value": "Surgical-grade stainless steel"}
      ]
    }, {
      "title": "Performance", 
      "icon": "⚡",
      "items": [
        {"label": "Chip", "value": "A12 Bionic"},
        {"label": "Storage", "value": "256GB"},
        {"label": "Neural Engine", "value": "Next-generation"}
      ]
    }]'::jsonb,
    '[]'::jsonb
  ),
  (
    'iPhone 11 128GB Purple',
    'iPhone 11 introduces a dual-camera system with Ultra Wide and Night mode. The toughest glass in a smartphone and all-day battery life.',
    549.99,
    499.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'dual-camera'],
    35,
    '[{
      "title": "Camera System",
      "icon": "📸",
      "items": [
        {"label": "Main Camera", "value": "12MP Wide"},
        {"label": "Ultra Wide", "value": "12MP, 120° field of view"},
        {"label": "Night Mode", "value": "Available on both cameras"},
        {"label": "Video", "value": "4K at 60fps"}
      ]
    }, {
      "title": "Performance",
      "icon": "⚡",
      "items": [
        {"label": "Chip", "value": "A13 Bionic"},
        {"label": "Storage", "value": "128GB"},
        {"label": "Display", "value": "6.1-inch Liquid Retina"}
      ]
    }]'::jsonb,
    '[{"min": 3, "max": null, "discount": 8}]'::jsonb
  ),
  (
    'iPhone 12 128GB Blue', 
    'iPhone 12 introduces a beautiful new design with Ceramic Shield, 5G connectivity, and the powerful A14 Bionic chip.',
    699.99,
    649.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', '5g'],
    28,
    '[{
      "title": "Revolutionary Design",
      "icon": "📱",
      "items": [
        {"label": "Display", "value": "6.1-inch Super Retina XDR"},
        {"label": "Ceramic Shield", "value": "4x better drop performance"},
        {"label": "Design", "value": "Flat-edge aerospace-grade aluminum"},
        {"label": "5G", "value": "Superfast wireless"}
      ]
    }, {
      "title": "Camera & Performance",
      "icon": "📸",
      "items": [
        {"label": "Chip", "value": "A14 Bionic"},
        {"label": "Main Camera", "value": "12MP with Night mode"},
        {"label": "Ultra Wide", "value": "12MP, 120° field of view"},
        {"label": "Storage", "value": "128GB"}
      ]
    }]'::jsonb,
    '[{"min": 2, "max": 3, "discount": 5}, {"min": 4, "max": null, "discount": 12}]'::jsonb
  ),
  (
    'iPhone 13 256GB Pink',
    'iPhone 13 features the most advanced dual-camera system, Cinematic mode for shooting videos with shallow depth of field, and A15 Bionic chip.',
    779.99,
    729.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'cinematic'],
    22,
    '[{
      "title": "Advanced Camera System",
      "icon": "🎬",
      "items": [
        {"label": "Cinematic Mode", "value": "Shallow depth of field"},
        {"label": "Main Camera", "value": "12MP, larger sensor"},
        {"label": "Ultra Wide", "value": "12MP with sensor-shift OIS"},
        {"label": "Night Mode", "value": "On all cameras"}
      ]
    }, {
      "title": "Performance & Display",
      "icon": "⚡",
      "items": [
        {"label": "Chip", "value": "A15 Bionic"},
        {"label": "Storage", "value": "256GB"},
        {"label": "Display", "value": "6.1-inch Super Retina XDR"},
        {"label": "Battery", "value": "Up to 19 hours video playback"}
      ]
    }]'::jsonb,
    '[]'::jsonb
  ),
  (
    'iPhone 14 128GB Midnight',
    'iPhone 14 features groundbreaking safety features including Crash Detection and Emergency SOS via satellite, plus an improved Main camera.',
    799.99,
    749.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'safety'],
    30,
    '[{
      "title": "Safety Features",
      "icon": "🚨",
      "items": [
        {"label": "Crash Detection", "value": "Automatically calls for help"},
        {"label": "Emergency SOS", "value": "Via satellite"},
        {"label": "Action Mode", "value": "Incredibly smooth video"},
        {"label": "Photonic Engine", "value": "Improved low-light photos"}
      ]
    }, {
      "title": "Performance",
      "icon": "⚡",
      "items": [
        {"label": "Chip", "value": "A15 Bionic"},
        {"label": "Storage", "value": "128GB"},
        {"label": "Display", "value": "6.1-inch Super Retina XDR"},
        {"label": "Camera", "value": "12MP Main with larger sensor"}
      ]
    }]'::jsonb,
    '[{"min": 2, "max": 4, "discount": 6}]'::jsonb
  ),
  (
    'iPhone 15 256GB Natural Titanium',
    'iPhone 15 Pro features titanium design, Action Button, powerful A17 Pro chip, and the most advanced iPhone camera system ever.',
    1199.99,
    1149.99,
    ARRAY['electronics', 'smartphones', 'apple', 'iphone', 'titanium', 'pro'],
    15,
    '[{
      "title": "Titanium Design",
      "icon": "💎",
      "items": [
        {"label": "Material", "value": "Aerospace-grade titanium"},
        {"label": "Action Button", "value": "Customizable control"},
        {"label": "Display", "value": "6.1-inch Super Retina XDR"},
        {"label": "USB-C", "value": "Universal connectivity"}
      ]
    }, {
      "title": "Pro Performance",
      "icon": "🚀",
      "items": [
        {"label": "Chip", "value": "A17 Pro with 3nm technology"},
        {"label": "Storage", "value": "256GB"},
        {"label": "Pro Camera", "value": "48MP Main with 5x Telephoto"},
        {"label": "Video", "value": "4K ProRes recording"}
      ]
    }]'::jsonb,
    '[{"min": 2, "max": null, "discount": 3}]'::jsonb
  )
) AS phone_data(name, description, price, discount_price, tags, inventory, specifications, bundle_deals);

-- Add some product images for the iPhones
WITH istore_products AS (
  SELECT id, name FROM products 
  WHERE seller_id IN (SELECT id FROM sellers WHERE name = 'iStore')
)
INSERT INTO public.product_images (product_id, src, alt)
SELECT 
  p.id,
  CASE 
    WHEN p.name LIKE '%iPhone X %' THEN 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone XR%' THEN 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone XS%' THEN 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone 11%' THEN 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone 12%' THEN 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone 13%' THEN 'https://images.unsplash.com/photo-1632633173522-fc14753c13fd?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone 14%' THEN 'https://images.unsplash.com/photo-1663499482523-1c0d8bc4d178?w=800&h=800&fit=crop'
    WHEN p.name LIKE '%iPhone 15%' THEN 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop'
    ELSE 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop'
  END,
  p.name || ' product image'
FROM istore_products p;