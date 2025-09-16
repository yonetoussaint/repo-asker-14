import React from 'react';
import { Edit2, Trash2, Copy } from 'lucide-react';

interface VariantCardProps {
  variant: any;
  currentTemplate: any;
  getDisplayName: (variant: any) => string;
  formatPrice: (price: number) => string;
  onEdit: (variant: any) => void;
  onDelete: (id: number) => void;
}

export const VariantCard: React.FC<VariantCardProps> = ({
  variant,
  currentTemplate,
  getDisplayName,
  formatPrice,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">{getDisplayName(variant)}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {currentTemplate.variantFields.slice(1).map((field: any, index: number) => (
              <React.Fragment key={field.key}>
                <p className="text-xs text-gray-500">
                  {variant[field.key]}
                </p>
                {index < currentTemplate.variantFields.length - 2 && (
                  <span className="w-px h-2 bg-gray-400"></span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(variant)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(variant.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 mb-1">Price</p>
          <p className="font-semibold text-sm">{formatPrice(variant.price)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 mb-1">Stock</p>
          <p className="font-semibold text-sm">{variant.stock}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-600 mb-1 text-center">SKU</p>
          <div className="flex items-center justify-between gap-1">
            <p className="font-mono text-xs text-gray-700 truncate flex-1">
              {variant.sku.length > 8 ? `${variant.sku.substring(0, 8)}...` : variant.sku}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(variant.sku)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 flex-shrink-0"
              title="Copy SKU"
            >
              <Copy size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};