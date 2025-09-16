
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getExchangeRate, ExchangeRateData } from "@/utils/currencyConverter";
import { Loader2 } from "lucide-react";

interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  currencySymbol: string;
  currencyName: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
  currencySymbol,
  currencyName
}) => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch exchange rate when component mounts
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true);
      try {
        const rate = await getExchangeRate();
        setExchangeRate(rate);
      } catch (error) {
        console.error("Failed to fetch exchange rate", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExchangeRate();
    
    // Refresh rate every 5 minutes
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate the converted amount
  const usdAmount = parseFloat(amount) || 0;
  const htgAmount = exchangeRate ? usdAmount * exchangeRate.usdToHtg : 0;

  // Calculate left padding based on currency symbol length
  const getPaddingClass = () => {
    const symbolLength = currencySymbol.trim().length;
    if (symbolLength > 3) return 'pl-16';  // For longer currency symbols like "HTG "
    if (symbolLength > 2) return 'pl-14';  // For medium currency symbols
    return 'pl-8';  // For shorter currency symbols like "$"
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      {/* Display exchange rate above the input field */}
      {currencySymbol === '$' && (
        <div className="bg-blue-50 p-3 rounded-md mb-3 border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">Current Exchange Rate:</span>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-blue-800">
                1 USD = {exchangeRate?.usdToHtg.toFixed(2)} HTG
                {!exchangeRate?.isLive && " (offline rate)"}
              </span>
            )}
          </div>
          {usdAmount > 0 && exchangeRate && (
            <div className="mt-2 text-sm font-medium text-green-700 flex justify-between">
              <span>Receiver Gets:</span>
              <span>{htgAmount.toFixed(2)} HTG</span>
            </div>
          )}
        </div>
      )}
      
      <Label htmlFor="amount">Amount to send ({currencyName})</Label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <span className="text-gray-500 font-medium">{currencySymbol.trim()}</span>
        </div>
        <Input
          id="amount"
          type="number"
          className={getPaddingClass()}
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>
      
      {amount && parseFloat(amount) > 0 && currencySymbol === '$' && (
        <p className="text-sm text-gray-500 mt-2">
          * Receiver will get approximately {htgAmount.toFixed(2)} HTG
        </p>
      )}
    </div>
  );
};

export default AmountInput;
