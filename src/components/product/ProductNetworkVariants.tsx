import React from 'react';
import { LockKeyholeOpen, Lock } from 'lucide-react';

interface NetworkVariant {
  type: string;
  price: number;
  logo?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

interface ProductNetworkVariantsProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  variants: NetworkVariant[];
  bundlePrice: number;
  hideHeader?: boolean;
}

const ProductNetworkVariants: React.FC<ProductNetworkVariantsProps> = ({ 
  selectedNetwork, 
  onNetworkChange, 
  variants, 
  bundlePrice, 
  hideHeader 
}) => {
  // Helper function to get default styling for network types
  const getNetworkStyling = (variant: NetworkVariant) => {
    const defaults: Record<string, { color: string; bgColor: string; borderColor: string }> = {
      'Unlocked': { color: '#10b981', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
      'Verizon': { color: '#ef4444', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
      'AT&T': { color: '#3b82f6', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
      'T-Mobile': { color: '#ec4899', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
      'MetroPCS': { color: '#8b5cf6', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
    };

    return {
      color: variant.color || defaults[variant.type]?.color || '#6b7280',
      bgColor: variant.bgColor || defaults[variant.type]?.bgColor || 'bg-gray-50',
      borderColor: variant.borderColor || defaults[variant.type]?.borderColor || 'border-gray-200'
    };
  };

  // Helper function to get default logos (using base64 encoded images for reliability)
  const getNetworkLogo = (variant: NetworkVariant) => {
    const logos: Record<string, string> = {
      'Verizon': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2VlMTEyZCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxNCI+VmVyaXpvbjwvdGV4dD48L3N2Zz4=',
      'AT&T': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZHRleHQgeD0iNTAiIHk9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3Y2JhIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjE0Ij5BVCZUPC90ZXh0Pjwvc3ZnPg==',
      'T-Mobile': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2UyMGU4NCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxMyI+VC1Nb2JpbGU8L3RleHQ+PC9zdmc+',
      'MetroPCS': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzhmNTJiNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxMiI+TWV0cm9QQ1M8L3RleHQ+PC9zdmc+',
      'Sprint': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZGQwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxNCI+U3ByaW50PC90ZXh0Pjwvc3ZnPg==',
      'Boost Mobile': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmNjYwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxMiI+Qm9vc3Q8L3RleHQ+PC9zdmc+'
    };

    return variant.logo || logos[variant.type];
  };

  return (
    <div className="">
      <div className="flex py-3 gap-4 overflow-x-auto overflow-y-visible px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {variants.map((variant) => {
          const isSelected = selectedNetwork === variant.type;
          const styling = getNetworkStyling(variant);
          const logo = getNetworkLogo(variant);
          const isUnlocked = variant.type === 'Unlocked';

          return (
            <button
              key={variant.type}
              onClick={() => onNetworkChange(variant.type)}
              className={`min-w-20 min-h-24 flex flex-col rounded-lg overflow-hidden flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-200 m-0.5 ${
                isSelected 
                  ? `ring-2 ${styling.bgColor} ${styling.borderColor}` 
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
              style={isSelected ? { 
                borderColor: styling.color, 
                '--tw-ring-color': styling.color 
              } as React.CSSProperties : {}}
            >
              <div className="flex-1 flex items-center justify-center p-2 relative">
                {logo && !isUnlocked ? (
                  <>
                    <img 
                      src={logo} 
                      alt={`${variant.type} logo`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: '32px', maxWidth: '48px' }}
                    />
                    <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-600" />
                  </>
                ) : (
                  <LockKeyholeOpen className="w-6 h-6" style={{ color: styling.color }} />
                )}
              </div>
              <div className={`px-2 py-1 flex items-center justify-center text-xs ${
                isSelected ? 'bg-white bg-opacity-70' : 'bg-gray-50'
              }`}>
                <span className="font-medium text-center" style={isSelected ? { color: styling.color } : {}}>
  {variant.type}
</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductNetworkVariants;