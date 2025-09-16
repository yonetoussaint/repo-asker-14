// --- Seller type definition ---
export interface Seller {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  verified: boolean;
  rating?: number;
  total_sales: number;
  followers_count: number;
  category?: string;
  email?: string;
  phone?: string;
  address?: string;
  trust_score: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// --- Fetch all active sellers from Supabase ---
export async function fetchAllSellers(): Promise<Seller[]> {
  const { supabase } = await import('./client');
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('status', 'active')
    .order('total_sales', { ascending: false });

  if (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }

  return data || [];
}

// --- Fetch sellers by category ---
export async function fetchSellersByCategory(category: string): Promise<Seller[]> {
  const { supabase } = await import('./client');
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('status', 'active')
    .eq('category', category)
    .order('total_sales', { ascending: false });

  if (error) {
    console.error('Error fetching sellers by category:', error);
    throw error;
  }

  return data || [];
}

// --- Fetch single seller by ID ---
export async function fetchSellerById(sellerId: string): Promise<Seller> {
  const { supabase } = await import('./client');
  
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', sellerId)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error fetching seller:', error);
    throw error;
  }

  return data;
}

// --- Create a seller ---
export async function createSeller(sellerData: Omit<Seller, 'id' | 'created_at' | 'updated_at'>): Promise<Seller> {
  const { supabase } = await import('./client');

  const { data, error } = await supabase
    .from('sellers')
    .insert(sellerData as any)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating seller:', error);
    throw error;
  }

  return data;
}

// --- Update a seller ---
export async function updateSeller(sellerId: string, sellerData: Partial<Seller>): Promise<Seller> {
  const { supabase } = await import('./client');

  const { data, error } = await supabase
    .from('sellers')
    .update(sellerData)
    .eq('id', sellerId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating seller:', error);
    throw error;
  }

  return data;
}