import { useState, useEffect } from 'react';

export const useCurrencyConversion = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('HTD');
  const [exchangeRates, setExchangeRates] = useState({
    HTD: 1,
    HTG: 5,
    USD: 1
  });
  const [usdToHtgRate, setUsdToHtgRate] = useState<number | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  // Fetch USD to HTG rate from a reliable exchange rate API
  const fetchUsdToHtgRate = async () => {
    try {
      setLoadingRates(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates && data.rates.HTG) {
        const rate = parseFloat(data.rates.HTG);
        setUsdToHtgRate(rate);
        setExchangeRates(prev => ({
          ...prev,
          USD: prev.HTG / rate
        }));
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      setUsdToHtgRate(130.82);
      setExchangeRates(prev => ({
        ...prev,
        USD: prev.HTG / 130.82
      }));
    } finally {
      setLoadingRates(false);
    }
  };

  // Currency conversion utility
  const convertPrice = (price: number, fromCurrency = 'HTD', toCurrency = selectedCurrency) => {
    if (fromCurrency === toCurrency) return price;
    
    if (fromCurrency === 'HTG' && toCurrency === 'USD') {
      return usdToHtgRate ? price / usdToHtgRate : price / 113.5;
    }
    if (fromCurrency === 'USD' && toCurrency === 'HTG') {
      return usdToHtgRate ? price * usdToHtgRate : price * 113.5;
    }
    
    let priceInHTD = price;
    if (fromCurrency === 'HTG') {
      priceInHTD = price / exchangeRates.HTG;
    } else if (fromCurrency === 'USD') {
      priceInHTD = price / exchangeRates.USD;
    }
    
    if (toCurrency === 'HTG') {
      return priceInHTD * exchangeRates.HTG;
    } else if (toCurrency === 'USD') {
      return priceInHTD * exchangeRates.USD;
    }
    
    return priceInHTD;
  };

  // Format price with currency symbol
  const formatPrice = (price: number, currency = selectedCurrency) => {
    const convertedPrice = convertPrice(price, 'HTD', currency);
    const symbols = {
      HTD: 'HTD ',
      HTG: 'G ',
      USD: '$'
    };
    
    return `${symbols[currency]}${convertedPrice.toFixed(2)}`;
  };

  // Initialize exchange rates on component mount
  useEffect(() => {
    fetchUsdToHtgRate();
  }, []);

  return {
    selectedCurrency,
    setSelectedCurrency,
    exchangeRates,
    usdToHtgRate,
    loadingRates,
    convertPrice,
    formatPrice,
    fetchUsdToHtgRate
  };
};