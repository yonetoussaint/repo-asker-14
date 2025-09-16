export interface ProductImageGalleryRef {
  getTabsContainer: () => HTMLDivElement | null;
  setActiveTab: (tab: string) => void;
  getActiveTab: () => string;
}

export interface ProductImageGalleryProps {
  images: string[];
  videos?: {
    id: string;
    video_url: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }[];
  model3dUrl?: string;
  focusMode?: boolean;
  onFocusModeChange?: (focusMode: boolean) => void;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
  product?: {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
  };
  bundlePrice?: number;
  onVariantChange?: (variantIndex: number, variant: any) => void;
  onProductDetailsClick?: () => void;
  onImageIndexChange?: (currentIndex: number, totalItems: number) => void;
  onVariantImageChange?: (imageUrl: string, variantName: string) => void;
  configurationData?: {
    selectedColor?: string;
    selectedStorage?: string;
    selectedNetwork?: string;
    selectedCondition?: string;
    colorVariants: any[];
    storageVariants: any[];
    networkVariants: any[];
    conditionVariants: any[];
    getSelectedColorVariant: () => any;
    getSelectedStorageVariant: () => any;
    getSelectedNetworkVariant: () => any;
    getSelectedConditionVariant: () => any;
    getStorageDisplayValue: (storage: string) => string;
    getVariantFormattedPrice: (id: number) => string;
    formatPrice: (price: number) => string;
  } | null;
  activeTab?: string;
  onBuyNow?: () => void;
}

export interface GalleryItem {
  type: 'image' | 'video' | 'model3d';
  src: string;
  videoData?: any;
  index: number;
}

export interface TouchPosition {
  x: number;
  y: number;
}