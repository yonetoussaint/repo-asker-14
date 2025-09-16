-- Add color variants field to products table
ALTER TABLE products ADD COLUMN color_variants JSONB DEFAULT '[]'::jsonb;