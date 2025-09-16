
import React, { useState, useMemo } from 'react';
import { Truck, MapPin, Clock, Shield, Package, ChevronDown, Star, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from 'react-router-dom';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
}

interface DeliveryLocation {
  country: string;
  city: string;
  estimatedDays: string;
  available: boolean;
}

interface ShippingInfo {
  free: boolean;
  express: number;
  estimated: string;
  expressEstimated: string;
  returns: string;
}

interface ProductShippingProps {
  shippingInfo: ShippingInfo;
  isExpressSelected: boolean;
  onExpressChange: (value: boolean) => void;
}

// Sample shipping options data
const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 0,
    duration: "7-15 business days",
    description: "Free standard shipping with tracking",
    icon: <Package className="w-4 h-4" />,
    features: ["Free shipping", "Tracking included", "Insurance up to $100"],
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 12.99,
    duration: "3-7 business days",
    description: "Faster delivery with priority handling",
    icon: <Truck className="w-4 h-4" />,
    features: ["Priority handling", "Tracking included", "Insurance up to $500"],
    recommended: true,
  },
  {
    id: "priority",
    name: "Priority Express",
    price: 24.99,
    duration: "1-3 business days",
    description: "Fastest shipping option available",
    icon: <Clock className="w-4 h-4" />,
    features: ["Fastest delivery", "Signature confirmation", "Insurance up to $1000"],
  }
];

// Sample delivery locations
const deliveryLocations: DeliveryLocation[] = [
  { country: "United States", city: "New York", estimatedDays: "3-7 days", available: true },
  { country: "Canada", city: "Toronto", estimatedDays: "5-10 days", available: true },
  { country: "United Kingdom", city: "London", estimatedDays: "7-14 days", available: true },
  { country: "Germany", city: "Berlin", estimatedDays: "7-14 days", available: true },
  { country: "Australia", city: "Sydney", estimatedDays: "10-21 days", available: true },
  { country: "Japan", city: "Tokyo", estimatedDays: "7-14 days", available: true },
];

const ProductShipping: React.FC<ProductShippingProps> = ({
  shippingInfo,
  isExpressSelected,
  onExpressChange
}) => {
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("United States");
  const [selectedShipping, setSelectedShipping] = useState(isExpressSelected ? "express" : "standard");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  // Filter locations based on search or show all
  const displayedLocations = useMemo(() => {
    return deliveryLocations.filter(location => location.available);
  }, []);

  const selectedOption = shippingOptions.find(option => option.id === selectedShipping);

  const handleShippingChange = (optionId: string) => {
    setSelectedShipping(optionId);
    const isExpress = optionId === "express" || optionId === "priority";
    onExpressChange(isExpress);
    
    const option = shippingOptions.find(opt => opt.id === optionId);
    if (option) {
      toast({
        title: `${option.name} selected`,
        description: option.price === 0 
          ? "Free shipping selected" 
          : `$${option.price} shipping added to your order`
      });
    }
  };

  const handleViewAllShipping = () => {
    navigate(`/product/${productId}/shipping`);
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Shipping & Delivery</h3>
          <Badge variant="secondary" className="text-xs">
            Free shipping available
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleViewAllShipping}
          className="text-blue-600 hover:text-blue-700"
        >
          View all options
        </Button>
      </div>

      {/* Current Selection Summary */}
      <div className="p-4 bg-blue-50 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {selectedOption?.icon}
            <div>
              <div className="font-medium text-gray-900">
                {selectedOption?.name}
                {selectedOption?.recommended && (
                  <Badge variant="outline" className="ml-2 text-xs border-blue-200 text-blue-700">
                    Recommended
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedOption?.duration} • {selectedOption?.price === 0 ? 'Free' : `$${selectedOption?.price}`}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedOption?.description}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-600">
              {selectedOption?.price === 0 ? 'FREE' : `$${selectedOption?.price}`}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Choose shipping method</h4>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAllOptions(!showAllOptions)}
            className="text-sm text-blue-600"
          >
            {showAllOptions ? "Show less" : "More options"}
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAllOptions ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <RadioGroup value={selectedShipping} onValueChange={handleShippingChange}>
          {(showAllOptions ? shippingOptions : shippingOptions.slice(0, 2)).map((option) => (
            <div 
              key={option.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                selectedShipping === option.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <div className="flex-1">
                  <label htmlFor={option.id} className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <span className="font-medium text-gray-900">{option.name}</span>
                        {option.recommended && (
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            ⭐ Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {option.price === 0 ? 'FREE' : `$${option.price}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    <div className="text-sm text-blue-600 font-medium mt-1">{option.duration}</div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {option.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Delivery Locations */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">Delivery to popular locations</h4>
        </div>
        
        <div className="space-y-2">
          {displayedLocations.slice(0, 3).map((location, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-900">{location.country}</div>
                <div className="text-xs text-gray-500">({location.city})</div>
              </div>
              <div className="text-sm text-blue-600">{location.estimatedDays}</div>
            </div>
          ))}
          
          {displayedLocations.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-blue-600"
              onClick={handleViewAllShipping}
            >
              View delivery to {displayedLocations.length - 3} more countries
            </Button>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Additional Information:</div>
            <ul className="space-y-1">
              <li>• All orders include tracking information</li>
              <li>• Free returns within 30 days</li>
              <li>• Insurance coverage included</li>
              <li>• Customs fees may apply for international orders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShipping;
