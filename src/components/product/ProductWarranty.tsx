
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WarrantyOption {
  name: string;
  duration: string;
  price: number;
}

interface ProductWarrantyProps {
  warrantyOptions: WarrantyOption[];
  selectedWarranty: string;
  onWarrantyChange: (warranty: string) => void;
}

const ProductWarranty: React.FC<ProductWarrantyProps> = ({
  warrantyOptions,
  selectedWarranty,
  onWarrantyChange
}) => {
  const [showWarrantyOptions, setShowWarrantyOptions] = useState(false);
  
  const selectedOption = warrantyOptions.find(w => w.name.toLowerCase() === selectedWarranty);
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <div className="w-full px-2 py-0.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Warranty:</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs text-blue-600"
          onClick={() => setShowWarrantyOptions(!showWarrantyOptions)}
        >
          {selectedWarranty === "none" ? "Add Warranty" : `${selectedOption?.name} (${selectedOption?.duration})`}
        </Button>
      </div>
      
      {showWarrantyOptions && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <RadioGroup 
            value={selectedWarranty}
            onValueChange={onWarrantyChange}
          >
            <div className="flex items-start space-x-2 mb-2">
              <RadioGroupItem value="none" id="none" className="mt-1" />
              <label htmlFor="none" className="text-sm cursor-pointer flex-1">
                <div className="font-medium">No additional warranty</div>
                <div className="text-xs text-gray-500">Product includes manufacturer's warranty</div>
              </label>
            </div>
            
            {warrantyOptions.map((option) => (
              <div key={option.name.toLowerCase()} className="flex items-start space-x-2 mb-2">
                <RadioGroupItem value={option.name.toLowerCase()} id={option.name.toLowerCase()} className="mt-1" />
                <label htmlFor={option.name.toLowerCase()} className="text-sm cursor-pointer flex-1">
                  <div className="font-medium">
                    {option.name} ({option.duration}){option.price > 0 ? ` - $${formatPrice(option.price)}` : " - Included"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {option.name === "Standard" 
                      ? "Basic coverage for manufacturing defects" 
                      : option.name === "Extended" 
                        ? "Extended coverage including wear and tear" 
                        : "Premium coverage with accidental damage protection"}
                  </div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default ProductWarranty;
