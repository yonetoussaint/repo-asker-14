
import React from 'react';
import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompactCardSelectionProps {
  selectedMethod?: string | null;
  onMethodChange: (methodId: string) => void;
}

// PayPal Logo Component using URL
const PayPalLogo = () => (
  <img 
    src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
    alt="PayPal"
    className="w-6 h-6 object-contain"
  />
);

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    bgColor: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
    textColor: 'text-white',
    processingTime: 'Instant',
    hasSubOptions: true,
    popular: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Secure payment with PayPal account',
    icon: PayPalLogo,
    bgColor: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
    textColor: 'text-white',
    processingTime: 'Instant',
    hasSubOptions: false,
    popular: false
  }
];

const cardLogos = [
  { 
    name: 'Visa', 
    url: 'https://brand.visa.com/content/dam/VCOM/Brand/Brand%20Gateway/visa-blue-logo-800x450.png'
  },
  { 
    name: 'Mastercard', 
    url: 'https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_circles_92px_2x.png'
  },
  { 
    name: 'Amex', 
    url: 'https://www.americanexpress.com/content/dam/amex/us/merchant/supplies-tech/american-express-logo-blue-1x1.png'
  }
];

const CompactCardSelection: React.FC<CompactCardSelectionProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <motion.button
          key={method.id}
          onClick={() => onMethodChange(method.id)}
          className={`
            w-full relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden
            ${selectedMethod === method.id 
              ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-100' 
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
            }
          `}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Popular Badge */}
          {method.popular && (
            <div className="absolute top-3 right-3">
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                Popular
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Icon Container */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg
                ${method.bgColor} ${method.textColor} transition-transform duration-300 group-hover:scale-105
              `}>
                {React.createElement(method.icon, { className: "h-6 w-6" })}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-gray-900 truncate pr-2">
                    {method.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                      ⚡ {method.processingTime}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {method.description}
                </p>

                {/* Card Logos */}
                {method.hasSubOptions && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 mr-1">Accepts:</span>
                    {cardLogos.slice(0, 3).map((card, index) => (
                      <div key={index} className="bg-white rounded-md p-1.5 shadow-sm border border-gray-200 w-8 h-5 flex items-center justify-center">
                        <img 
                          src={card.url} 
                          alt={card.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                    <span className="text-xs text-gray-500 font-medium">+more</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            <div className="flex items-center ml-3">
              {selectedMethod === method.id ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-sm font-bold">✓</span>
                </motion.div>
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-gray-400 transition-colors">
                  <div className="w-2 h-2 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
                </div>
              )}
            </div>
          </div>

          {/* Hover Effect Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        </motion.button>
      ))}
    </div>
  );
};

export default CompactCardSelection;
