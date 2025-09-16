import React from 'react';
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LucideIcon, XCircle } from 'lucide-react';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  fee: string;
  available?: boolean;
  unavailableReason?: string;
  processorUrl?: string;
}

interface PaymentMethodItemProps {
  method: PaymentMethod;
  isSelected: boolean;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({ method, isSelected }) => {
  const Icon = method.icon;
  const isAvailable = method.available !== false;
  
  return (
    <div
      className={`flex items-center space-x-3 border rounded-lg p-3 transition-colors ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:bg-gray-50'
      } ${!isAvailable ? 'opacity-60' : ''}`}
    >
      <RadioGroupItem 
        value={method.id} 
        id={method.id} 
        className="border-gray-400"
        disabled={!isAvailable}
      />
      <div className="flex-1 flex items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center mr-3
          ${method.id === 'paypal' ? 'bg-blue-500' : 
            method.id === 'cashapp' ? 'bg-green-500' : 
            method.id === 'moncash' ? 'bg-red-500' :
            method.id === 'natcash' ? 'bg-purple-500' : 'bg-gray-100'}
        `}>
          <Icon size={18} className={
            ['paypal', 'cashapp', 'moncash', 'natcash'].includes(method.id) 
              ? 'text-white' 
              : ''
          } />
        </div>
        <div className="flex-1">
          <Label htmlFor={method.id} className="font-medium mb-0">{method.name}</Label>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">{method.description}</p>
            <span className="text-xs font-semibold text-gray-500">Fee: {method.fee}</span>
          </div>
          {!isAvailable && method.unavailableReason && (
            <div className="mt-1 flex items-center text-xs text-red-500">
              <XCircle size={12} className="mr-1" />
              {method.unavailableReason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodItem;
