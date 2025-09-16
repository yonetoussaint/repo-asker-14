import React, { useState } from 'react';
import { Shield, ChevronDown, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

const PaymentOptions = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Haiti local payment options data
  const paymentOptions = [
    {
      id: 'moncash',
      title: 'MonCash',
      description: 'Mobile money by Digicel Haiti',
      fees: 'Free',
      processingTime: 'Instant',
      icon: <Smartphone className="w-5 h-5 text-red-600" />,
      popular: true,
      secure: true
    },
    {
      id: 'natcash',
      title: 'NatCash',
      description: 'Mobile wallet by Natcom',
      fees: '5 HTG',
      processingTime: 'Instant',
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
      popular: true,
      secure: true
    },
    {
      id: 'sogebank',
      title: 'Sogebank',
      description: 'Online banking transfer',
      fees: '10 HTG',
      processingTime: '2-4 hours',
      icon: <Building2 className="w-5 h-5 text-green-600" />,
      popular: false,
      secure: true
    },
    {
      id: 'capital',
      title: 'Capital Bank',
      description: 'Bank transfer via Capital Bank',
      fees: '15 HTG',
      processingTime: '1-2 hours',
      icon: <Building2 className="w-5 h-5 text-blue-800" />,
      popular: false,
      secure: true
    },
    {
      id: 'unibank',
      title: 'Unibank',
      description: 'Transfer through Unibank Haiti',
      fees: '12 HTG',
      processingTime: '2-6 hours',
      icon: <Building2 className="w-5 h-5 text-orange-600" />,
      popular: false,
      secure: true
    },
    {
      id: 'cash',
      title: 'Cash Payment',
      description: 'Pay with cash at pickup location',
      fees: 'Free',
      processingTime: 'On delivery',
      icon: <Wallet className="w-5 h-5 text-green-500" />,
      popular: false,
      secure: true
    }
  ];

  const visibleOptions = showAll ? paymentOptions : paymentOptions.slice(0, 3);
  const selectedPayment = paymentOptions.find(option => option.id === selectedOption);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <h3 className="text-lg font-semibold text-gray-900">Payment Options</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Shield className="mr-1" size={12} />
          <span>Secure checkout</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* All Payment Options */}
        <div className="space-y-2">
          {visibleOptions.map((option) => {
            return (
              <div
                key={option.id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {option.icon}
                      {option.popular && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{option.title}</span>
                        {option.popular && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                            Popular
                          </span>
                        )}
                        {option.secure && (
                          <Shield className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{option.fees}</div>
                    <div className="text-sm text-gray-600">{option.processingTime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More/Less Button */}
        <button 
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors py-3 rounded-lg w-full text-gray-700 font-medium"
        >
          <span>{showAll ? 'Show less options' : 'View more options'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
};

export default PaymentOptions;