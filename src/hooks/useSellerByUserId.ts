import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['seller-by-user-id', userId],
    queryFn: async () => {
      if (!userId) return null;

      // First try to get seller info from profiles table that links to sellers
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          seller_id,
          sellers (
            id,
            name,
            image_url,
            verified,
            followers_count,
            rating,
            total_sales
          )
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log('Profile not found, trying direct seller lookup:', profileError.message);
        
        // If profile doesn't exist, try to find seller directly by user_id or email
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('id', userId)
          .single();

        if (sellerError) {
          console.log('Seller not found:', sellerError.message);
          return null;
        }

        return sellerData;
      }

      return profileData?.sellers;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};