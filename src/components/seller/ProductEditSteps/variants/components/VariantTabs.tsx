import React from 'react';
import { Plus } from 'lucide-react';

interface VariantTabsProps {
  availableVariants: any[];
  activeVariantFilter: string | null;
  onVariantFilterChange: (filter: string) => void;
  onAddTab: () => void;
}

export const VariantTabs: React.FC<VariantTabsProps> = ({
  availableVariants,
  activeVariantFilter,
  onVariantFilterChange,
  onAddTab
}) => {
  if (availableVariants.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 mb-4">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 flex-1">
        <div className="flex gap-1">
          {availableVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onVariantFilterChange(variant.id.toString())}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeVariantFilter === variant.id.toString() 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onAddTab}
        className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex-shrink-0 sticky right-0"
        title="Add new tab"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};