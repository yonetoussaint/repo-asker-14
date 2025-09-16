-- Enable the increment function to bypass RLS for view tracking
ALTER FUNCTION increment_product_views(uuid) SECURITY DEFINER;

-- Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;