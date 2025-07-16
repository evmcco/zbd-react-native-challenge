import { formatPrice } from "@/services/utils";
import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineGraph } from "react-native-graph";
import { ChartDataPoint } from '../services/types';

type PriceChartProps = {
  chartData: ChartDataPoint[]
  currentPrice: string;
}

const screenWidth = Dimensions.get('window').width;

export const PriceChart = ({ chartData, currentPrice }: PriceChartProps) => {
  const [priceTitle, setPriceTitle] = useState<string>(currentPrice)

  return (
    <View className="bg-white mx-4 mt-4 p-4 rounded-lg border border-gray-200">
      <Text className="text-2xl font-semibold text-gray-900 mb-4">
        {priceTitle}
      </Text>
      {chartData.length > 0 ? (
        <LineGraph
          points={chartData}
          animated={true}
          color="#3B82F6"
          style={{ width: screenWidth - 64, height: 200 }}
          enablePanGesture={true}
          enableIndicator={true}
          onPointSelected={(p) => setPriceTitle(formatPrice(p.value))}
          onGestureEnd={() => setPriceTitle(currentPrice)}
        />
      ) : (
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-500">Chart data not available</Text>
        </View>
      )}
    </View>
  )
}