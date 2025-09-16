import React, { createContext, useContext, useState, useCallback } from 'react';

export type Currency = 'HTG' | 'HTD' | 'USD';

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (price: number, bundlePrice?: number) => string;
  convertPrice: (price: number, bundlePrice?: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencies = {
  HTG: 'HTG',
  HTD: 'HTD', 
  USD: 'USD'
};

const currencyToCountry = {
  HTG: 'ht',
  HTD: 'ht',
  USD: 'us'
};

const formatNumber = (num: number) => {
  return parseFloat(num.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('HTG');

  const setCurrency = useCallback((currency: Currency) => {
    setCurrentCurrency(currency);
  }, []);

  const toggleCurrency = useCallback(() => {
    const currencyOrder: Currency[] = ['HTG', 'HTD', 'USD'];
    const currentIndex = currencyOrder.indexOf(currentCurrency);
    const nextIndex = (currentIndex + 1) % currencyOrder.length;
    setCurrentCurrency(currencyOrder[nextIndex]);
  }, [currentCurrency]);

  const convertPrice = useCallback((price: number, bundlePrice?: number) => {
    const basePrice = bundlePrice || parseFloat(price.toString()) || 0;

    switch (currentCurrency) {
      case 'HTG':
        return bundlePrice ? basePrice : basePrice * 132;
      case 'HTD':
        const htgPrice = bundlePrice ? basePrice : basePrice * 132;
        return htgPrice / 5;
      case 'USD':
        return bundlePrice ? basePrice / 132 : basePrice;
      default:
        return basePrice;
    }
  }, [currentCurrency]);

  const formatPrice = useCallback((price: number, bundlePrice?: number) => {
    const convertedPrice = convertPrice(price, bundlePrice);
    return formatNumber(convertedPrice);
  }, [convertPrice]);

  const contextValue: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    toggleCurrency,
    formatPrice,
    convertPrice
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export { currencies, currencyToCountry };