import React from 'react';

interface StorageVariant {
  name: string;
  price: number;
  quantity: number;
}

interface ProductStorageVariantsProps {
  selectedStorage: string;
  onStorageChange: (storage: string) => void;
  variants: StorageVariant[];
  bundlePrice: number;
  hideHeader?: boolean;
}

const ProductStorageVariants: React.FC<ProductStorageVariantsProps> = ({ 
  selectedStorage, 
  onStorageChange, 
  variants, 
  bundlePrice, 
  hideHeader 
}) => (
    <div className="">
    <div className="flex py-3 gap-4 overflow-x-auto overflow-y-visible px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {variants.map((variant) => (
          <div
            key={variant.name}
            onClick={() => onStorageChange(variant.name)}
            className={`min-w-24 flex-shrink-0 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden ${
              selectedStorage === variant.name 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Top Half */}
            <div className={`p-2 text-center ${selectedStorage === variant.name ? 'bg-blue-50' : 'bg-white'}`}>
              <h3 className="text-sm font-bold text-gray-900">{variant.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
);

export default ProductStorageVariants;