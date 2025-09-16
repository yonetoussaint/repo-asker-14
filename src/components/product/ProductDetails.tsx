import React from "react";
import { BadgeInfo, ChevronRight } from "lucide-react";
import ReviewGallery from "./ReviewGallery";
import ProductRecommendations from "./ProductRecommendations";

interface ProductDetailsProps {
  onProductDetailsClick?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  onProductDetailsClick
}) => {
  return (
    <div className="space-y-6">
      <div className="absolute bottom-3 right-3 z-30">
        <button 
          onClick={onProductDetailsClick}
          className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/70 transition-colors"
        >
          <BadgeInfo size={12} className="text-white/80" />
          <span className="text-xs font-medium text-white/80">Product Details</span>
          <ChevronRight size={10} className="text-white/80" />
        </button>
      </div>
      
      <ProductRecommendations />
      <ReviewGallery />
    </div>
  );
};

export default ProductDetails;