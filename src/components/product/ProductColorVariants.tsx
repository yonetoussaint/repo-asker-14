import React from 'react';

interface ColorVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  bestseller?: boolean;
  limited?: boolean;
  active?: boolean;
}

interface ProductColorVariantsProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  variants: ColorVariant[];
  bundlePrice: number;
  hideHeader?: boolean;
  onImageSelect?: (imageUrl: string, variantName: string) => void;
}

const ProductColorVariants: React.FC<ProductColorVariantsProps> = ({ 
  selectedColor, 
  onColorChange, 
  variants, 
  bundlePrice, 
  hideHeader,
  onImageSelect
}) => {
  // Debug logging to see what variant names we're getting
  console.log('ProductColorVariants - variants:', variants);
  console.log('ProductColorVariants - selectedColor:', selectedColor);
  
  return (
    <div className="">
    <div className="flex py-3 gap-4 overflow-x-auto overflow-y-visible px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {variants.map((variant) => {
        const isSelected = selectedColor === variant.name;
        return (
          <div key={variant.name} className="flex-shrink-0 w-20 cursor-pointer" 
               onClick={() => {
                 onColorChange(variant.name);
                 // When image exists and onImageSelect callback is provided, trigger image update
                 if (variant.image && onImageSelect) {
                   onImageSelect(variant.image, variant.name);
                 }
               }}>
            {/* Thumbnail image */}
            <div className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-sm ${
              isSelected 
                ? 'border-[#FF4747] shadow-md ring-2 ring-[#FF4747]/20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-[#FF4747] rounded-full flex items-center justify-center shadow-md z-20">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <img
                src={variant.image || 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop'}
                alt={variant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Variant image loading error for:', variant.name);
                  // Fallback to a generic placeholder
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop';
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default ProductColorVariants;