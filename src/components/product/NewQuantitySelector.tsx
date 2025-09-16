import React, { useState } from 'react';
import { Package, Clock, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import ProductSectionHeader from './ProductSectionHeader';

// Price tiers configuration
const PRICE_TIERS = [
  { min: 1, max: 2, price: 10.00, discount: 0 },
  { min: 3, max: 5, price: 9.00, discount: 10 },
  { min: 6, max: 9, price: 8.50, discount: 15 },
  { min: 10, max: 49, price: 8.00, discount: 20 },
  { min: 50, max: 99, price: 7.50, discount: 25 },
  { min: 100, max: Infinity, price: 7.00, discount: 30 }
];

interface BundleDealsProps {
  className?: string;
}

const BundleDeals: React.FC<BundleDealsProps> = ({ 
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<number | null>(null);
  
  const visibleTiers = isExpanded ? PRICE_TIERS : PRICE_TIERS.slice(0, 3);
  const maxDiscount = Math.max(...PRICE_TIERS.map(tier => tier.discount));

  return (
    <div className={`mb-2 text-xs ${className}`}>
      {/* Header */}
      <ProductSectionHeader
        title="Bundle Deals"
        icon={Package}
        rightContent={
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
              Save up to {maxDiscount}%
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              Limited time offer
            </div>
          </div>
        }
      />

      {/* Bundle Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {visibleTiers.map((tier, index) => {
          const rangeLabel = tier.max === Infinity ? `${tier.min}+` : `${tier.min}-${tier.max}`;
          const isSelected = selectedBundle === index;
          const isPopular = tier.discount === 20; // Mark the 10-49 tier as popular

          return (
            <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button 
                    className={cn(
                      "relative flex flex-col items-center p-2 rounded-md transition-all duration-200",
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-100 bg-gray-50 border border-gray-200'
                    )}
                    onClick={() => setSelectedBundle(index)}
                    aria-label={`Select bundle: ${rangeLabel} pieces`}
                  >
                    {/* Quantity Circle */}
                    <div className="relative w-10 h-10 rounded-full border border-gray-200 mb-1 flex items-center justify-center bg-white">
                      <span className="text-sm font-bold text-gray-700">
                        {tier.max === Infinity ? `${tier.min}+` : Math.ceil((tier.min + tier.max) / 2)}
                      </span>
                      
                      {tier.discount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center">
                          <span className="text-[7px] font-medium px-1">
                            -{tier.discount}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price */}
                    <span className="text-[10px] text-blue-600 font-medium">
                      ${tier.price.toFixed(2)} each
                    </span>
                    
                    {/* Range */}
                    <span className="text-[10px] text-gray-600">
                      {rangeLabel} pcs
                    </span>
                    
                    {/* Popular Badge */}
                    {isPopular && (
                      <Badge 
                        className="absolute -top-1 -left-1 text-[7px] py-0 px-1 bg-amber-400 hover:bg-amber-400"
                      >
                        POPULAR
                      </Badge>
                    )}
                    
                    {/* Selection Check */}
                    {isSelected && (
                      <Check 
                        className="absolute top-0 right-0 w-4 h-4 text-blue-500 bg-white rounded-full p-0.5 shadow-sm" 
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs p-2">
                  <p className="font-medium">{rangeLabel} pieces</p>
                  <p className="text-blue-600">${tier.price.toFixed(2)} each</p>
                  <p className="text-green-600">Total: ${(tier.price * tier.min).toFixed(2)}+</p>
                  {tier.discount > 0 && <p className="text-red-600">{tier.discount}% discount</p>}
                  {isPopular && <p className="text-amber-600">Most popular choice</p>}
                </TooltipContent>
              </Tooltip>
          );
        })}
      </div>

      {/* Toggle button */}
      <div className="text-center mt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-500 text-xs font-medium flex items-center justify-center mx-auto hover:text-red-600 transition-colors"
        >
          {isExpanded ? 'View less' : 'View more'}
          {isExpanded ? (
            <ChevronUp size={12} className="ml-1" />
          ) : (
            <ChevronDown size={12} className="ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};

export default BundleDeals;