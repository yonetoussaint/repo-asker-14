import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface VariantSummaryCardProps {
  activeVariantFilter: string | null;
  availableVariants: any[];
  getVariantMainImage: (variantNameId: number) => string;
  getVariantName: (variantNameId: number) => string;
  getSubvariantCount: (variantNameId: number) => number;
  getVariantPriceRange: (variantNameId: number) => string;
  getVariantTotalStock: (variantNameId: number) => number;
  onEditVariantType: (variantNameId: number) => void;
  onDeleteVariantType: (variantNameId: number) => void;
  onUpdateVariantPrice?: (variantNameId: number, price: number) => Promise<void>;
  productId?: string;
}

export const VariantSummaryCard: React.FC<VariantSummaryCardProps> = ({
  activeVariantFilter,
  availableVariants,
  getVariantMainImage,
  getVariantName,
  getSubvariantCount,
  getVariantPriceRange,
  getVariantTotalStock,
  onEditVariantType,
  onDeleteVariantType,
  onUpdateVariantPrice,
  productId
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  if (!activeVariantFilter || availableVariants.length === 0) {
    return null;
  }

  const variantId = parseInt(activeVariantFilter);
  const currentVariant = availableVariants.find(v => v.id === variantId);
  const hasSubvariants = getSubvariantCount(variantId) > 0;
  const canEditPrice = !hasSubvariants && onUpdateVariantPrice && productId;

  const handleStartEdit = () => {
    if (!canEditPrice) return;
    const currentPriceStr = getVariantPriceRange(variantId);
    // Extract numeric value from price string - handle various formats
    const priceMatch = currentPriceStr.match(/([0-9,]+\.?[0-9]*)/);
    const currentPrice = priceMatch ? priceMatch[1].replace(/,/g, '') : '0';
    setEditPrice(currentPrice);
    setIsEditingPrice(true);
  };

  const handleSavePrice = async () => {
    if (!onUpdateVariantPrice || !productId) return;
    
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) return;

    setIsSaving(true);
    try {
      await onUpdateVariantPrice(variantId, newPrice);
      setIsEditingPrice(false);
    } catch (error) {
      console.error('Failed to update price:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPrice(false);
    setEditPrice('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={getVariantMainImage(variantId)}
          alt={getVariantName(variantId)}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{getVariantName(variantId)}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {getSubvariantCount(variantId)} subvariants
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEditVariantType(variantId)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit variant type"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDeleteVariantType(variantId)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete variant type"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">
            {hasSubvariants ? 'Price Range' : 'Price'}
          </p>
           {isEditingPrice ? (
             <div className="flex items-center justify-center gap-1">
               <span className="text-xs">$</span>
               <input
                 type="text"
                 value={editPrice}
                 onChange={(e) => {
                   const value = e.target.value;
                   // Allow numbers, decimal points, and basic editing
                   if (value === '' || /^\d*\.?\d*$/.test(value)) {
                     setEditPrice(value);
                   }
                 }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleSavePrice();
                   } else if (e.key === 'Escape') {
                     handleCancelEdit();
                   }
                 }}
                 className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                 placeholder="0"
                 autoFocus
                 onFocus={(e) => e.target.select()}
               />
               <button
                 onClick={handleSavePrice}
                 disabled={isSaving}
                 className="p-0.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                 title="Save"
               >
                 <Check size={12} />
               </button>
               <button
                 onClick={handleCancelEdit}
                 className="p-0.5 text-red-600 hover:bg-red-50 rounded"
                 title="Cancel"
               >
                 <X size={12} />
               </button>
             </div>
          ) : (
            <div 
              className={`font-semibold text-sm text-gray-900 ${canEditPrice ? 'cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5' : ''}`}
              onClick={handleStartEdit}
              role={canEditPrice ? 'button' : undefined}
              aria-label={canEditPrice ? 'Edit price' : undefined}
            >
              {getVariantPriceRange(variantId)}
              {canEditPrice && (
                <Edit2 className="inline-block ml-1 w-3 h-3 opacity-50" />
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-1">
            {getSubvariantCount(variantId) > 0 ? 'Total Stock' : 'Stock'}
          </p>
          <p className="font-semibold text-sm text-gray-900">
            {getVariantTotalStock(variantId)}
          </p>
        </div>
      </div>
    </div>
  );
};