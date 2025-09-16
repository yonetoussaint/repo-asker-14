
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, Product as SupaProduct } from '@/integrations/supabase/products';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  image: string;
  rating: number;
  reviewCount: number;
}

const mapToHookProduct = (p: SupaProduct): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  category: p.category ?? '',
  imageUrl: p.imageUrl || p.product_images?.[0]?.src || '',
  image: p.product_images?.[0]?.src || p.imageUrl || '',
  rating: p.rating ?? 0,
  reviewCount: p.reviewCount ?? 0,
});

export const useProducts = () => {
  const { data, isLoading, error } = useQuery<SupaProduct[], Error, Product[]>({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
    select: (products) => products.map(mapToHookProduct),
  });

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};
