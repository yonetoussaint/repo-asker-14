import React from "react";
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import SocialSharePanel from "@/components/product/SocialSharePanel";

interface ProductStickyComponentsProps {
  product: any;
  onBuyNow: () => void;
  sharePanelOpen: boolean;
  setSharePanelOpen: (open: boolean) => void;
  hideCheckoutBar?: boolean; // Added this prop based on the changes
}

const ProductStickyComponents: React.FC<ProductStickyComponentsProps> = ({
  product,
  onBuyNow,
  sharePanelOpen,
  setSharePanelOpen,
  hideCheckoutBar = false // Default value for the new prop
}) => {
  return (
    <>
      {!hideCheckoutBar && (
        <StickyCheckoutBar 
          product={product}
          onBuyNow={onBuyNow}
          selectedColor=""
          selectedStorage=""
          selectedNetwork=""
          selectedCondition=""
          className=""
        />
      )}

      <SocialSharePanel 
        open={sharePanelOpen}
        onOpenChange={setSharePanelOpen}
        product={product}
      />
    </>
  );
};

export default ProductStickyComponents;