-- First, drop all existing variant data and restructure to match NewVariantsList.tsx
-- Clear existing variant data
UPDATE products SET color_variants = '[]'::jsonb, storage_variants = '[]'::jsonb;

-- Add sample smartphone products with proper variant structure for testing
-- The variants will now have the structure expected by NewVariantsList.tsx
INSERT INTO products (id, name, description, price, color_variants, specifications, category, tags) VALUES
(
  gen_random_uuid(),
  'iPhone 15 Pro',
  'Latest iPhone with advanced features and premium design',
  999.00,
  '[
    {
      "id": "1",
      "name": "Space Black",
      "stock": 15,
      "price": 999,
      "active": true,
      "storage": "128GB",
      "networkStatus": "Unlocked",
      "productGrade": "Brand New",
      "sku": "IPH15-SPAC-128GB-UNL-NEW"
    },
    {
      "id": "2", 
      "name": "Deep Purple",
      "stock": 12,
      "price": 999,
      "active": true,
      "storage": "128GB",
      "networkStatus": "Unlocked", 
      "productGrade": "Brand New",
      "sku": "IPH15-DEEP-128GB-UNL-NEW"
    },
    {
      "id": "3",
      "name": "Gold",
      "stock": 8,
      "price": 1099,
      "active": true,
      "storage": "256GB",
      "networkStatus": "Verizon",
      "productGrade": "Brand New", 
      "sku": "IPH15-GOLD-256GB-VZ-NEW"
    },
    {
      "id": "4",
      "name": "Silver",
      "stock": 5,
      "price": 1199,
      "active": true,
      "storage": "512GB",
      "networkStatus": "AT&T",
      "productGrade": "Brand New",
      "sku": "IPH15-SILV-512GB-ATT-NEW"
    },
    {
      "id": "5",
      "name": "Space Black",
      "stock": 3,
      "price": 899,
      "active": true,
      "storage": "128GB",
      "networkStatus": "T-Mobile",
      "productGrade": "Refurbished",
      "sku": "IPH15-SPAC-128GB-TMO-REF"
    }
  ]'::jsonb,
  '[
    {
      "title": "Display",
      "icon": "monitor",
      "items": [
        {"label": "Screen Size", "value": "6.1 inches"},
        {"label": "Resolution", "value": "2556 x 1179 pixels"},
        {"label": "Technology", "value": "Super Retina XDR OLED"}
      ]
    },
    {
      "title": "Performance", 
      "icon": "cpu",
      "items": [
        {"label": "Processor", "value": "A17 Pro chip"},
        {"label": "RAM", "value": "8GB"},
        {"label": "Operating System", "value": "iOS 17"}
      ]
    },
    {
      "title": "Camera",
      "icon": "camera", 
      "items": [
        {"label": "Main Camera", "value": "48MP + 12MP + 12MP"},
        {"label": "Front Camera", "value": "12MP TrueDepth"},
        {"label": "Video Recording", "value": "4K at 60fps"}
      ]
    }
  ]'::jsonb,
  'Electronics',
  ARRAY['smartphones', 'electronics', 'apple', 'mobile']
)
ON CONFLICT (id) DO NOTHING;