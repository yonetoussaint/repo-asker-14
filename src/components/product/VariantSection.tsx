import React from 'react';
import ProductSectionWrapper from './ProductSectionWrapper';
import Separator from './Separator';
import VariantSectionHeader from './VariantSectionHeader';

interface VariantSectionProps {
  title: string;
  selectedValue: string;
  variantCount: number;
  price: number | string; // Allow both number and formatted string
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  colorCode?: string;
  displayValue?: string;
  showSeparator?: boolean;
  isBestseller?: boolean;
  stockQuantity?: number;
  optionsQuantity?: number;
  priceFrom?: number;
  priceTo?: number;
}

const VariantSection: React.FC<VariantSectionProps> = ({
  title,
  selectedValue,
  variantCount,
  price,
  isExpanded,
  onToggle,
  children,
  icon,
  colorCode,
  displayValue,
  showSeparator = true,
  isBestseller,
  stockQuantity,
  optionsQuantity,
  // Removed priceFrom and priceTo from destructuring
}) => {
  return (
    <>
      <ProductSectionWrapper className="!pt-0 !mt-0 !pb-0 !px-0">
        <div className="space-y-0">
          <div className="cursor-pointer px-2">
            <VariantSectionHeader
              title={title}
              selectedValue={selectedValue}
              variantCount={variantCount}
              price={price}
              isExpanded={isExpanded}
              onToggle={onToggle}
              icon={icon}
              colorCode={colorCode}
              displayValue={displayValue}
              // Pass the new props:
              isBestseller={isBestseller}
              stockQuantity={stockQuantity}
              optionsQuantity={optionsQuantity}
              // Removed priceFrom and priceTo since they're no longer used in the header
            />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              {children}
            </div>
          )}
        </div>
      </ProductSectionWrapper>
      {showSeparator && <Separator className="my-0" />}
    </>
  );
};

export default VariantSection;