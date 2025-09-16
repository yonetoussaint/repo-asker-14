-- Enable RLS on the reviews table to ensure proper data access
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow everyone to read reviews (since they're public)
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);