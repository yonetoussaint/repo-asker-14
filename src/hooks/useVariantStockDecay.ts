
import { useState, useEffect, useCallback, useRef } from "react";

interface Variant {
  name: string;
  stock: number;
  [key: string]: any;
}

// Export the interface so other components can use it
export interface VariantStockInfo {
  initialStock: number;
  currentStock: number;
  activationTime: number | null;
  decayRate: number;
  stockPercentage?: number;
  isActive?: boolean;
}

interface UseVariantStockDecayOptions {
  variants: Variant[];
  decayPeriod?: number;
  minStockPercentage?: number;
  persistKey?: string;
}

export function useVariantStockDecay({
  variants,
  decayPeriod = 24 * 60 * 60 * 1000, // Default: 24 hours in milliseconds
  minStockPercentage = 0.2, // Default: 20% of initial stock as minimum
  persistKey = "variant-stock-info"
}: UseVariantStockDecayOptions) {
  // Create a ref to store the original variants to prevent unnecessary re-renders
  const variantsRef = useRef(variants);
  
  // Initialize stock info state from localStorage or from the provided variants
  const [variantStockInfo, setVariantStockInfo] = useState<Record<string, VariantStockInfo>>(() => {
    // Try to load from localStorage if available
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem(persistKey);
      if (savedInfo) {
        try {
          return JSON.parse(savedInfo);
        } catch (e) {
          console.error("Failed to parse saved variant stock info:", e);
        }
      }
    }
    
    // Initialize with the provided variants
    return variants.reduce((acc, variant) => {
      acc[variant.name] = {
        initialStock: variant.stock,
        currentStock: variant.stock,
        activationTime: null,
        decayRate: variant.stock * (1 - minStockPercentage) / decayPeriod,
        stockPercentage: 100,
        isActive: false
      };
      return acc;
    }, {} as Record<string, VariantStockInfo>);
  });
  
  // Save to localStorage whenever variantStockInfo changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(persistKey, JSON.stringify(variantStockInfo));
    }
  }, [variantStockInfo, persistKey]);
  
  // Update stock levels based on elapsed time
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVariantStockInfo(prevInfo => {
        const now = Date.now();
        let hasUpdates = false;
        
        const updatedInfo = { ...prevInfo };
        
        Object.keys(updatedInfo).forEach(variantName => {
          const info = updatedInfo[variantName];
          
          if (info.activationTime !== null) {
            const elapsedMs = now - info.activationTime;
            const minStock = info.initialStock * minStockPercentage;
            const newStock = Math.max(
              minStock,
              info.initialStock - (info.decayRate * elapsedMs)
            );
            
            // Calculate percentage of stock remaining
            const stockPercentage = Math.max(
              0, 
              Math.min(
                100, 
                ((newStock - minStock) / (info.initialStock - minStock)) * 100
              )
            );
            
            if (newStock !== info.currentStock || !info.stockPercentage) {
              updatedInfo[variantName] = {
                ...info,
                currentStock: newStock,
                stockPercentage: stockPercentage,
                isActive: true
              };
              hasUpdates = true;
            }
          }
        });
        
        return hasUpdates ? updatedInfo : prevInfo;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [minStockPercentage]);
  
  // Function to activate a variant (start its stock decay)
  const activateVariant = useCallback((variantName: string) => {
    setVariantStockInfo(prevInfo => {
      // If the variant is already activated, don't update state
      if (prevInfo[variantName]?.activationTime !== null) {
        return prevInfo;
      }
      
      return {
        ...prevInfo,
        [variantName]: {
          ...prevInfo[variantName],
          activationTime: Date.now(),
          isActive: true
        }
      };
    });
  }, []);
  
  // Function to reset a specific variant's stock
  const resetVariant = useCallback((variantName: string) => {
    setVariantStockInfo(prevInfo => {
      const variant = variantsRef.current.find(v => v.name === variantName);
      if (!variant) return prevInfo;
      
      return {
        ...prevInfo,
        [variantName]: {
          initialStock: variant.stock,
          currentStock: variant.stock,
          activationTime: null,
          decayRate: variant.stock * (1 - minStockPercentage) / decayPeriod,
          stockPercentage: 100,
          isActive: false
        }
      };
    });
  }, [decayPeriod, minStockPercentage]);
  
  // Function to reset all variants
  const resetAllVariants = useCallback(() => {
    const newInfo = variantsRef.current.reduce((acc, variant) => {
      acc[variant.name] = {
        initialStock: variant.stock,
        currentStock: variant.stock,
        activationTime: null,
        decayRate: variant.stock * (1 - minStockPercentage) / decayPeriod,
        stockPercentage: 100,
        isActive: false
      };
      return acc;
    }, {} as Record<string, VariantStockInfo>);
    
    setVariantStockInfo(newInfo);
  }, [decayPeriod, minStockPercentage]);
  
  // Function to get time remaining until stock reaches minimum, returns format expected by components
  const getTimeRemaining = useCallback((variantName: string): { minutes: number, seconds: number } | null => {
    const info = variantStockInfo[variantName];
    if (!info || info.activationTime === null) return null;
    
    const minStock = info.initialStock * minStockPercentage;
    const remainingStock = info.currentStock - minStock;
    if (remainingStock <= 0) return { minutes: 0, seconds: 0 };
    
    const timeToDecayMs = remainingStock / info.decayRate;
    const totalSeconds = Math.floor(timeToDecayMs / 1000);
    
    return {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60
    };
  }, [variantStockInfo, minStockPercentage]);
  
  return {
    variantStockInfo,
    activateVariant,
    resetVariant,
    resetAllVariants,
    getTimeRemaining
  };
}
