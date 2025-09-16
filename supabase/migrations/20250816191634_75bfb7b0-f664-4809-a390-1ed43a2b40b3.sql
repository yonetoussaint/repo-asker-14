-- Add specifications column to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'specifications'
    ) THEN
        ALTER TABLE products ADD COLUMN specifications JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;