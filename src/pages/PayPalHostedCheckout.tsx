
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, CreditCard } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const PayPalHostedCheckout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const expirationDateRef = useRef<HTMLDivElement>(null);
  const cvvRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hostedFieldsInstance = useRef<any>(null);

  const SERVER_URL = 'https://paypal-with-nodejs.onrender.com';
  const PAYPAL_CLIENT_ID = 'AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj';

  // Load PayPal SDK
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal || scriptLoaded) {
        initializeHostedFields();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-fields&currency=USD`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        initializeHostedFields();
      };
      script.onerror = () => {
        setError('Failed to load PayPal SDK');
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  // Get client token
  const getClientToken = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_client_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const token = await response.text();
      setClientToken(token);
      return token;
    } catch (error) {
      console.error('Error getting client token:', error);
      throw error;
    }
  };

  // Create order
  const createOrder = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          intent: 'capture'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Complete order
  const completeOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/complete_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'capture',
          order_id: orderId,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  };

  // Initialize PayPal Hosted Fields
  const initializeHostedFields = async () => {
    if (!window.paypal || !window.paypal.HostedFields) {
      setError('PayPal SDK not loaded properly');
      setLoading(false);
      return;
    }

    try {
      // Get client token
      const token = await getClientToken();
      
      if (!window.paypal.HostedFields.isEligible()) {
        setError('PayPal Hosted Fields not eligible');
        setLoading(false);
        return;
      }

      const hostedFields = await window.paypal.HostedFields.render({
        createOrder: createOrder,
        styles: {
          '.valid': { color: 'green' },
          '.invalid': { color: 'red' },
          'input': {
            'font-size': '16px',
            'font-family': 'Arial, sans-serif',
            'color': '#333',
            'padding': '12px',
            'border': '1px solid #ccc',
            'border-radius': '4px',
            'width': '100%',
            'box-sizing': 'border-box'
          },
          ':focus': {
            'border-color': '#007cba',
            'outline': 'none'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111',
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123',
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YY',
          }
        }
      });

      hostedFieldsInstance.current = hostedFields;
      setLoading(false);

    } catch (error) {
      console.error('Error initializing hosted fields:', error);
      setError('Failed to initialize payment system');
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!hostedFieldsInstance.current || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const state = hostedFieldsInstance.current.getState();
      
      // Validate all fields
      const formValid = Object.keys(state.fields).every(key => {
        return state.fields[key].isValid;
      });
      
      if (!formValid) {
        toast({
          title: "Invalid Card Details",
          description: "Please check your card information and try again.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      // Submit the payment
      const { orderId } = await hostedFieldsInstance.current.submit({
        contingencies: ['3D_SECURE']
      });

      // Complete the order
      const orderDetails = await completeOrder(orderId);
      
      if (orderDetails.status === 'COMPLETED') {
        toast({
          title: "Payment Successful!",
          description: `Your payment has been processed. Order ID: ${orderId}`,
          variant: "default",
        });
        
        // Reset form
        setEmail('');
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        throw new Error('Payment not completed');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading payment system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment System Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <CreditCard className="h-6 w-6" />
              Secure Checkout
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your payment details below. Your information is encrypted and secure.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">ai-generated NFT Bored Ape</span>
                <span className="font-bold text-blue-900">$100.00 USD</span>
              </div>
            </div>

            {/* Payment Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>

              {/* Card Fields */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Information</h4>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Card Number *
                  </Label>
                  <div 
                    ref={cardNumberRef}
                    id="card-number" 
                    className="mt-1 min-h-[48px] border border-gray-300 rounded-md bg-white"
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Expiration Date *
                    </Label>
                    <div 
                      ref={expirationDateRef}
                      id="expiration-date" 
                      className="mt-1 min-h-[48px] border border-gray-300 rounded-md bg-white"
                    ></div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Security Code *
                    </Label>
                    <div 
                      ref={cvvRef}
                      id="cvv" 
                      className="mt-1 min-h-[48px] border border-gray-300 rounded-md bg-white"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing}
                className="w-full h-12 text-lg font-medium"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  'Complete Payment - $100.00'
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-green-600 mr-3 mt-0.5">🔒</div>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Your payment is secure</p>
                  <p>We use PayPal's secure payment processing. Your card information is encrypted and never stored on our servers.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayPalHostedCheckout;