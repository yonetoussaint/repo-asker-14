import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DynamicDescription from './DynamicDescription';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';


const ProductDescriptionSection = () => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  if (!product) return null;

  const handleSeeFullDescription = () => {
    setIsSheetOpen(true);
  };

  // Helper function to strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between py-3">
          <h2 className="text-base font-medium text-gray-900">Product Details</h2>
          <button 
            onClick={handleSeeFullDescription}
            className="text-sm text-blue-600 font-medium active:text-blue-800 transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4">
        {product.description ? (
          showFullContent ? (
            <DynamicDescription 
              content={product.description} 
              product={product}
              className="text-gray-900 text-base leading-7 font-normal"
            />
          ) : (
            <div className="text-gray-900 text-base leading-7 font-normal">
              {`${stripHtml(product.description).slice(0, 120)}...`}
            </div>
          )
        ) : (
          <div className="text-gray-500 text-base italic">
            No description available
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="pb-4">
        <button 
          onClick={() => setShowFullContent(!showFullContent)}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 text-sm font-medium active:bg-gray-50 transition-colors rounded-lg border border-gray-200"
        >
          <span>{showFullContent ? 'Show Less' : 'Show More'}</span>
          {showFullContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Description Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 overflow-hidden">
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-lg font-semibold">Product Description</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4 overflow-y-auto h-[calc(85vh-73px)]">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
              <DynamicDescription 
                content={product.description} 
                product={product}
                className="text-gray-700 text-base leading-7"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductDescriptionSection;