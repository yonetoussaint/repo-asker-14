
import React, { useEffect, useRef, useState } from 'react';

const PayPalPayment = () => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState('10.00');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Payment for services');

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj&currency=${currency}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [currency]);

  useEffect(() => {
    if (isLoaded && window.paypal && paypalRef.current) {
      // Clear previous buttons
      paypalRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
                currency_code: currency
              },
              description: description
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            alert(`Transaction completed by ${details.payer.name.given_name}! Order ID: ${data.orderID}`);
            console.log('Payment details:', details);
            // Here you would typically send the payment details to your server
          } catch (error) {
            console.error('Error capturing payment:', error);
            alert('Payment failed. Please try again.');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          alert('An error occurred with PayPal. Please try again.');
        },
        onCancel: (data: any) => {
          console.log('Payment cancelled:', data);
          alert('Payment was cancelled.');
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }
      }).render(paypalRef.current);
    }
  }, [isLoaded, amount, currency, description]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Make a Payment</h2>
      
      {/* Payment Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What is this payment for?"
          />
        </div>
      </div>

      {/* PayPal Buttons Container */}
      <div className="mb-4">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading PayPal...</span>
          </div>
        ) : (
          <div ref={paypalRef}></div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Setup Required</h3>
        <p className="text-sm text-yellow-700">
          To use this component, you need to:
        </p>
        <ol className="text-sm text-yellow-700 mt-2 ml-4 list-decimal">
          <li>Create a PayPal Developer account</li>
          <li>Replace "YOUR_CLIENT_ID" with your actual PayPal Client ID</li>
          <li>Set up webhooks to handle payment notifications on your server</li>
        </ol>
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Security Note</h3>
        <p className="text-sm text-blue-700">
          Always verify payments on your server before fulfilling orders. Never rely solely on client-side confirmation.
        </p>
      </div>
    </div>
  );
};

export default PayPalPayment;