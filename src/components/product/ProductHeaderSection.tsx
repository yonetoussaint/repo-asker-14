import React from "react";
import ProductHeader from "@/components/product/ProductHeader";

interface ProductHeaderSectionProps {
  ref: React.RefObject<HTMLDivElement>;
  activeSection: string;
  onTabChange: (section: string) => void;
  focusMode: boolean;
  showHeaderInFocus: boolean;
  onProductDetailsClick: () => void;
  currentImageIndex: number;
  totalImages: number;
  onShareClick: () => void;
}

const ProductHeaderSection: React.FC<ProductHeaderSectionProps> = ({
  ref,
  activeSection,
  onTabChange,
  focusMode,
  showHeaderInFocus,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick
}) => {
  return (
    <div ref={ref} className="relative z-50">
      <ProductHeader 
        inPanel={false} // Should be false for fixed positioning and scroll behavior
        activeSection={activeSection}
        onTabChange={onTabChange}
        focusMode={focusMode}
        showHeaderInFocus={showHeaderInFocus}
        onProductDetailsClick={onProductDetailsClick}
        currentImageIndex={currentImageIndex}
        totalImages={totalImages}
        onShareClick={onShareClick}
      />
    </div>
  );
};

export default ProductHeaderSection;