import React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VisualIndicator {
  type: 'color' | 'badge' | 'price' | 'text';
  value: string;
  color?: string; // For color swatches
  variant?: 'popular' | 'bestseller' | 'limited' | 'discount' | 'default'; // For badges
  prefix?: string; // For price prefix like "$"
}

interface ProductSectionHeaderProps {
  title: string;
  icon: LucideIcon;
  count?: number;
  countLabel?: string;
  rightContent?: React.ReactNode;
  selectedInfo?: string;
  leftExtra?: React.ReactNode;
  visualIndicators?: VisualIndicator[];
  description?: string;
}

const ProductSectionHeader: React.FC<ProductSectionHeaderProps> = ({
  title,
  icon: Icon,
  count,
  countLabel,
  rightContent,
  selectedInfo,
  leftExtra,
  visualIndicators = [],
  description
}) => {
  const renderVisualIndicator = (indicator: VisualIndicator, index: number) => {
    switch (indicator.type) {
      case 'color':
        return (
          <div 
            key={index}
            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
            style={{ 
              backgroundColor: indicator.color,
              borderColor: indicator.color === '#FFFFFF' ? '#D1D5DB' : indicator.color
            }}
            title={indicator.value}
          />
        );
      
      case 'badge':
        const badgeVariants = {
          popular: "bg-blue-100 text-blue-800",
          bestseller: "bg-amber-100 text-amber-800", 
          limited: "bg-red-100 text-red-800",
          discount: "bg-green-100 text-green-800",
          default: "bg-gray-100 text-gray-800"
        };
        
        return (
          <Badge 
            key={index}
            className={`text-xs px-1.5 py-0.5 ${badgeVariants[indicator.variant || 'default']}`}
          >
            {indicator.value}
          </Badge>
        );
      
      case 'price':
        return (
          <span key={index} className="text-xs font-medium text-gray-700">
            {indicator.prefix || ''}{indicator.value}
          </span>
        );
      
      case 'text':
        return (
          <span key={index} className="text-xs text-gray-600">
            {indicator.value}
          </span>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <Icon className="w-4 h-4 text-[#FF4747]" />

          {/* Group title and extras */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">{title}</span>

            {leftExtra && (
              <div>{leftExtra}</div>
            )}

            {/* Visual indicators */}
            {visualIndicators.length > 0 && (
              <div className="flex items-center gap-1.5">
                {visualIndicators.map((indicator, index) => renderVisualIndicator(indicator, index))}
              </div>
            )}
          </div>

          {count !== undefined && countLabel && (
            <span className="text-xs text-[#FF4747] font-medium">
              ({count} {countLabel})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedInfo && (
            <span className="text-xs text-gray-500">
              Selected: <span className="font-medium">{selectedInfo}</span>
            </span>
          )}
          {rightContent}
        </div>
      </div>

      {/* Description row */}
      {description && (
        <div className="mt-1 ml-5">
          <span className="text-xs text-gray-500">{description}</span>
        </div>
      )}
    </div>
  );
};

export default ProductSectionHeader;