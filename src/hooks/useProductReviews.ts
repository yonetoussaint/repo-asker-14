import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      console.log('Fetching reviews for product:', productId);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
      }
      console.log('Fetched reviews:', data);
      return data || [];
    },
    enabled: !!productId,
  });
};

export const useProductReviewsStats = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews-stats', productId],
    queryFn: async () => {
      console.log('Fetching review stats for product:', productId);
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product review stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No reviews found for product:', productId);
        return { count: 0, averageRating: 0 };
      }

      const count = data.length;
      const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / count;
      
      console.log('Review stats:', { count, averageRating });
      return { count, averageRating: Math.round(averageRating * 10) / 10 };
    },
    enabled: !!productId,
  });
};

export interface CreateReviewData {
  product_id: string;
  user_name: string;
  title?: string;
  comment: string;
  rating: number;
  verified_purchase?: boolean;
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      console.log('Creating review:', reviewData);
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }
      
      console.log('Review created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch review queries for the product
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews-stats', data.product_id] });
    },
  });
};