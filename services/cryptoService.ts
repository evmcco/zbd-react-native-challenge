export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
let cachedData: Cryptocurrency[] | null = null;
let cacheTimestamp: number | null = null;

const isCacheValid = (): boolean => {
  if (!cachedData || !cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION;
};

export const getTopCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  // Return cached data if it's still valid
  if (isCacheValid()) {
    console.log("returning cached data")
    return cachedData!;
  }

  try {
    console.log("fetching crypto data")
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${10}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();
    
    return data;
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    
    // Return cached data if available, even if expired, as a fallback
    if (cachedData) {
      return cachedData;
    }
    
    return [];
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
}

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
}

export const formatPercentageChange = (change: number): string  => {
  const formatted = Math.abs(change).toFixed(2);
  return `${change >= 0 ? '+' : '-'}${formatted}%`;
}