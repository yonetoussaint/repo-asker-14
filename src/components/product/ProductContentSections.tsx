import React from "react";

interface ProductContentSectionsProps {
  productId: string;
  product: any;
  descriptionRef?: React.RefObject<HTMLDivElement>;
  productDetailsSheetOpen: boolean;
  setProductDetailsSheetOpen: (open: boolean) => void;
  sections?: any[];
  activeSection?: string;
}

const ProductContentSections: React.FC<ProductContentSectionsProps> = ({
  productId,
  product,
  descriptionRef,
  productDetailsSheetOpen,
  setProductDetailsSheetOpen,
  sections = [],
  activeSection = 'overview'
}) => {
  return (
    <div className="flex-1 overscroll-none pb-[112px]">
      <div className="bg-white pb-20">
        {/* Content removed */}
      </div>
    </div>
  );
};

export default ProductContentSections;