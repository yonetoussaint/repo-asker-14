import React, { useState } from 'react';
import { ShoppingCart, MapPin, Wallet, CreditCard, Check, X } from 'lucide-react';

const CheckoutFlow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('delivery');
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  
  // Mock data
  const walletBalance = 2850.75;
  const orderTotal = 125.50;
  const orderItems = [
    { name: 'Premium T-Shirt', price: 45.00, qty: 2 },
    { name: 'Cotton Hoodie', price: 35.50, qty: 1 }
  ];
  
  const pickupStations = [
    { id: 'station-1', name: 'Downtown Hub', address: '123 Main St', time: '2h' },
    { id: 'station-2', name: 'Mall Center', address: '456 Shopping Ave', time: '3h' },
    { id: 'station-3', name: 'University Campus', address: '789 College Rd', time: '1h' },
    { id: 'station-4', name: 'Airport Terminal', address: '321 Airport Blvd', time: '4h' }
  ];

  const handleNext = () => {
    if (currentStep === 'delivery' && selectedStation) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && selectedPayment) {
      setCurrentStep('success');
      setTimeout(() => setCurrentStep('receipt'), 1500);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep('delivery');
    setSelectedStation('');
    setSelectedPayment('');
  };

  const DeliveryStep = () => (
    <>
      <div className="p-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium mb-1">Where should we deliver?</h2>
          <p className="text-sm text-gray-500">Pick your closest station</p>
        </div>
        
        <div className="space-y-2">
          {pickupStations.map((station) => (
            <label key={station.id} className="block cursor-pointer">
              <input
                type="radio"
                name="station"
                value={station.id}
                checked={selectedStation === station.id}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="sr-only"
              />
              <div className={`p-3 border rounded-lg transition-colors ${
                selectedStation === station.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-sm">{station.name}</span>
                      <span className="ml-auto text-xs text-green-600 font-medium">{station.time}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-6">{station.address}</div>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <button
          onClick={handleNext}
          disabled={!selectedStation}
          className={`w-full py-3 text-sm font-medium rounded-lg ${
            selectedStation
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          Continue
        </button>
      </div>
    </>
  );

  const PaymentStep = () => (
    <>
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Items ({orderItems.reduce((sum, item) => sum + item.qty, 0)})</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-medium mb-1">How will you pay?</h2>
        </div>
        
        <div className="space-y-2">
          <label className="block cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="wallet"
              checked={selectedPayment === 'wallet'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="sr-only"
              disabled={walletBalance < orderTotal}
            />
            <div className={`p-3 border rounded-lg ${
              selectedPayment === 'wallet'
                ? 'border-blue-500 bg-blue-50'
                : walletBalance < orderTotal
                ? 'border-gray-200 bg-gray-50 opacity-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium">Wallet</div>
                    <div className="text-xs text-gray-500">${walletBalance.toFixed(2)} available</div>
                  </div>
                </div>
                {walletBalance < orderTotal && (
                  <span className="text-xs text-red-500">Insufficient</span>
                )}
              </div>
            </div>
          </label>
          
          <label className="block cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="moncash"
              checked={selectedPayment === 'moncash'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="sr-only"
            />
            <div className={`p-3 border rounded-lg ${
              selectedPayment === 'moncash'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <div className="text-sm font-medium">MonCash</div>
                  <div className="text-xs text-gray-500">Pay with mobile money</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <button
          onClick={handleNext}
          disabled={!selectedPayment || (selectedPayment === 'wallet' && walletBalance < orderTotal)}
          className={`w-full py-3 text-sm font-medium rounded-lg ${
            selectedPayment && (selectedPayment !== 'wallet' || walletBalance >= orderTotal)
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          Pay ${orderTotal.toFixed(2)}
        </button>
      </div>
    </>
  );

  const SuccessStep = () => (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-lg font-medium mb-2">Payment Complete</h2>
        <p className="text-sm text-gray-500">Preparing your receipt...</p>
      </div>
    </div>
  );

  const ReceiptStep = () => {
    const selectedStationData = pickupStations.find(s => s.id === selectedStation);
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    return (
      <>
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="text-lg font-medium">Receipt</div>
            <div className="text-xs text-gray-500">#{orderNumber}</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">ITEMS</div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.qty}× {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-1 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">PICKUP</div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium">{selectedStationData?.name}</div>
                <div className="text-xs text-gray-500">{selectedStationData?.address}</div>
                <div className="text-xs text-green-600 mt-1">Ready in {selectedStationData?.time}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">PAYMENT</div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm">
                  {selectedPayment === 'wallet' ? 'Wallet' : 'MonCash'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleClose}
            className="w-full py-3 text-sm font-medium bg-black text-white rounded-lg"
          >
            Done
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-6 py-3 rounded-lg font-medium flex items-center text-sm"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Checkout
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] flex flex-col">
            <div className="border-b">
              {/* Progress Bar */}
              <div className="h-1 bg-gray-200">
                <div 
                  className="h-full bg-black transition-all duration-300 ease-out"
                  style={{ 
                    width: currentStep === 'delivery' ? '0%' : 
                           currentStep === 'payment' ? '50%' : 
                           currentStep === 'success' ? '75%' : '100%' 
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div className="text-sm font-medium">
                  Step {currentStep === 'delivery' ? '1' : currentStep === 'payment' ? '2' : '3'} of 2
                </div>
                <button onClick={handleClose} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {currentStep === 'delivery' && <DeliveryStep />}
              {currentStep === 'payment' && <PaymentStep />}
              {currentStep === 'success' && <SuccessStep />}
              {currentStep === 'receipt' && <ReceiptStep />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;