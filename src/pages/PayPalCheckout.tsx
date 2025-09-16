import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PayPalCheckout: React.FC = () => {
  const [amount, setAmount] = useState("10.00");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("Payment for services");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const paypalOptions = {
    clientId: "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4",
    currency: currency,
    intent: "capture" as const,
    components: "buttons",
    "enable-funding": "venmo,paylater",
    "disable-funding": "",
    "buyer-country": "US",
  };

  const createOrder = (data: any, actions: any) => {
    console.log('Creating PayPal order with amount:', amount, 'currency:', currency);
    
    // Validate amount before creating order
    const orderAmount = parseFloat(amount);
    if (isNaN(orderAmount) || orderAmount <= 0) {
      toast.error('Please enter a valid amount');
      throw new Error('Invalid amount');
    }

    if (orderAmount < 0.01) {
      toast.error('Minimum amount is 0.01');
      throw new Error('Amount too small');
    }

    try {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: orderAmount.toFixed(2),
            },
            description: description || "Payment for services",
          },
        ],
        application_context: {
          brand_name: "Your Store Name",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancel`,
        },
      });
    } catch (error) {
      console.error('Error in createOrder:', error);
      toast.error('Failed to create payment order. Please try again.');
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      console.log('PayPal payment approved, capturing order:', data.orderID);
      
      if (!actions.order) {
        throw new Error('PayPal actions.order is not available');
      }

      const details = await actions.order.capture();
      console.log('Payment captured successfully:', details);
      
      // Check if payment was actually completed
      if (details.status === 'COMPLETED') {
        toast.success(`Payment successful! Transaction ID: ${details.id}`);
        
        // Here you can add logic to handle the successful payment
        // For example, redirect to a success page or update your database
        console.log('Payment completed successfully:', details);
        
      } else {
        console.warn('Payment status not completed:', details.status);
        toast.warning(`Payment status: ${details.status}. Please check your PayPal account.`);
      }
      
    } catch (error) {
      console.error('Error capturing payment:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('INSTRUMENT_DECLINED')) {
          toast.error('Your payment method was declined. Please try a different payment method.');
        } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
          toast.error('Insufficient funds. Please check your account balance.');
        } else if (error.message.includes('PAYEE_ACCOUNT_RESTRICTED')) {
          toast.error('Payment processing is temporarily unavailable. Please try again later.');
        } else {
          toast.error('Payment processing failed. Please try again or contact support.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal payment error:', err);
    setIsProcessing(false);
    
    // More detailed error handling
    if (err.message) {
      if (err.message.includes('popup')) {
        toast.error('Please allow popups for PayPal payments and try again.');
      } else if (err.message.includes('script')) {
        toast.error('PayPal could not load properly. Please refresh the page and try again.');
        setScriptError(true);
      } else {
        toast.error(`Payment error: ${err.message}`);
      }
    } else {
      toast.error('An error occurred during payment processing. Please try again.');
    }
  };

  const onCancel = (data: any) => {
    console.log('Payment cancelled by user:', data);
    toast.info('Payment was cancelled.');
    setIsProcessing(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only valid decimal numbers
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const onScriptLoad = () => {
    console.log('PayPal script loaded successfully');
    setScriptLoaded(true);
    setScriptError(false);
  };

  const onScriptError = (err: any) => {
    console.error('PayPal script failed to load:', err);
    setScriptError(true);
    toast.error('PayPal failed to load. Please refresh the page and try again.');
  };

  if (scriptError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">PayPal Unavailable</h3>
              <p className="text-gray-600 mb-4">PayPal could not load properly. This might be due to network issues or browser settings.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              PayPal Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Configuration */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="mt-1"
                  placeholder="Enter amount"
                />
                {amount && parseFloat(amount) < 0.01 && (
                  <p className="text-red-500 text-xs mt-1">Minimum amount is 0.01</p>
                )}
              </div>

              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  placeholder="What is this payment for?"
                />
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-medium">{currency} {amount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Description:</span>
                <span className="font-medium text-right max-w-[150px] truncate">{description}</span>
              </div>
            </div>

            {/* PayPal Buttons */}
            <div className="space-y-4">
              {isProcessing && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                    Processing payment...
                  </div>
                </div>
              )}
              
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal",
                    height: 45,
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  onCancel={onCancel}
                  disabled={isProcessing || !amount || parseFloat(amount) < 0.01}
                />
              </PayPalScriptProvider>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="text-green-600 mr-2">🔒</div>
                <div className="text-sm text-green-700">
                  <p className="font-medium">Secure Payment</p>
                  <p>Your payment is processed securely through PayPal. We don't store your payment information.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayPalCheckout;