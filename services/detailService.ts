import type { ChartDataPoint, CryptocurrencyDetail } from './types';
import { API_BASE_URL } from './utils';

// Cache for cryptocurrency details
const DETAIL_CACHE_DURATION = 30 * 1000; // 30 seconds in milliseconds
const detailCache = new Map<string, { data: CryptocurrencyDetail; timestamp: number }>();

const isDetailCacheValid = (id: string): boolean => {
  const cached = detailCache.get(id);
  if (!cached) return false;
  return Date.now() - cached.timestamp < DETAIL_CACHE_DURATION;
};

export const getCryptocurrencyDetail = async (id: string): Promise<CryptocurrencyDetail | null> => {
  // Return cached data if it's still valid
  if (isDetailCacheValid(id)) {
    console.log(`🟢 CACHE HIT: returning cached detail for ${id}`);
    return detailCache.get(id)!.data;
  }

  try {
    console.log(`🔴 CACHE MISS: fetching detail for ${id}`);
    const url = `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    
    const response = await fetch(url);
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    const detail: CryptocurrencyDetail = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      price_change_percentage_7d: data.market_data.price_change_percentage_7d,
      price_change_percentage_30d: data.market_data.price_change_percentage_30d,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      description: data.description,
    };
    
    // Update cache
    detailCache.set(id, { data: detail, timestamp: Date.now() });
    
    return detail;
  } catch (error) {
    console.error('Error fetching cryptocurrency detail:', error);
    
    // Return cached data if available, even if expired, as a fallback
    const cached = detailCache.get(id);
    if (cached) {
      return cached.data;
    }
    
    return null;
  }
};

// Cache for cryptocurrency charts
const chartCache = new Map<string, { data: ChartDataPoint[]; timestamp: number }>();

const isChartCacheValid = (id: string): boolean => {
  const cached = chartCache.get(id);
  if (!cached) return false;
  return Date.now() - cached.timestamp < DETAIL_CACHE_DURATION;
};

export const getCryptocurrencyChart = async (id: string, days: number = 1): Promise<ChartDataPoint[]> => {
  const cacheKey = `${id}-${days}`;
  
  // Return cached data if it's still valid
  if (isChartCacheValid(cacheKey)) {
    console.log(`🟢 CACHE HIT: returning cached chart for ${cacheKey}`);
    return chartCache.get(cacheKey)!.data;
  }

  try {
    console.log(`🔴 CACHE MISS: fetching chart for ${cacheKey}`);
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const chartData: ChartDataPoint[] = data.prices.map(([timestamp, price]: [number, number]) => ({
      value: price,
      date: new Date(timestamp),
    }));
    
    // Update cache
    chartCache.set(cacheKey, { data: chartData, timestamp: Date.now() });
    
    return chartData;
  } catch (error) {
    console.error('Error fetching cryptocurrency chart:', error);
    
    // Return cached data if available, even if expired, as a fallback
    const cached = chartCache.get(cacheKey);
    if (cached) {
      return cached.data;
    }
    
    return [];
  }
};