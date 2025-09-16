export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  specifications?: SpecificationSection[];
  rating?: number;
  reviews_count?: number;
  stock?: number;
  inventory?: number;
  variants?: ProductVariant[];
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpecificationSection {
  title: string;
  icon: string;
  items: Array<{ label: string; value: string }>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  attributes?: Record<string, any>;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface ProductSpecification {
  key: string;
  value: string;
  category?: string;
}