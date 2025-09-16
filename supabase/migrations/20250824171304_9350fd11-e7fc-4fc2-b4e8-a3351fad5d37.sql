-- Drop the current policy that allows anyone to create reviews
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

-- Create new policy that only allows authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);