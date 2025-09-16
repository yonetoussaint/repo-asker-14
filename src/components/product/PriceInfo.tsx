import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies, currencyToCountry } from '@/contexts/CurrencyContext';

interface CurrencySwitcherProps {
  showPrice?: boolean;
  price?: number;
  className?: string;
  buttonClassName?: string;
  showToggle?: boolean; // Changed from showSwitcher to showToggle
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  showPrice = true, 
  price = 0,
  className = "",
  buttonClassName = "",
  showToggle = true // Default to showing toggle elements
}) => {
  const { currentCurrency, toggleCurrency, formatPrice } = useCurrency();

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />

      <div className={className}>
        <button
          onClick={showToggle ? toggleCurrency : undefined}
          className={`bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${showToggle ? 'hover:bg-black/70 cursor-pointer' : 'cursor-default'} transition-colors ${buttonClassName}`}
          aria-label={showToggle ? "Change currency" : "Current price"}
          disabled={!showToggle}
        >
          {showToggle && (
            <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
              <span className={`fi fi-${currencyToCountry[currentCurrency]} scale-150`}></span>
            </div>
          )}
          {showToggle && <ChevronDown className="w-3 h-3 stroke-2" />}
          {showPrice && (
            <span className="text-white font-bold">
              {formatPrice(price)}
            </span>
          )}
          <span className="font-bold">
            {currencies[currentCurrency]}
          </span>
        </button>
      </div>
    </>
  );
};

interface PriceInfoProps {
  product?: {
    id: string;
    name: string;
    price?: number;
    variants?: any[];
  };
  focusMode?: boolean;
  isPlaying?: boolean;
  configurationData?: {
    selectedColor?: string;
    selectedStorage?: string;
    selectedNetwork?: string;
    selectedCondition?: string;
    getSelectedColorVariant: () => any;
    getSelectedStorageVariant: () => any;
    getSelectedNetworkVariant: () => any;
    getSelectedConditionVariant: () => any;
  } | null;
}

const PriceInfo: React.FC<PriceInfoProps> = ({ 
  product, 
  focusMode,
  isPlaying,
  configurationData 
}) => {
  const { formatPrice } = useCurrency();

  if (!product) return null;

  // Always get the price from the selected variant
  const getCurrentVariantPrice = () => {
    if (configurationData) {
      // Try to get price from the deepest level variant (condition > network > storage > color)
      const selectedConditionVariant = configurationData.getSelectedConditionVariant();
      if (selectedConditionVariant && selectedConditionVariant.price !== undefined) {
        return selectedConditionVariant.price;
      }

      const selectedNetworkVariant = configurationData.getSelectedNetworkVariant();
      if (selectedNetworkVariant && selectedNetworkVariant.price !== undefined) {
        return selectedNetworkVariant.price;
      }

      const selectedStorageVariant = configurationData.getSelectedStorageVariant();
      if (selectedStorageVariant && selectedStorageVariant.price !== undefined) {
        return selectedStorageVariant.price;
      }

      const selectedColorVariant = configurationData.getSelectedColorVariant();
      if (selectedColorVariant && selectedColorVariant.price !== undefined) {
        return selectedColorVariant.price;
      }
    }

    // Use the product price (which now defaults to first variant price when variants exist)
    return product.price || 0;
  };

  const currentPrice = getCurrentVariantPrice();

  return (
    <div className={`absolute bottom-12 left-3 z-30 transition-opacity duration-300 ${(focusMode || isPlaying) ? 'opacity-0' : ''}`}>
      <CurrencySwitcher 
        showPrice={true}
        price={currentPrice}
        showToggle={false} // This will hide flag and chevron but keep currency code
      />
    </div>
  );
};

export default PriceInfo;