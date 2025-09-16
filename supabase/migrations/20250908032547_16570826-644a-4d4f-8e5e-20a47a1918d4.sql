-- Insert product variant templates into the database
INSERT INTO product_variant_templates (template_id, name, icon, variant_fields, default_variant_names, sku_generator_config) VALUES
(
  'smartphone',
  'Smartphones',
  'Smartphone',
  '[
    {"key": "storage", "label": "Storage", "options": ["64GB", "128GB", "256GB", "512GB"]},
    {"key": "networkStatus", "label": "Network", "options": ["Verizon", "AT&T", "T-Mobile", "Unlocked"]},
    {"key": "productGrade", "label": "Condition", "options": ["Brand New", "Refurbished", "Used - Like New", "Used - Good"]}
  ]'::jsonb,
  '[
    {"id": 1, "name": "Space Black", "stock": 0, "price": 0},
    {"id": 2, "name": "Deep Purple", "stock": 0, "price": 0},
    {"id": 3, "name": "Gold", "stock": 0, "price": 0}
  ]'::jsonb,
  '{
    "product": {
      "name": "iPhone 15 Pro",
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center"
    }
  }'::jsonb
),
(
  'clothes',
  'Clothing',
  'Shirt',
  '[
    {"key": "size", "label": "Size", "options": ["XS", "S", "M", "L", "XL", "XXL"]},
    {"key": "material", "label": "Material", "options": ["100% Cotton", "Cotton Blend", "Polyester", "Organic Cotton"]},
    {"key": "fit", "label": "Fit", "options": ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized"]}
  ]'::jsonb,
  '[
    {"id": 1, "name": "Navy Blue", "stock": 0, "price": 0},
    {"id": 2, "name": "White", "stock": 0, "price": 0},
    {"id": 3, "name": "Black", "stock": 0, "price": 0},
    {"id": 4, "name": "Heather Gray", "stock": 0, "price": 0}
  ]'::jsonb,
  '{
    "product": {
      "name": "Classic Cotton T-Shirt",
      "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center"
    }
  }'::jsonb
),
(
  'wigs',
  'Wigs',
  'custom-wig',
  '[
    {"key": "length", "label": "Length", "options": ["8\"", "10\"", "12\"", "14\"", "16\"", "18\"", "20\"", "22\"", "24\""]},
    {"key": "texture", "label": "Texture", "options": ["Straight", "Body Wave", "Deep Wave", "Curly", "Kinky Straight", "Water Wave"]},
    {"key": "hairType", "label": "Hair Type", "options": ["Human Hair", "Synthetic", "Heat Resistant Synthetic", "Remy Human Hair"]},
    {"key": "laceType", "label": "Lace Type", "options": ["Lace Front", "Full Lace", "360 Lace", "Lace Closure", "Standard Cap"]}
  ]'::jsonb,
  '[
    {"id": 1, "name": "Natural Black", "stock": 0, "price": 0},
    {"id": 2, "name": "Dark Brown", "stock": 0, "price": 0},
    {"id": 3, "name": "Medium Brown", "stock": 0, "price": 0},
    {"id": 4, "name": "Honey Blonde", "stock": 0, "price": 0},
    {"id": 5, "name": "Platinum Blonde", "stock": 0, "price": 0},
    {"id": 6, "name": "Auburn Red", "stock": 0, "price": 0}
  ]'::jsonb,
  '{
    "product": {
      "name": "Premium Lace Front Wig",
      "image": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&crop=center"
    }
  }'::jsonb
),
(
  'ebooks',
  'E-books',
  'custom-ebook',
  '[
    {"key": "format", "label": "Format", "options": ["PDF", "ePub", "Mobi", "AZW3", "Multi-Format Bundle"]},
    {"key": "edition", "label": "Edition", "options": ["Standard Edition", "Deluxe Edition", "Collector\''s Edition", "Revised Edition", "First Edition"]},
    {"key": "language", "label": "Language", "options": ["English", "Spanish", "French", "German", "Portuguese", "Italian"]},
    {"key": "licenseType", "label": "License Type", "options": ["Personal Use", "Commercial Use", "Educational License", "Multi-User License"]}
  ]'::jsonb,
  '[
    {"id": 1, "name": "Single Book", "stock": 0, "price": 0},
    {"id": 2, "name": "Book + Audiobook Bundle", "stock": 0, "price": 0},
    {"id": 3, "name": "Complete Series (3 Books)", "stock": 0, "price": 0},
    {"id": 4, "name": "Premium Package", "stock": 0, "price": 0},
    {"id": 5, "name": "Study Guide Bundle", "stock": 0, "price": 0}
  ]'::jsonb,
  '{
    "product": {
      "name": "Complete JavaScript Masterclass",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center"
    }
  }'::jsonb
)