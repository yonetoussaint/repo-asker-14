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
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  bestseller?: boolean;
  limited?: boolean;
  active?: boolean;
}

interface VariantItemProps {
  variant: ProductVariant;
  selectedVariant: string;
  onVariantChange: (variantId: string) => void;
  stockInfo?: VariantStockInfo;
  getTimeRemaining?: (variantId: string) => { minutes: number, seconds: number } | null;
}

const VariantItem: React.FC<VariantItemProps> = ({
  variant,
  selectedVariant,
  onVariantChange,
  stockInfo,
}) => {
  const isSelected = selectedVariant === variant.id;
  
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
  
  const isActive = variant.active !== false && stockInfo?.isActive || false;
  
  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={cn(
              "relative flex flex-col items-center p-1 rounded-md transition-all duration-200",
              isSelected 
                ? 'ring-2 ring-primary bg-primary/10' 
                : 'hover:bg-muted',
              currentStock === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => currentStock > 0 && onVariantChange(variant.id)}
            aria-label={`Select variant: ${variant.name}`}
            disabled={currentStock === 0}
          >
            <div 
              className="relative w-10 h-10 rounded-t-full overflow-hidden border border-border mb-0.5"
            >
              {variant.image ? (
                <img 
                  src={variant.image} 
                  alt={variant.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {variant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {isLowStock && currentStock > 0 && (
                <div className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  <span className="text-[7px] font-medium px-1">
                    {currentStock}
                  </span>
                </div>
              )}
              
              {currentStock === 0 && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <span className="text-[9px] font-medium text-destructive">Sold out</span>
                </div>
              )}
            </div>
            
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">
              {variant.name}
            </span>
            
            <span className="text-[10px] text-primary font-medium truncate w-full text-center">
              ${variant.price.toFixed(2)}
            </span>
            
            {variant.bestseller && (
              <Badge 
                className="absolute -top-1 -left-1 text-[7px] py-0 px-1"
                variant="secondary"
              >
                BEST
              </Badge>
            )}
            
            {variant.limited && (
              <Badge 
                className="absolute -top-1 -left-1 text-[7px] py-0 px-1"
                variant="destructive"
              >
                LIMITED
              </Badge>
            )}
            
            {isSelected && (
              <Check 
                className="absolute top-0 right-0 w-4 h-4 text-primary bg-background rounded-full p-0.5 shadow-sm" 
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs p-2">
          <p className="font-medium">{variant.name}</p>
          <p className="text-primary">${variant.price.toFixed(2)}</p>
          <p className={isLowStock ? "text-destructive" : "text-muted-foreground"}>
            {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
          </p>
          {variant.bestseller && <p className="text-amber-600">Bestseller</p>}
          {variant.limited && <p className="text-destructive">Limited Edition</p>}
        </TooltipContent>
      </Tooltip>
  );
};

export default VariantItem;