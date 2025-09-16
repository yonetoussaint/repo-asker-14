import React from 'react';
import SellerInfoOverlay from '@/components/product/SellerInfoOverlay';
import ProductDetails from '@/components/product/ProductDetails';

interface StickyReelsBottomBarProps {
  currentVideo?: {
    id: string;
    user_id?: string;
    title: string;
  };
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  product?: {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
  };
  onSellerClick?: () => void;
  onProductDetailsClick?: () => void;
  isPlaying?: boolean;
}

export const StickyReelsBottomBar: React.FC<StickyReelsBottomBarProps> = ({
  seller,
  onSellerClick,
  onProductDetailsClick,
  isPlaying = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="relative w-full h-16">
        {/* Seller Info - Bottom Left */}
        <div className="absolute bottom-3 left-3 pointer-events-auto">
          <SellerInfoOverlay 
            seller={seller}
            onSellerClick={onSellerClick}
            focusMode={false}
            isPlaying={isPlaying}
          />
        </div>

        {/* Product Details - Bottom Right */}
        <div className="absolute bottom-3 right-3 pointer-events-auto">
          <ProductDetails onProductDetailsClick={onProductDetailsClick} />
        </div>
      </div>
    </div>
  );
};