import type { Cryptocurrency } from './types';
import { API_BASE_URL } from './utils';

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let cachedData: Cryptocurrency[] | null = null;
let cacheTimestamp: number | null = null;

const isCacheValid = (): boolean => {
  if (!cachedData || !cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION;
};

export const getTopCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  // Return cached data if it's still valid
  if (isCacheValid()) {
    return cachedData!;
  }

  try {
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
};