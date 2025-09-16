import React from 'react';
import { ChevronDown, ChevronUp, Wifi, HardDrive } from 'lucide-react';

interface VariantSectionHeaderProps {
  title: string;
  selectedValue: string;
  variantCount: number;
  price: number | string; // Allow both number and formatted string
  isExpanded: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  colorCode?: string;
  displayValue?: string;
  isBestseller?: boolean;
  stockQuantity?: number;
  optionsQuantity?: number;
  priceFrom?: number;
  priceTo?: number;
}

const VariantSectionHeader: React.FC<VariantSectionHeaderProps> = ({
  title,
  selectedValue,
  variantCount,
  price,
  isExpanded,
  onToggle,
  icon,
  colorCode,
  displayValue,
  isBestseller = false,
  stockQuantity,
  optionsQuantity,
  priceFrom,
  priceTo
}) => {
  // Determine which icon to use based on title
  const getIcon = () => {
    if (icon) return icon;

    if (title.toLowerCase().includes('network') || title.toLowerCase().includes('connect')) {
      return <Wifi className="w-5 h-5 text-gray-600" />;
    }

    if (title.toLowerCase().includes('storage') || title.toLowerCase().includes('memory')) {
      return <HardDrive className="w-5 h-5 text-gray-600" />;
    }

    return null;
  };

  const sectionIcon = getIcon();

  if (!isExpanded) {
    // Collapsed state - NO ICONS, only color swatch for color section
    return (
  <div className="flex items-center justify-between py-3 px-0 cursor-pointer" onClick={onToggle}>
    <div className="flex items-center gap-3">
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Selected {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 truncate">
            {displayValue || selectedValue}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0">
          <span className="text-xs text-gray-500">{variantCount} {variantCount === 1 ? 'option' : 'options'}</span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-500">{stockQuantity} in stock</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center gap-0.5">
      <ChevronDown className="w-6 h-6 text-gray-500 font-bold stroke-[3]" />
      <span className="text-xs text-gray-400 font-medium">More</span>
    </div>
  </div>
);
  }

  // Expanded state - Show color swatch for color section, icon for others
  return (
    <div className="relative">
      <div className="flex items-center justify-between py-2 px-0 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          {/* Show icon for non-color sections */}
          {sectionIcon && !colorCode ? (
            <div className="flex items-center justify-center h-12">
              {React.cloneElement(sectionIcon as React.ReactElement, { 
                className: "w-7 h-7 text-gray-600" 
              })}
            </div>
          ) : null}
          <div className="leading-tight">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {title}:
              </span>
              <span className="text-gray-600">{displayValue || selectedValue}</span>
              {isBestseller && (
                <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-medium text-xs">Bestseller</span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              {stockQuantity !== undefined && (
                <span className="text-green-600">{stockQuantity} in stock</span>
              )}
              {optionsQuantity !== undefined && (
                <span className="text-blue-600">{optionsQuantity} options</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <ChevronUp className="w-5 h-5 text-gray-400 stroke-[3]" />
          <span className="text-xs text-gray-400">Close</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-[-8px] right-[-8px] h-px bg-gray-200"></div>
    </div>
  );
};

export default VariantSectionHeader;