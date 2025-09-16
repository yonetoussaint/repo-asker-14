-- Add sold_count field to products table
ALTER TABLE public.products 
ADD COLUMN sold_count integer NOT NULL DEFAULT 0;

-- Create function to calculate sold count from orders
CREATE OR REPLACE FUNCTION public.calculate_product_sold_count(product_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    total_sold integer := 0;
BEGIN
    SELECT COALESCE(SUM(quantity), 0) INTO total_sold
    FROM orders 
    WHERE orders.product_id = calculate_product_sold_count.product_id 
    AND orders.status IN ('completed', 'delivered');
    
    RETURN total_sold;
END;
$function$;

-- Update existing products with calculated sold counts
UPDATE products 
SET sold_count = calculate_product_sold_count(id);

-- Create trigger function to update sold_count when orders change
CREATE OR REPLACE FUNCTION public.update_product_sold_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        IF NEW.status IN ('completed', 'delivered') THEN
            UPDATE products 
            SET sold_count = sold_count + NEW.quantity
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        -- If status changed to completed/delivered
        IF OLD.status NOT IN ('completed', 'delivered') AND NEW.status IN ('completed', 'delivered') THEN
            UPDATE products 
            SET sold_count = sold_count + NEW.quantity
            WHERE id = NEW.product_id;
        -- If status changed from completed/delivered
        ELSIF OLD.status IN ('completed', 'delivered') AND NEW.status NOT IN ('completed', 'delivered') THEN
            UPDATE products 
            SET sold_count = sold_count - OLD.quantity
            WHERE id = NEW.product_id;
        -- If quantity changed for completed orders
        ELSIF NEW.status IN ('completed', 'delivered') AND OLD.quantity != NEW.quantity THEN
            UPDATE products 
            SET sold_count = sold_count + (NEW.quantity - OLD.quantity)
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        IF OLD.status IN ('completed', 'delivered') THEN
            UPDATE products 
            SET sold_count = sold_count - OLD.quantity
            WHERE id = OLD.product_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$function$;

-- Create trigger to automatically update sold_count
CREATE TRIGGER update_product_sold_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_product_sold_count();