import { useQuery } from '@tanstack/react-query';
import { fetchSellerById } from '@/integrations/supabase/sellers';
import { supabase } from '@/integrations/supabase/client';

export const useSeller = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => fetchSellerById(sellerId),
    enabled: !!sellerId,
  });
};



export const useSellerReviews = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-reviews', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching seller reviews:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!sellerId,
  });
};


export const useSellerProducts = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-products', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            src,
            alt
          )
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!sellerId,
  });
};

export const useSellerReels = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-reels', sellerId],
    queryFn: async () => {
      // First get the profile ID for this seller
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('seller_id', sellerId);

      if (profileError) {
        console.error('Error fetching seller profile:', profileError);
        throw profileError;
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

      const profileIds = profiles.map(p => p.id);

      // Then get videos for those profile IDs
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .in('user_id', profileIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller reels:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!sellerId,
  });
};

export const useSellerCollections = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-collections', sellerId],
    queryFn: async () => {
      // Mock collections data for now since the table doesn't exist yet
      const mockCollections = [
        {
          id: '1',
          name: 'Summer Collection',
          description: 'Bright and colorful items perfect for summer',
          image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          seller_id: sellerId,
          product_count: 15,
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Premium Electronics',
          description: 'High-end electronics and gadgets',
          image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
          seller_id: sellerId,
          product_count: 8,
          created_at: '2024-01-10T00:00:00Z'
        },
        {
          id: '3',
          name: 'Home Essentials',
          description: 'Everything you need for a comfortable home',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          seller_id: sellerId,
          product_count: 23,
          created_at: '2024-01-05T00:00:00Z'
        }
      ];

      return mockCollections;
    },
    enabled: !!sellerId,
  });
};