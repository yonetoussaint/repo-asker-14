import React from 'react';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  loadingRates: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  loadingRates
}) => {
  return (
    <div className="relative">
      <select 
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loadingRates}
      >
        <option value="HTD">HTD</option>
        <option value="HTG">HTG</option>
        <option value="USD">USD</option>
      </select>
      {loadingRates && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-3 border border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};