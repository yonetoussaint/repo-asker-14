
import React, { useState } from 'react';
import { Shield, Truck, Clock, CreditCard, Star, Gift, ChevronRight } from 'lucide-react';

const EcommerceFeatures = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const features = [
    { icon: <Shield size={16} />, text: "Buyer Protection" },
    { icon: <Truck size={16} />, text: "Free Shipping" },
    { icon: <Clock size={16} />, text: "Fast Delivery" },
    { icon: <CreditCard size={16} />, text: "Secure Payment" },
    { icon: <Star size={16} />, text: "Loyalty Rewards" },
    { icon: <Gift size={16} />, text: "Gift Vouchers" },
  ];

  return (
    <div className="bg-white rounded-lg text-xs">
      <div className="flex overflow-x-auto py-2 px-1 no-scrollbar">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex items-center shrink-0 px-2 py-1 mx-1 bg-orange-50 rounded-full cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded-full mr-1.5">
              {feature.icon}
            </div>
            <span className="whitespace-nowrap">{feature.text}</span>
            <ChevronRight size={12} className={`ml-1 transition-transform ${expandedIndex === index ? 'rotate-90' : ''}`} />
          </div>
        ))}
      </div>
      
      {expandedIndex !== null && (
        <div className="p-2 text-xs bg-orange-50 rounded-md">
          {expandedIndex === 0 && "We protect your purchase with our satisfaction guarantee."}
          {expandedIndex === 1 && "All orders ship free with no minimum purchase required."}
          {expandedIndex === 2 && "Most orders delivered within 24-48 hours."}
          {expandedIndex === 3 && "Your payment information is encrypted and secure."}
          {expandedIndex === 4 && "Earn points with every purchase toward future discounts."}
          {expandedIndex === 5 && "Send the perfect gift with our digital vouchers."}
        </div>
      )}
    </div>
  );
};

// For backwards compatibility, we'll export EcommerceFeatures as the default export
export default EcommerceFeatures;
