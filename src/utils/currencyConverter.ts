// Base URL for the Bank of the Republic of Haiti (BRH) exchange rate API
// Note: This is a placeholder. You would need to replace with the actual API endpoint
const BRH_API_URL = 'https://brh.ht/api/exchange-rates';

// Our fixed rate for USD to HTG conversion
const OUR_FIXED_RATE = 127.5; 

export interface ExchangeRateData {
  usdToHtg: number;
  originalRate: number; // Original BRH rate before our discount (not displayed to users)
  lastUpdated: Date;
  isLive: boolean;
}

// Cache the exchange rate data
let cachedRateData: ExchangeRateData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Get the current USD to HTG exchange rate
 * Fetches from API or returns cached value if recently fetched
 */
export const getExchangeRate = async (): Promise<ExchangeRateData> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedRateData && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedRateData;
  }
  
  try {
    // In a production environment, you would fetch the real rate from an API
    // const response = await fetch(BRH_API_URL);
    // const data = await response.json();
    
    // For now, we'll use a hardcoded rate that simulates the BRH rate
    // The current USD to HTG exchange rate is approximately 130 HTG per USD
    const brhRate = 130;
    
    // Always use our fixed rate of 120 HTG per USD
    cachedRateData = {
      usdToHtg: OUR_FIXED_RATE,
      originalRate: brhRate,
      lastUpdated: new Date(),
      isLive: true
    };
    
    lastFetchTime = now;
    return cachedRateData;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    
    // If we can't get a live rate, return our cached rate or a fallback
    if (cachedRateData) {
      return {
        ...cachedRateData,
        isLive: false
      };
    }
    
    // Fallback rate if we have no cached data either
    return {
      usdToHtg: OUR_FIXED_RATE,
      originalRate: 130, // Original BRH rate (not displayed)
      lastUpdated: new Date(),
      isLive: false
    };
  }
};

/**
 * Convert USD to HTG using our exchange rate
 * @param usdAmount - Amount in USD to convert
 * @returns Promise with the converted amount in HTG
 */
export const convertUsdToHtg = async (usdAmount: number): Promise<number> => {
  const { usdToHtg } = await getExchangeRate();
  return usdAmount * usdToHtg;
};