
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const NFTPaymentPage: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState(100.00);
  const [showContent, setShowContent] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('');

  // Refs for PayPal elements
  const paypalButtonsRef = useRef<HTMLDivElement>(null);
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const expirationDateRef = useRef<HTMLDivElement>(null);
  const cvvRef = useRef<HTMLDivElement>(null);
  const cardFormRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Configuration
  const CONFIG = {
    SERVER_URL: 'https://paypal-with-nodejs.onrender.com',
    PAYPAL_CLIENT_ID: 'AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj',
    CURRENCY: 'USD',
    INTENT: 'capture'
  };

  // Initialize PayPal
  useEffect(() => {
    let orderId: string;
    let paypalButtons: any;
    let paypalHostedFields: any;

    const loadPayPalScript = async () => {
      try {
        setLoading(true);
        setShowContent(false);

        // Get client token from backend
        const clientToken = await getClientToken();

        // Load PayPal SDK
        await loadScript({
          src: `https://www.paypal.com/sdk/js?client-id=${CONFIG.PAYPAL_CLIENT_ID}&enable-funding=venmo&currency=${CONFIG.CURRENCY}&intent=${CONFIG.INTENT}&components=buttons,hosted-fields`,
          'data-client-token': clientToken
        });

        // Initialize PayPal components
        await initializePayPalComponents();

        setLoading(false);
        setShowContent(true);
      } catch (err) {
        console.error('Error initializing PayPal:', err);
        setLoading(false);
        setError('Failed to initialize payment system. Please refresh the page and try again.');
      }
    };

    const loadScript = (attributes: Record<string, string>): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        for (const [key, value] of Object.entries(attributes)) {
          script.setAttribute(key, value);
        }
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', () => reject(new Error('Script loading failed')));
        document.head.appendChild(script);
      });
    };

    const getClientToken = async (): Promise<string> => {
      const response = await apiCall('/get_client_token', {});
      return response as string;
    };

    const createOrder = async (): Promise<string> => {
      const orderData = await apiCall('/create_order', { 
        intent: CONFIG.INTENT,
        amount: currentAmount.toString()
      });
      return orderData.id;
    };

    const completeOrder = async (orderIdToComplete: string, email: string | null = null) => {
      return await apiCall('/complete_order', {
        intent: CONFIG.INTENT,
        order_id: orderIdToComplete,
        email: email
      });
    };

    const apiCall = async (endpoint: string, data = {}) => {
      try {
        const response = await fetch(`${CONFIG.SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Network error' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType?.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
      }
    };

    const initializePayPalComponents = async () => {
      if (!window.paypal) {
        console.error('PayPal SDK not loaded');
        return;
      }

      // Initialize PayPal Buttons
      if (paypalButtonsRef.current) {
        paypalButtons = window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
          },

          createOrder: createOrder,

          onApprove: async (data: any) => {
            try {
              orderId = data.orderID;
              const email = emailInputRef.current?.value || '';
              const orderDetails = await completeOrder(orderId, email);
              handlePaymentSuccess(orderDetails);
            } catch (error) {
              console.error('Error in onApprove:', error);
              showErrorMessage('Payment processing failed. Please try again.');
            }
          },

          onCancel: () => {
            showErrorMessage('Payment was cancelled.');
          },

          onError: (err: any) => {
            console.error('PayPal error:', err);
            showErrorMessage('An error occurred with PayPal. Please try again.');
          }
        });

        if (paypalButtons.isEligible()) {
          paypalButtons.render(paypalButtonsRef.current);
        }
      }

      // Initialize Hosted Fields for Credit Cards
      if (window.paypal.HostedFields && window.paypal.HostedFields.isEligible()) {
        if (cardNumberRef.current && expirationDateRef.current && cvvRef.current) {
          try {
            paypalHostedFields = await window.paypal.HostedFields.render({
              createOrder: async () => {
                orderId = await createOrder();
                return orderId;
              },

              styles: {
                '.valid': { 
                  color: 'green' 
                },
                '.invalid': { 
                  color: 'red' 
                },
                'input': {
                  'font-size': '16px',
                  'font-family': 'Arial, sans-serif',
                  'color': '#333333',
                  'font-weight': 'normal',
                  'transition': 'color 160ms linear',
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

            console.log('PayPal Hosted Fields initialized successfully');

            // Handle credit card form submission
            if (cardFormRef.current) {
              cardFormRef.current.addEventListener('submit', async (event) => {
                event.preventDefault();

                const submitBtn = document.getElementById('card-submit');
                if (submitBtn) {
                  submitBtn.setAttribute('disabled', '');
                  (submitBtn as HTMLInputElement).value = 'Processing...';
                }

                try {
                  if (!paypalHostedFields) {
                    throw new Error('Payment system not initialized');
                  }

                  // Submit the card data to PayPal
                  await paypalHostedFields.submit({
                    cardholderName: 'Card Holder',
                    billingAddress: {
                      streetAddress: '123 Main St',
                      extendedAddress: '',
                      region: 'CA',
                      locality: 'San Jose',
                      postalCode: '95131',
                      countryCodeAlpha2: 'US'
                    }
                  });

                  // Complete the order
                  const email = emailInputRef.current?.value || '';
                  const orderDetails = await completeOrder(orderId, email);
                  handlePaymentSuccess(orderDetails);

                } catch (error) {
                  console.error('Error processing card payment:', error);
                  showErrorMessage('Card payment failed. Please check your details and try again.');
                  resetSubmitButton();
                }
              });
            }
          } catch (hostedFieldsError) {
            console.error('Error initializing PayPal Hosted Fields:', hostedFieldsError);
            if (cardFormRef.current) {
              cardFormRef.current.innerHTML = '<p>Credit card payments are not available at this time.</p>';
            }
          }
        }
      } else {
        console.log('Hosted Fields not eligible');
        if (cardFormRef.current) {
          cardFormRef.current.innerHTML = '<p>Credit card payments are not available at this time.</p>';
        }
      }
    };

    const handlePaymentSuccess = (orderDetails: any) => {
      const intentObject = CONFIG.INTENT === 'authorize' ? 'authorizations' : 'captures';
      const payment = orderDetails.purchase_units[0].payments[intentObject][0];
      const payer = orderDetails.payer;
      
      setPayerName(`${payer?.name?.given_name || ''} ${payer?.name?.surname || ''}`);
      setPaymentAmount(payment.amount.value);
      setPaymentCurrency(payment.amount.currency_code);
      setPaymentSuccess(true);
      
      toast({
        title: "Payment Successful!",
        description: `Thank you for your purchase of $${payment.amount.value} ${payment.amount.currency_code}!`,
        variant: "default",
      });
    };

    const showErrorMessage = (message: string) => {
      toast({
        title: "Payment Error",
        description: message,
        variant: "destructive",
      });
    };

    const resetSubmitButton = () => {
      const submitBtn = document.getElementById('card-submit');
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        (submitBtn as HTMLInputElement).value = 'Purchase';
      }
    };

    loadPayPalScript();

    // Clean up
    return () => {
      if (paypalButtons) {
        try {
          paypalButtons.close();
        } catch (err) {
          console.error("Error closing PayPal buttons:", err);
        }
      }
      
      if (paypalHostedFields) {
        try {
          paypalHostedFields.close();
        } catch (err) {
          console.error("Error closing PayPal hosted fields:", err);
        }
      }
    };
  }, []);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    setCurrentAmount(isNaN(newAmount) ? 0 : newAmount);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-6">AI-Generated NFT Payment</h2>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <span className="ml-2">Loading payment options...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 w-full">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}
        
        {showContent && !paymentSuccess && (
          <div className="w-full">
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src="https://cdn.discordapp.com/attachments/1060825015681028127/1076385063903694908/rauljr7_3d_e83fed6a-69aa-4a6a-b0ec-928edd57aecf.png" 
                alt="AI-Generated NFT"
                className="w-full h-auto" 
              />
            </div>
            
            {/* Amount Input Section */}
            <div className="bg-gray-800/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium text-center mb-4">Enter Payment Amount</h3>
              <div className="mb-4">
                <label htmlFor="amount" className="block mb-2">Amount (USD)</label>
                <input 
                  type="number" 
                  id="amount" 
                  className="w-full h-11 px-4 py-2 bg-background border border-input rounded-md"
                  placeholder="100.00" 
                  min="1" 
                  step="0.01" 
                  value={currentAmount} 
                  onChange={handleAmountChange}
                  required 
                />
              </div>
              <div className="text-2xl font-bold text-center">${currentAmount.toFixed(2)} USD</div>
            </div>
            
            {/* Payment Methods Section */}
            <div className="bg-gray-800/20 rounded-lg p-6">
              <h3 className="text-xl font-medium text-center mb-4">Choose Payment Method</h3>
              
              {/* PayPal Buttons */}
              <div ref={paypalButtonsRef} className="mb-6"></div>
              
              <div className="flex items-center justify-center my-6">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="px-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
              
              {/* Credit Card Form */}
              <form ref={cardFormRef} className="space-y-4">
                <h4 className="text-lg font-medium">Pay with Credit Card</h4>
                
                <div className="mb-4">
                  <label htmlFor="card-number" className="block mb-2">Card Number</label>
                  <div id="card-number" ref={cardNumberRef} className="border border-input bg-background h-11 rounded-md px-3"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiration-date" className="block mb-2">Expiration Date</label>
                    <div id="expiration-date" ref={expirationDateRef} className="border border-input bg-background h-11 rounded-md px-3"></div>
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block mb-2">Security Code</label>
                    <div id="cvv" ref={cvvRef} className="border border-input bg-background h-11 rounded-md px-3"></div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <input 
                    ref={emailInputRef}
                    placeholder="username@email.com" 
                    type="email" 
                    id="email" 
                    className="w-full h-11 px-4 py-2 bg-background border border-input rounded-md"
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  id="card-submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors mt-4"
                >
                  Purchase
                </button>
              </form>
            </div>
          </div>
        )}
        
        {paymentSuccess && (
          <div className="w-full bg-green-800/20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-medium mb-4">Payment Successful!</h3>
            <p className="mb-2">Thank you {payerName} for your purchase!</p>
            <p className="text-2xl font-bold mb-6">${paymentAmount} {paymentCurrency}</p>
            <button 
              onClick={() => {
                setPaymentSuccess(false);
                setShowContent(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Make Another Payment
            </button>
          </div>
        )}
      </div>
      
      <footer className="text-center text-gray-400 mt-16">
        Secure Payment Processing
      </footer>
    </div>
  );
};

export default NFTPaymentPage;