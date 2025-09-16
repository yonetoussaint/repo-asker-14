
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronDown, ChevronUp } from "lucide-react";

interface ProductPaymentOptionsProps {
  paymentOptions: string[];
}

const ProductPaymentOptions: React.FC<ProductPaymentOptionsProps> = ({
  paymentOptions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedOptions = isExpanded ? paymentOptions : paymentOptions.slice(0, 2);

  return (
    <div className="w-full px-2 py-0.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Payment Options:</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-blue-600"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              Show All <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </div>

      <div className="mt-2">
        {displayedOptions.map((option, index) => (
          <div key={index} className="flex items-center py-0.5">
            <CreditCard className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
            <span className="text-sm text-gray-700">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPaymentOptions;
