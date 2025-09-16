
import React from 'react';

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError, onCancel }) => {
  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
