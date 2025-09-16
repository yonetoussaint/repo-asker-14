-- Add bundle_deals_enabled column to products table
ALTER TABLE public.products ADD COLUMN bundle_deals_enabled BOOLEAN DEFAULT false;