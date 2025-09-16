-- Update the check constraint to allow 'digital' product type
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;

-- Add the updated constraint with 'digital' included
ALTER TABLE products ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('single', 'variable', 'books', 'digital'));