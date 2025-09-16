
import React, { useState, useEffect } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import TransferHeader from '@/components/transfer/TransferHeader';
import TransferTypeSelector from '@/components/transfer/TransferTypeSelector';
import AmountInput from '@/components/transfer/AmountInput';
import PaymentMethodList from '@/components/transfer/PaymentMethodList';
import TransferConfirmationDrawer from '@/components/transfer/TransferConfirmationDrawer';
import { internationalPaymentMethods, nationalPaymentMethods } from '@/components/transfer/PaymentMethods';
import { toast } from "@/hooks/use-toast";

// API URL as a constant
const PAYMENT_API_URL = 'https://wkfzhcszhgewkvwukzes.supabase.co/functions/v1/paypal-payment';

const TransferPage: React.FC = () => {
  const [transferType, setTransferType] = useState<'international' | 'national'>('international');
  const [selectedMethod, setSelectedMethod] = useState<string | null>('credit-card'); // Default to credit card
  const [amount, setAmount] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-select credit card option when international is chosen
  useEffect(() => {
    if (transferType === 'international') {
      // Pre-select credit card option for easier testing
      setSelectedMethod('credit-card');
    } else {
      // Pre-select MonCash for national transfers
      setSelectedMethod('moncash');
    }
  }, [transferType]);
  
  // Get the current payment methods based on selected transfer type
  const currentPaymentMethods = transferType === 'international' 
    ? internationalPaymentMethods 
    : nationalPaymentMethods;
  
  // Currency symbol based on transfer type
  const currencySymbol = transferType === 'international' ? '$' : 'HTG ';
  
  // Currency name for display
  const currencyName = transferType === 'international' ? 'USD' : 'Haitian Gourdes';
  // Currency code for PayPal
  const currencyCode = transferType === 'international' ? 'USD' : 'HTG';

  // Reset selected method when changing transfer type
  const handleTransferTypeChange = (value: 'international' | 'national') => {
    setTransferType(value);
    setSelectedMethod(value === 'international' ? 'credit-card' : 'moncash'); // Auto-select appropriate default
  };
  
  // Find the selected payment method object
  const selectedPaymentMethod = currentPaymentMethods.find(m => m.id === selectedMethod);
  
  // Check if the selected method is available
  const isSelectedMethodAvailable = selectedPaymentMethod?.available !== false;
  
  // Handle the continue button click to create a payment
  const handleContinuePayment = async () => {
    // Validate inputs
    if (!amount || parseFloat(amount) <= 0 || !selectedMethod) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount and select a payment method.",
        variant: "destructive",
      });
      return;
    }
    
    // Special handling for national transfers with MonCash
    // The actual MonCash API call is handled in the TransferConfirmationDrawer component
    if (transferType === 'national' && selectedMethod === 'moncash') {
      console.log("MonCash payment selected - will be handled by drawer component");
      return; // Let the drawer component handle it
    }
    
    // Special handling for international transfers with credit card
    // The actual PayPal API call is now handled in the TransferConfirmationDrawer component
    if (transferType === 'international' && selectedMethod === 'credit-card') {
      console.log("Credit card payment selected - will be handled by drawer component");
      return; // Let the drawer component handle it
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Creating payment for ${currencySymbol}${amount} using ${selectedMethod}`);
      
      // Handle other payment methods
      const response = await fetch(PAYMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: currencyCode,
          paymentMethod: selectedMethod
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }
      
      console.log("Payment created successfully:", data);
      
      toast({
        title: "Payment Initiated",
        description: "Your payment has been initiated successfully.",
        variant: "default",
      });
      
      setIsDrawerOpen(false);
      
      // If we have next steps to follow
      if (data.nextSteps?.redirectUrl) {
        window.location.href = data.nextSteps.redirectUrl;
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <TransferHeader />
      
      {/* Main Content Panel - Centered and Minimal */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Transfer Type Tabs */}
          <TransferTypeSelector 
            transferType={transferType} 
            onTransferTypeChange={handleTransferTypeChange}
          />
          
          {/* Credit Card Recommendation */}
          {transferType === 'international' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Credit/Debit Card Recommended
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    For international transfers, credit cards offer the fastest and most secure way to send money to Haiti.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* MonCash Recommendation for national transfers */}
          {transferType === 'national' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    MonCash Recommended
                  </h3>
                  <p className="text-xs text-red-600 mt-1">
                    For national transfers within Haiti, MonCash is currently the only available payment method.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Amount Input */}
          <AmountInput
            amount={amount}
            onAmountChange={setAmount}
            currencySymbol={currencySymbol}
            currencyName={currencyName}
          />
          
          {/* Payment Method Selection */}
          <PaymentMethodList
            methods={currentPaymentMethods}
            selectedMethod={selectedMethod}
            onMethodChange={(value) => {
              setSelectedMethod(value);
            }}
          />
          
          {/* Continue Button */}
          <Button 
            onClick={() => setIsDrawerOpen(true)}
            disabled={!selectedMethod || !amount || parseFloat(amount) <= 0 || !isSelectedMethodAvailable}
            className="w-full"
            size="lg"
          >
            Continue to Send Money
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {/* Information */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {transferType === 'national' ? 
                "MonCash is currently the only available payment method for national transfers." :
                "All transfers are secure and encrypted. Recipient typically receives funds within 24-48 hours depending on the payment method and local conditions."
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Drawer for confirmation */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <TransferConfirmationDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          amount={amount}
          selectedMethod={selectedPaymentMethod}
          transferType={transferType}
          currencySymbol={currencySymbol}
          onContinue={handleContinuePayment}
          isLoading={isLoading}
        />
      </Drawer>
    </div>
  );
};

export default TransferPage;
