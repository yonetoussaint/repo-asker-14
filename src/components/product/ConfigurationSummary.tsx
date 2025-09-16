import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useCurrency, currencies, currencyToCountry } from '@/contexts/CurrencyContext';

interface ConfigurationSummaryProps {
  selectedColor?: string;
  selectedStorage?: string;
  selectedNetwork?: string;
  selectedCondition?: string;
  colorVariants: any[];
  storageVariants: any[];
  networkVariants: any[];
  conditionVariants: any[];
  getSelectedColorVariant: () => any;
  getSelectedStorageVariant: () => any;
  getSelectedNetworkVariant: () => any;
  getSelectedConditionVariant: () => any;
  getStorageDisplayValue: (storage: string) => string;
  getVariantFormattedPrice: (id: number) => string;
  formatPrice: (price: number) => string;
  onClose?: () => void;
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({
  selectedColor,
  selectedStorage,
  selectedNetwork,
  selectedCondition,
  colorVariants,
  storageVariants,
  networkVariants,
  conditionVariants,
  getSelectedColorVariant,
  getSelectedStorageVariant,
  getSelectedNetworkVariant,
  getSelectedConditionVariant,
  getStorageDisplayValue,
  getVariantFormattedPrice,
  formatPrice,
  onClose,
}) => {
  const { currentCurrency, toggleCurrency, formatPrice: formatCurrencyPrice } = useCurrency();
  const getCurrentVariantPrice = () => {
    // Get the actual selected variant price from the deepest level (condition > network > storage > color)
    const selectedConditionVariant = getSelectedConditionVariant();
    if (selectedConditionVariant) {
      return selectedConditionVariant.price;
    }
    
    const selectedNetworkVariant = getSelectedNetworkVariant();
    if (selectedNetworkVariant) {
      return selectedNetworkVariant.price;
    }
    
    const selectedStorageVariant = getSelectedStorageVariant();
    if (selectedStorageVariant) {
      return selectedStorageVariant.price;
    }
    
    const selectedColorVariant = getSelectedColorVariant();
    if (selectedColorVariant) {
      return selectedColorVariant.price;
    }
    
    return 0;
  };

  const currentPrice = getCurrentVariantPrice();

  return (
    <div className="relative bg-white/90 backdrop-blur-sm px-3 py-1 flex flex-col justify-evenly h-96 w-48">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-3 h-3 text-gray-600" />
        </button>
      )}

        {/* Color Details */}
      {selectedColor && colorVariants.length > 0 && (
        <div className="text-left">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</p>
          <p className="font-semibold text-gray-900 text-sm">{selectedColor}</p>
        </div>
      )}

      {/* Separator */}
      {selectedColor && selectedStorage && colorVariants.length > 0 && storageVariants.length > 0 && (
        <hr className="border-gray-300 -mx-3" />
      )}

      {/* Storage Details */}
      {selectedStorage && storageVariants.length > 0 && (
        <div className="text-left">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Storage</p>
          <p className="font-semibold text-gray-900 text-sm">{getStorageDisplayValue(selectedStorage)}</p>
        </div>
      )}

      {/* Separator */}
      {selectedStorage && selectedNetwork && storageVariants.length > 0 && networkVariants.length > 0 && (
        <hr className="border-gray-300 -mx-3" />
      )}

      {/* Network Details */}
      {selectedNetwork && networkVariants.length > 0 && (
        <div className="text-left">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Network</p>
          <p className="font-semibold text-gray-900 text-sm">
            {selectedNetwork}
            {selectedNetwork !== 'Unlocked' && (
              <span className="text-xs text-gray-500 ml-1">(Locked)</span>
            )}
          </p>
        </div>
      )}

      {/* Separator */}
      {selectedNetwork && selectedCondition && networkVariants.length > 0 && conditionVariants.length > 0 && (
        <hr className="border-gray-300 -mx-3" />
      )}

      {/* Condition Details */}
      {selectedCondition && conditionVariants.length > 0 && (
        <div className="text-left">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Condition</p>
          <p className="font-semibold text-gray-900 text-sm">{selectedCondition}</p>
        </div>
      )}

      {/* Separator before price */}
      {selectedCondition && conditionVariants.length > 0 && (
        <hr className="border-gray-300 -mx-3" />
      )}

        {/* Total Price */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Price</p>
            <button
              onClick={toggleCurrency}
              className="bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-black/70 transition-colors"
            >
              <div className="w-3 h-3 rounded-full overflow-hidden flex items-center justify-center">
                <span className={`fi fi-${currencyToCountry[currentCurrency]} scale-125`}></span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 stroke-2" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900 text-sm">{formatCurrencyPrice(currentPrice)}</span>
            <span className="font-bold text-gray-900 text-sm">{currencies[currentCurrency]}</span>
          </div>
        </div>
      </div>
   );
};

export default ConfigurationSummary;