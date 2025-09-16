-- Add storage_variants column to products table
ALTER TABLE products ADD COLUMN storage_variants jsonb DEFAULT '[]'::jsonb;