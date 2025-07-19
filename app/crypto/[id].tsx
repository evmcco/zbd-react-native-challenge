import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAlerts } from '../../contexts/AlertsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PriceAlertModal } from '../../components/PriceAlertModal';
import { PriceChart } from '../../components/PriceChart';
import { getCryptocurrencyDetail } from '../../services/detailService';
import type { CryptocurrencyDetail } from '../../services/types';
import { formatMarketCap, formatPercentageChange, formatPrice } from '../../services/utils';

export default function CryptoDetailScreen() {
  const [cryptoDetail, setCryptoDetail] = useState<CryptocurrencyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { checkPriceAlerts } = useAlerts();

  const fetchCryptoDetail = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await getCryptocurrencyDetail(id);
      setCryptoDetail(detail);
      // Set dynamic page title
      navigation.setOptions({
        title: detail ? detail.name : 'Details',
      });
      
      // Check price alerts
      if (detail && detail.current_price) {
        await checkPriceAlerts(id, detail.current_price);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cryptocurrency details');
    } finally {
      setLoading(false);
    }
  }, [id, navigation, checkPriceAlerts]);

  useEffect(() => {
    if (id) {
      fetchCryptoDetail();
    }
  }, [fetchCryptoDetail, id]);



  const renderStatCard = (title: string, value: string, change?: number) => (
    <View className="bg-white p-4 rounded-lg border border-gray-200">
      <Text className="text-sm text-gray-500 mb-1">{title}</Text>
      {value !== '' && <Text className="text-lg font-semibold text-gray-900">{value}</Text>}
      {change && (
        <Text
          className={`text-lg font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {formatPercentageChange(change)}
        </Text>
      )}
    </View>
  );

  if (!cryptoDetail && !loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Failed to load cryptocurrency details</Text>
        <TouchableOpacity
          onPress={fetchCryptoDetail}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-600">Loading details...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header with coin info */}
            <View className="bg-white p-6 border-b border-gray-200">
              <View className="flex-row items-center mb-4">
                <Image
                  source={{ uri: cryptoDetail?.image.large }}
                  className="w-16 h-16 mr-4"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900">
                    {cryptoDetail?.name}
                  </Text>
                  <Text className="text-lg text-gray-500 uppercase">
                    {cryptoDetail?.symbol}
                  </Text>
                  <Text className="text-sm text-gray-400">
                    Rank #{cryptoDetail?.market_cap_rank}
                  </Text>
                </View>
              </View>

              <View className="items-center">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(cryptoDetail?.current_price || 0)}
                </Text>
                <Text
                  className={`text-lg font-medium ${(cryptoDetail?.price_change_percentage_24h || 0) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >
                  {formatPercentageChange(cryptoDetail?.price_change_percentage_24h || 0)} (24h)
                </Text>
              </View>
            </View>

            <PriceChart cryptoId={id} currentPrice={formatPrice(cryptoDetail?.current_price || 0)} />

            {/* Price Alert Button */}
            <TouchableOpacity
              onPress={() => setIsAlertModalVisible(true)}
              className="bg-blue-500 mx-4 mt-4 p-4 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons name="notifications" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Set Price Alert
              </Text>
            </TouchableOpacity>

            <View className="p-4 space-y-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Statistics
              </Text>

              <View className="grid grid-cols-2 gap-2">
                {renderStatCard(
                  'Market Cap',
                  formatMarketCap(cryptoDetail?.market_cap || 0)
                )}
                {renderStatCard(
                  '24h Volume',
                  formatMarketCap(cryptoDetail?.total_volume || 0)
                )}

                {renderStatCard(
                  '24h High',
                  formatPrice(cryptoDetail?.high_24h || 0)
                )}
                {renderStatCard(
                  '24h Low',
                  formatPrice(cryptoDetail?.low_24h || 0)
                )}

                {renderStatCard(
                  '7d Change',
                  '',
                  cryptoDetail?.price_change_percentage_7d
                )}
                {renderStatCard(
                  '30d Change',
                  '',
                  cryptoDetail?.price_change_percentage_30d
                )}
              </View>
            </View>

            {cryptoDetail?.description?.en && (
              <View className="bg-white mx-4 mb-4 p-4 rounded-lg border border-gray-200">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  About {cryptoDetail.name}
                </Text>
                <Text className="text-gray-700 leading-6">
                  {cryptoDetail.description.en.replace(/<[^>]*>/g, '').slice(0, 500)}
                  {cryptoDetail.description.en.length > 500 ? '...' : ''}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isVisible={isAlertModalVisible}
        onClose={() => setIsAlertModalVisible(false)}
        cryptoId={id}
        cryptoName={cryptoDetail?.name || ''}
        currentPrice={cryptoDetail?.current_price || 0}
      />
    </GestureHandlerRootView>
  );
}