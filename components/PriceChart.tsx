import { formatPrice } from "@/services/utils";
import * as Localization from 'expo-localization';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { LineGraph } from "react-native-graph";
import { getCryptocurrencyChart } from '../services/detailService';
import { ChartDataPoint } from '../services/types';


type PriceChartProps = {
  cryptoId: string;
  currentPrice: string;
}

type TimeInterval = {
  label: string;
  days: number;
};

const TIME_INTERVALS: TimeInterval[] = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
];

type InteractiveGraphPriceInfo = {
  price: string;
  date: Date | null
}

const screenWidth = Dimensions.get('window').width;

export const PriceChart = ({ cryptoId, currentPrice }: PriceChartProps) => {
  // const [priceTitle, setPriceTitle] = useState<string>(currentPrice);
  // const [priceDate, setPriceDate] = useState<Date | null>(null)
  const [priceInfo, setPriceInfo] = useState<InteractiveGraphPriceInfo>({ price: currentPrice, date: null })
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(TIME_INTERVALS[0]); // Default to 1D
  const [chartLoading, setChartLoading] = useState(false);

  const fetchChartData = useCallback(async (interval: TimeInterval) => {
    setChartLoading(true);
    try {
      const data = await getCryptocurrencyChart(cryptoId, interval.days);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [cryptoId]);

  useEffect(() => {
    if (cryptoId) {
      fetchChartData(selectedInterval);
    }
  }, [cryptoId, fetchChartData, selectedInterval]);

  const handleIntervalChange = (interval: TimeInterval) => {
    setSelectedInterval(interval);
  };

  return (
    <View className="bg-white mx-4 mt-4 p-4 rounded-lg border border-gray-200">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-col">
          <Text className="text-2xl font-semibold text-gray-900">
            {priceInfo.price}
          </Text>
          {priceInfo.date && <Text className="text-l font-semibold text-gray-900">
            {priceInfo.date.toLocaleString('en-US', {
              timeZone: Localization.getCalendars()[0].timeZone || 'EDT',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </Text>}
        </View>
      </View>



      {chartLoading ? (
        <View className="h-48 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Loading chart...</Text>
        </View>
      ) : chartData.length > 0 ? (
        <LineGraph
          points={chartData}
          animated={true}
          color="#3B82F6"
          style={{ width: screenWidth - 64, height: 200 }}
          enablePanGesture={true}
          enableIndicator={true}
          onPointSelected={(p) => setPriceInfo({ price: formatPrice(p.value), date: p.date })}
          onGestureEnd={() => setPriceInfo({ price: currentPrice, date: null })}
        />
      ) : (
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-500">Chart data not available</Text>
        </View>
      )}
      {/* Time Interval Buttons */}
      <View className="flex-row justify-between mt-4">
        {TIME_INTERVALS.map((interval) => (
          <TouchableOpacity
            key={interval.label}
            onPress={() => handleIntervalChange(interval)}
            className={`px-3 py-2 rounded-md ${selectedInterval.label === interval.label
              ? 'bg-blue-500'
              : 'bg-gray-100'
              }`}
          >
            <Text
              className={`text-sm font-medium ${selectedInterval.label === interval.label
                ? 'text-white'
                : 'text-gray-700'
                }`}
            >
              {interval.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}