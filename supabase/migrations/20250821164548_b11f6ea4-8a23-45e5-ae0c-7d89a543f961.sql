-- Add 3D model support to products table
ALTER TABLE public.products 
ADD COLUMN model_3d_url TEXT;

-- Update the iPhone XR 64GB product with the 3D model embed
UPDATE public.products 
SET model_3d_url = 'https://sketchfab.com/models/60e3002e27ad4a61abe237683803b646/embed'
WHERE name = 'iPhone XR 64GB';