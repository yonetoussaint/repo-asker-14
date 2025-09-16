import React from 'react';

interface ConditionVariant {
  name: string;
  price: number;
}

interface ProductConditionsVariantsProps {
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
  variants: ConditionVariant[];
  bundlePrice: number;
  hideHeader?: boolean;
}

const ProductConditionsVariants: React.FC<ProductConditionsVariantsProps> = ({ 
  selectedCondition, 
  onConditionChange, 
  variants, 
  bundlePrice, 
  hideHeader 
}) => {
  return (
    <div className="">
      <div className="flex py-3 gap-4 overflow-x-auto overflow-y-visible px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {variants.map((variant) => (
          <div
            key={variant.name}
            onClick={() => onConditionChange(variant.name)}
            className={`min-w-24 flex-shrink-0 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden ${
              selectedCondition === variant.name 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Top Half */}
            <div className={`p-2 text-center ${selectedCondition === variant.name ? 'bg-blue-50' : 'bg-white'}`}>
              <h3 className="text-sm font-bold text-gray-900">{variant.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductConditionsVariants;