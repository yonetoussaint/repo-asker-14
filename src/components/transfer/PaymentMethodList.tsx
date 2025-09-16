
import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import PaymentMethodItem, { PaymentMethod } from './PaymentMethodItem';

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  selectedMethod: string | null;
  onMethodChange: (value: string) => void;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ 
  methods, 
  selectedMethod,
  onMethodChange
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 className="font-medium mb-3">Select payment method</h2>
      
      <RadioGroup 
        value={selectedMethod || ''} 
        onValueChange={onMethodChange}
        className="space-y-2"
      >
        {methods.map((method) => (
          <PaymentMethodItem 
            key={method.id} 
            method={method} 
            isSelected={selectedMethod === method.id}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodList;
