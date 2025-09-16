-- Add bundle deals column to products table
ALTER TABLE products ADD COLUMN bundle_deals JSONB DEFAULT '[]'::jsonb;

-- Update some existing products with sample bundle deals data
UPDATE products SET bundle_deals = '[
  {"min": 1, "max": 9, "discount": 0, "isMinimum": true},
  {"min": 10, "max": 49, "discount": 5},
  {"min": 50, "max": 99, "discount": 10},
  {"min": 100, "max": 499, "discount": 15},
  {"min": 500, "max": 999, "discount": 20},
  {"min": 1000, "max": null, "discount": 25}
]'::jsonb WHERE id IN (
  SELECT id FROM products LIMIT 10
);