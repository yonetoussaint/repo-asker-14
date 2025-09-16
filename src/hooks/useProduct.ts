import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchProductById } from "@/integrations/supabase/products";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface ProductAnalytics {
  viewCount: number;
  recentViewers: number;
  salesLastHour: number;
  trending: boolean;
}

export function useProduct(productId: string) {
  const queryClient = useQueryClient();

  // Subscribe to real-time updates for this product
  useEffect(() => {
    if (!productId) return;

    console.log(`Setting up real-time subscription for product: ${productId}`);

    // Create a channel for subscription to specific product changes
    const channel = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        (payload) => {
          console.log('Product update detected:', payload);
          // Invalidate the query to refetch the latest data
          queryClient.invalidateQueries({ queryKey: ['product', productId] });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for product ${productId}:`, status);
      });

    return () => {
      console.log(`Cleaning up subscription for product: ${productId}`);
      supabase.removeChannel(channel);
    };
  }, [productId, queryClient]);

  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      console.log(`🔍 useProduct: Fetching product data for ID: ${productId}`);
      try {
        const data = await fetchProductById(productId);
        console.log('✅ useProduct: Fetched product data:', data);
        return data;
      } catch (error) {
        console.error('❌ useProduct: Error fetching product:', error);
        throw error;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent excessive refetching
    refetchOnMount: false, // Don't refetch on every mount
    refetchOnWindowFocus: false,
    refetchInterval: false, // Disable automatic refetching
    retry: (failureCount, error) => {
      console.log(`🔄 useProduct: Retry attempt ${failureCount} for productId ${productId}:`, error);
      return failureCount < 3;
    }
  });
}

export function useProductAnalytics(productId: string) {
  return useQuery({
    queryKey: ['product-analytics', productId],
    queryFn: async (): Promise<ProductAnalytics> => {
      try {
        const product = await fetchProductById(productId);

        // Use real data from the database with some calculations
        const viewCount = product.views || 0;
        const recentViewers = Math.floor(viewCount * 0.02) + Math.floor(Math.random() * 10); // Simulate recent viewers
        const salesLastHour = Math.floor(Math.random() * 20); // Simulate sales data
        const trending = viewCount > 50 || product.flash_deal; // Trending if high views or flash deal

        return {
          viewCount,
          recentViewers,
          salesLastHour,
          trending
        };
      } catch (error) {
        // Fallback to mock data if fetching fails
        return {
          viewCount: 1435,
          recentViewers: 28,
          salesLastHour: 12,
          trending: true
        };
      }
    },
    enabled: !!productId,
  });
}