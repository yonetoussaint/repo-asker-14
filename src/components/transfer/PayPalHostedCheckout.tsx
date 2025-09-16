
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface PayPalHostedCheckoutProps {
  amount: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

const PayPalHostedCheckout: React.FC<PayPalHostedCheckoutProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paypalButtonsRef = useRef<HTMLDivElement>(null);
  const cardFormRef = useRef<HTMLFormElement>(null);
  const paypalInitialized = useRef(false);

  const SERVER_URL = 'https://paypal-with-nodejs.onrender.com';
  const PAYPAL_CLIENT_ID = 'AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj';

  const loadPayPalScript = () => {
    if (window.paypal || scriptLoaded) {
      initializePayPal();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&enable-funding=venmo&currency=USD&intent=capture&components=buttons,hosted-fields`;
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      initializePayPal();
    };
    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      setLoading(false);
    };
    document.head.appendChild(script);
  };

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

      return await response.text();
    } catch (error) {
      console.error('Error getting client token:', error);
      throw error;
    }
  };

  const createOrder = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          intent: 'capture',
          amount: parseFloat(amount),
          in_app_checkout: true
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

  const completeOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/complete_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'capture',
          order_id: orderId
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

  const initializePayPal = async () => {
    if (!window.paypal || paypalInitialized.current) return;
    
    try {
      paypalInitialized.current = true;
      setLoading(false);

      // Initialize PayPal Buttons with in-app configuration
      if (paypalButtonsRef.current) {
        const buttons = window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
          },

          createOrder: createOrder,

          onApprove: async (data: any) => {
            try {
              const orderDetails = await completeOrder(data.orderID);
              onSuccess(orderDetails);
              toast({
                title: "Payment Successful!",
                description: `Your payment of $${amount} has been processed successfully.`,
                variant: "default",
              });
            } catch (error) {
              console.error('Error in onApprove:', error);
              onError(error);
            }
          },

          onCancel: () => {
            if (onCancel) onCancel();
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled.",
              variant: "destructive",
            });
          },

          onError: (err: any) => {
            console.error('PayPal error:', err);
            onError(err);
            toast({
              title: "Payment Error",
              description: "An error occurred with PayPal. Please try again.",
              variant: "destructive",
            });
          }
        });

        buttons.render(paypalButtonsRef.current);
      }

      // Initialize Hosted Fields for Credit Cards
      if (window.paypal.HostedFields && window.paypal.HostedFields.isEligible()) {
        try {
          // Get a client token first
          const clientToken = await getClientToken();
          
          const hostedFields = await window.paypal.HostedFields.render({
            createOrder: createOrder,
            styles: {
              '.valid': { color: 'green' },
              '.invalid': { color: 'red' },
              'input': {
                'font-size': '16px',
                'font-family': 'Arial, sans-serif',
                'color': '#333',
                'transition': 'color 160ms linear, background-color 160ms linear',
                'line-height': '1.4',
                'width': '100%',
                'padding': '0.6em 0.7em'
              },
              ':focus': {
                'color': '#000'
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

          // Handle form submission
          if (cardFormRef.current) {
            cardFormRef.current.addEventListener('submit', async (event) => {
              event.preventDefault();
              
              try {
                const state = hostedFields.getState();
                const formValid = Object.keys(state.fields).every(key => {
                  return state.fields[key].isValid;
                });
                
                if (!formValid) {
                  toast({
                    title: "Invalid Card Details",
                    description: "Please check your card information and try again.",
                    variant: "destructive",
                  });
                  return;
                }
                
                const { liabilityShift, liabilityShifted } = await hostedFields.submit({
                  contingencies: ['3D_SECURE']
                });
                
                if (!liabilityShifted && liabilityShift === 'POSSIBLE') {
                  toast({
                    title: "3D Secure Authentication Failed",
                    description: "Your card could not be authenticated.",
                    variant: "destructive",
                  });
                  return;
                }
                
                toast({
                  title: "Payment Processing",
                  description: "Your payment is being processed...",
                  variant: "default",
                });
              } catch (error) {
                console.error('Error processing card payment:', error);
                toast({
                  title: "Payment Failed",
                  description: "There was a problem processing your payment. Please try again.",
                  variant: "destructive",
                });
                onError(error);
              }
            });
          }
        } catch (error) {
          console.error('Error initializing hosted fields:', error);
          setError('Failed to initialize card payment system');
        }
      } else {
        console.log('PayPal Hosted Fields not eligible');
      }
    } catch (error) {
      console.error('Error initializing PayPal:', error);
      setError('Failed to initialize payment system');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayPalScript();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payment options...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Complete Your Payment</h3>
        <p className="text-gray-600 text-lg">${amount} USD</p>
      </div>

      {/* PayPal Buttons */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium mb-4 text-center">Pay with PayPal</h4>
        <div ref={paypalButtonsRef}></div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Credit Card Form */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-medium mb-6 text-center">Pay with Credit Card</h4>
        <form ref={cardFormRef} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Card Number</label>
            <div id="card-number" className="border border-gray-300 rounded-lg bg-white h-[48px] flex items-center overflow-hidden"></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Expiration Date</label>
              <div id="expiration-date" className="border border-gray-300 rounded-lg bg-white h-[48px] flex items-center overflow-hidden"></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Security Code</label>
              <div id="cvv" className="border border-gray-300 rounded-lg bg-white h-[48px] flex items-center overflow-hidden"></div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-medium mt-8">
            Pay ${amount}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PayPalHostedCheckout;
