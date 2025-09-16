// --- Product type definition ---
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  category?: string;
  imageUrl?: string;
  product_images?: {
    id: string;
    src: string;
    alt?: string;
  }[];
  product_videos?: {
    id: string;
    video_url: string;
    title?: string;
    description?: string;
    created_at?: string;
  }[];
  model_3d_url?: string;
  rating?: number;
  reviewCount?: number;
  inventory?: number;
  location?: string;
  status?: string;
  created_at?: string;
  tags?: string[];
  flash_deal?: boolean;
  flash_start_time?: string;
  views?: number;
  saves?: number;
  seller_trust_score?: number;
  last_activity?: string;
  seller_id?: string;
  sold_count?: number;
  product_type?: string;
  bundle_deals?: {
    min: number;
    max: number | null;
    discount: number;
    isMinimum?: boolean;
  }[];
  bundle_deals_enabled?: boolean;
  sellers?: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    verified: boolean;
    rating?: number;
    total_sales: number;
    followers_count: number;
    trust_score: number;
  };
  specifications?: {
    title: string;
    icon: string;
    items: { label: string; value: string; }[];
  }[];
  variants?: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image?: string;
    bestseller?: boolean;
    limited?: boolean;
    active?: boolean;
    product_images?: {
      id: string;
      src: string;
      alt?: string;
    }[];
    product_videos?: {
      id: string;
      video_url: string;
      title?: string;
      description?: string;
    }[];
  }[];
  storage_variants?: {
    id: string;
    name: string;
    capacity: string;
    price: number;
    stock: number;
    image?: string;
    bestseller?: boolean;
    limited?: boolean;
  }[];
  variant_names?: any[];
}

// --- Fetch all products from Supabase ---
export async function fetchAllProducts(): Promise<Product[]> {
  const { supabase } = await import('./client');

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        src,
        alt
      ),
      product_videos (
        id,
        video_url,
        title,
        description,
        created_at
      ),
      sellers (
        id,
        name,
        description,
        image_url,
        verified,
        rating,
        total_sales,
        followers_count,
        trust_score
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(product => ({
    ...product,
    bundle_deals: Array.isArray(product.bundle_deals) ? product.bundle_deals as any[] : [],
    specifications: Array.isArray(product.specifications) ? product.specifications as any[] : [],
    variants: Array.isArray((product as any).color_variants) ? (product as any).color_variants as any[] : [],
    storage_variants: Array.isArray((product as any).storage_variants) ? (product as any).storage_variants as any[] : []
  })) as Product[];
}

// --- Fetch products for a specific user ---
export async function fetchUserProducts(userId: string): Promise<Product[]> {
  // For now, return all products since we don't have user-specific products
  return fetchAllProducts();
}

// --- Create a product (mock version) ---
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  // In a real app, send productData to supabase, but here we return a new product
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: productData.name || "New Product",
    description: productData.description || "",
    price: productData.price ?? 0,
    discount_price: productData.discount_price ?? null,
    category: productData.category || "",
    imageUrl: "",
    product_images: [],
    rating: 0,
    reviewCount: 0,
    inventory: 0,
    created_at: new Date().toISOString(),
  };
}

// --- Update a product in Supabase ---
export async function updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
  const { supabase } = await import('./client');

  console.log('📦 updateProduct called with:', { productId, productData });

  // Handle tags array properly for PostgreSQL
  const updatePayload = { ...productData };
  if (productData.tags !== undefined) {
    // Ensure tags is properly formatted as an array for PostgreSQL
    updatePayload.tags = Array.isArray(productData.tags) ? productData.tags : [];
  }

  // Map variants to color_variants for database storage
  if (productData.variants !== undefined) {
    (updatePayload as any).color_variants = productData.variants;
    delete (updatePayload as any).variants;
  }

  // Map storage_variants for database storage
  if (productData.storage_variants !== undefined) {
    (updatePayload as any).storage_variants = productData.storage_variants;
  }

  const { data, error } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', productId)
    .select('*')
    .single();

  console.log('📦 Supabase response:', { data, error });

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return {
    ...data,
    bundle_deals: Array.isArray(data.bundle_deals) ? data.bundle_deals as any[] : [],
    specifications: Array.isArray(data.specifications) ? data.specifications as any[] : [],
    variants: Array.isArray((data as any).color_variants) ? (data as any).color_variants as any[] : [],
    storage_variants: Array.isArray((data as any).storage_variants) ? (data as any).storage_variants as any[] : []
  } as Product;
}

// --- Fetch single product by ID ---
export async function fetchProductById(productId: string): Promise<Product> {
  const { supabase } = await import('./client');

  console.log(`🔍 fetchProductById: Starting fetch for productId: ${productId}`);
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        src,
        alt
      ),
      product_videos (
        id,
        video_url,
        title,
        description,
        created_at
      ),
      sellers (
        id,
        name,
        description,
        image_url,
        verified,
        rating,
        total_sales,
        followers_count,
        trust_score
      )
    `)
    .eq('id', productId)
    .maybeSingle();

  console.log(`🔍 fetchProductById: Query result for productId ${productId}:`, { data, error });
  console.log(`🔍 fetchProductById: model_3d_url value:`, data?.model_3d_url);

  if (error) {
    console.error('❌ fetchProductById: Error fetching product:', error);
    throw error;
  }

  if (!data) {
    console.error(`❌ fetchProductById: No product found with ID: ${productId}`);
    throw new Error('Product not found');
  }

  return {
    ...data,
    bundle_deals: Array.isArray(data.bundle_deals) ? data.bundle_deals as any[] : [],
    specifications: Array.isArray(data.specifications) ? data.specifications as any[] : [],
    variants: Array.isArray((data as any).color_variants) ? (data as any).color_variants as any[] : [],
    storage_variants: Array.isArray((data as any).storage_variants) ? (data as any).storage_variants as any[] : []
  } as Product;
}

// --- Track product view ---
export async function trackProductView(productId: string): Promise<void> {
  console.log(`🔍 trackProductView: Starting view tracking for product ${productId}`);
  
  try {
    const { supabase } = await import('./client');

    const { error } = await supabase.rpc('increment_product_views', {
      product_id: productId
    });

    if (error) {
      console.error('❌ trackProductView: Error tracking product view:', error);
      throw error;
    } else {
      console.log('✅ trackProductView: Successfully tracked view for product:', productId);
    }
  } catch (err) {
    console.error('❌ trackProductView: Unexpected error:', err);
    throw err;
  }
}

// --- Track product save ---
export async function trackProductSave(productId: string): Promise<void> {
  const { supabase } = await import('./client');

  const { error } = await supabase.rpc('increment_product_saves', {
    product_id: productId
  });

  if (error) {
    console.error('Error tracking product save:', error);
  }
}

// --- Fetch current flash deals ---
export async function fetchFlashDeals(category?: string, productType?: string): Promise<Product[]> {
  const { supabase } = await import('./client');

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        src,
        alt
      ),
      product_videos (
        id,
        video_url,
        title,
        description,
        created_at
      )
    `);

  // Filter by product type if provided (e.g., 'books' for ebooks)
  if (productType) {
    query = query.eq('product_type', productType);
  }

  // Filter by category if provided
  if (category) {
    query = query.contains('tags', [category]);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching flash deals:', error);
    throw error;
  }

  return (data || []).map(product => ({
    ...product,
    bundle_deals: Array.isArray(product.bundle_deals) ? product.bundle_deals as any[] : [],
    specifications: Array.isArray(product.specifications) ? product.specifications as any[] : [],
    variants: Array.isArray((product as any).color_variants) ? (product as any).color_variants as any[] : [],
    storage_variants: Array.isArray((product as any).storage_variants) ? (product as any).storage_variants as any[] : []
  })) as Product[];
}

// Explicitly export all functions at the end for clarity
export default {
  fetchAllProducts,
  fetchUserProducts,
  createProduct,
  updateProduct,
  fetchProductById,
  trackProductView,
  trackProductSave,
  fetchFlashDeals
};