import React from 'react';

interface ProductNameDisplayProps {
  product?: {
    name?: string;
  };
  selectedColor?: string;
  selectedStorage?: string;
  selectedNetwork?: string;
  selectedCondition?: string;
  className?: string;
}

const ProductNameDisplay: React.FC<ProductNameDisplayProps> = ({ 
  product, 
  selectedColor,
  selectedStorage,
  selectedNetwork,
  selectedCondition,
  className = '' 
}) => {
  if (!product || !product.name) return null;

  // Build the variant string with bullet separators
  const getVariantString = () => {
    const variants: string[] = [];

    if (selectedColor) variants.push(selectedColor);
    if (selectedStorage) variants.push(selectedStorage);
    if (selectedNetwork) variants.push(selectedNetwork);
    if (selectedCondition) variants.push(selectedCondition);

    return variants.join(' ');
  };

  const variantString = getVariantString();

  return (
    <div className={`w-full bg-white px-2 py-1 border-b border-gray-100 ${className}`}>
      <h1 className="text-base font-normal text-gray-900 line-clamp-2">
        {product.name}
        {variantString && (
          <span className="text-base font-normal text-gray-900 ml-2">
            {variantString}
          </span>
        )}
      </h1>
    </div>
  );
};

export default ProductNameDisplay;