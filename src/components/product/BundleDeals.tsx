import React, { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface BundleTier {
  min: number;
  max: number | null;
  discount: number;
  isMinimum?: boolean;
}

interface BundleDealsProps {
  className?: string;
  currentTier?: BundleTier | null;
  currentQuantity?: number;
  onQuantitySelect?: (quantity: number) => void;
  calculatePrice?: (discount: number) => number;
  bundleDeals?: BundleTier[];
  productPrice?: number;
  onPriceChange?: (price: number, tier: BundleTier | null) => void;
  enabled?: boolean;
}

const BundleDeals = ({ 
  className = '', 
  currentTier = null,
  currentQuantity = 1,
  onQuantitySelect = null, 
  calculatePrice = null,
  bundleDeals = [],
  productPrice = 100,
  onPriceChange = null,
  enabled = true
}: BundleDealsProps) => {
  const [selectedTier, setSelectedTier] = useState<BundleTier | null>(currentTier);
  // Use provided bundle deals or fallback to default, sorted by min quantity ascending
  const visibleTiers = (bundleDeals.length > 0 ? bundleDeals : [
    { min: 1, max: 9, discount: 0, isMinimum: true },
    { min: 10, max: 49, discount: 5 },
    { min: 50, max: 99, discount: 10 },
    { min: 100, max: 499, discount: 15 },
    { min: 500, max: 999, discount: 20 },
    { min: 1000, max: null, discount: 25 }
  ]).sort((a, b) => a.min - b.min);

  // Calculate price based on discount
  const calculateFinalPrice = calculatePrice || ((discount) => productPrice * (1 - discount / 100));
  const [showAll, setShowAll] = useState(false);
  
  // Get current tier based on quantity or current tier
  const getCurrentTier = () => {
    if (selectedTier) return selectedTier;
    if (currentTier) return currentTier;
    return visibleTiers.find(tier => {
      if (tier.max === null) return currentQuantity >= tier.min;
      return currentQuantity >= tier.min && currentQuantity <= tier.max;
    }) || visibleTiers[0];
  };
  
  const activeTier = getCurrentTier();
  const currentPrice = calculateFinalPrice(activeTier?.discount || 0);
  
  // Handle tier selection
  const handleTierSelect = (tier: BundleTier) => {
    setSelectedTier(tier);
    const tierPrice = calculateFinalPrice(tier.discount);
    onPriceChange?.(tierPrice, tier);
    onQuantitySelect?.(tier.min);
  };
  
  // Notify parent of price changes when tier changes
  React.useEffect(() => {
    if (onPriceChange && activeTier) {
      onPriceChange(currentPrice, activeTier);
    }
  }, [currentPrice, activeTier, onPriceChange]);

  // Show only first 3 tiers initially
  const displayedTiers = showAll ? visibleTiers : visibleTiers.slice(0, 3);

  // Don't render if disabled
  if (!enabled) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bundle Deals</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="mr-1" size={12} />
          <span>Limited time offer</span>
        </div>
      </div>

      {/* Selected Bundle Display */}
      {currentTier && (
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {currentTier.max === Infinity ? `${currentTier.min}+ units` : `${currentTier.min}-${currentTier.max} units`}
                {currentTier.isMinimum && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                    Minimum Order
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {currentTier.discount > 0 ? `Discounted pricing` : 'Standard pricing'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-orange-700 text-sm">
                HTG {calculateFinalPrice(currentTier.discount).toFixed(0)}/unit
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Bundle Options - Grid Layout */}
      <div className="grid grid-cols-3 gap-4">
        {displayedTiers.map((tier, index) => {
          const rangeLabel = `${tier.min}+ units`;
          const isSelected = selectedTier === tier || activeTier === tier;
          const isMinimumTier = tier.isMinimum;

          return (
            <div
              key={index}
              onClick={() => handleTierSelect(tier)}
              className={`border rounded-lg overflow-hidden transition-all cursor-pointer bg-white
                ${isSelected
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-300 hover:border-gray-400"}`}
            >
              
              {/* Top section - Unit info */}
              <div className="bg-white">
                <div className="text-sm font-bold text-gray-900 text-center py-1">
                  {rangeLabel}
                </div>
                <div className="bg-black bg-opacity-10 text-center leading-none">
                  <span className="text-xs text-gray-700">
                    {tier.discount > 0 ? `${tier.discount}% off` : "Standard"}
                  </span>
                </div>
              </div>


              {/* Price section at bottom */}
              <div className="text-xs text-gray-600 p-2 bg-gray-100">
                <span className="text-gray-900 font-medium">
                  HTG {calculateFinalPrice(tier.discount).toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More/Less Button */}
      {visibleTiers.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium"
        >
          <span>{showAll ? 'Show less bundles' : 'View more bundles'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default BundleDeals;