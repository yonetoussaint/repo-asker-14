
import React from "react";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { VariantStockInfo } from "@/hooks/useVariantStockDecay";

interface ProductVariant {
  name: string;
  price: number;
  stock: number;
  image: string;
  bestseller?: boolean;
  limited?: boolean;
}

interface ColorVariantItemProps {
  variant: ProductVariant;
  selectedColor: string;
  onColorChange: (color: string) => void;
  getColorHex: (name: string) => string;
  stockInfo?: VariantStockInfo;
  getTimeRemaining?: (variantName: string) => { minutes: number, seconds: number } | null;
}

const ColorVariantItem: React.FC<ColorVariantItemProps> = ({
  variant,
  selectedColor,
  onColorChange,
  getColorHex,
  stockInfo,
}) => {
  const isSelected = selectedColor === variant.name;
  
  // Use live stock data if available, otherwise fall back to static stock
  const currentStock = stockInfo?.currentStock !== undefined 
    ? Math.floor(stockInfo.currentStock) 
    : variant.stock;
  
  const isLowStock = currentStock < 20;
  const isVeryLowStock = currentStock < 8;
  const isExtremelyLowStock = currentStock < 4;
  
  const lowStockText = currentStock === 0 ? "Sold out" :
                       currentStock === 1 ? "Last one!" :
                       isExtremelyLowStock ? `Only ${currentStock} left!` :
                       isVeryLowStock ? "Almost gone!" :
                       isLowStock ? "Low stock" : null;
  
  const isActive = stockInfo?.isActive || false;
  
  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={cn(
              "relative flex flex-col items-center p-1 rounded-md transition-all duration-200",
              isSelected 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-100',
              currentStock === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => currentStock > 0 && onColorChange(variant.name)}
            aria-label={`Select color: ${variant.name}`}
            disabled={currentStock === 0}
          >
            <div 
              className="relative w-10 h-10 rounded-t-full overflow-hidden border border-gray-200 mb-0.5"
              style={{
                backgroundColor: getColorHex(variant.name),
                border: variant.name === 'White' ? '1px solid #E0E0E0' : 'none'
              }}
            >
              {variant.image ? (
                <img 
                  src={variant.image} 
                  alt={variant.name} 
                  className="w-full h-full object-cover" 
                />
              ) : null}
              
              {isLowStock && currentStock > 0 && (
                <div className="absolute -top-1 -left-1 bg-red-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  <span className="text-[7px] font-medium px-1">
                    {currentStock}
                  </span>
                </div>
              )}
              
              {currentStock === 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                  <span className="text-[9px] font-medium text-red-500">Sold out</span>
                </div>
              )}
            </div>
            
            <span className="text-[10px] text-gray-600 truncate w-full text-center">
              {variant.name}
            </span>
            
            <span className="text-[10px] text-blue-600 font-medium truncate w-full text-center">
              from ${variant.price.toFixed(2)} USD
            </span>
            
            {variant.bestseller && (
              <Badge 
                className="absolute -top-1 -left-1 text-[7px] py-0 px-1 bg-amber-400 hover:bg-amber-400"
              >
                BEST
              </Badge>
            )}
            
            {variant.limited && (
              <Badge 
                className="absolute -top-1 -left-1 text-[7px] py-0 px-1 bg-red-500 hover:bg-red-500"
              >
                LIMITED
              </Badge>
            )}
            
            {isSelected && (
              <Check 
                className="absolute top-0 right-0 w-4 h-4 text-blue-500 bg-white rounded-full p-0.5 shadow-sm" 
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs p-2">
          <p className="font-medium">{variant.name}</p>
          <p className="text-blue-600">${variant.price.toFixed(2)}</p>
          <p className={isLowStock ? "text-red-500" : "text-gray-500"}>
            {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
          </p>
          {variant.bestseller && <p className="text-amber-600">Bestseller</p>}
          {variant.limited && <p className="text-red-600">Limited Edition</p>}
        </TooltipContent>
      </Tooltip>
  );
};

export default ColorVariantItem;
