import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getTopCryptocurrencies } from '../services/marketService';
import { formatMarketCap, formatPercentageChange, formatPrice } from '../services/utils';
import type { Cryptocurrency } from '../services/types';

interface CryptoDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onCryptoSelect: (cryptoId: string) => void;
}

export const CryptoDrawer = ({ isVisible, onClose, onCryptoSelect }: CryptoDrawerProps) => {
  const [cryptoData, setCryptoData] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      fetchCryptoData();
    }
  }, [isVisible]);

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const data = await getTopCryptocurrencies();
      setCryptoData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  }

  const handleCryptoPress = (crypto: Cryptocurrency) => {
    onCryptoSelect(crypto.id);
  };

  const renderCryptoItem = ({ item }: { item: Cryptocurrency }) => (
    <TouchableOpacity
      onPress={() => handleCryptoPress(item)}
      className="flex-row items-center p-4 border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-lg font-bold text-gray-800 w-8">
          {item.market_cap_rank}
        </Text>
        <Image
          source={{ uri: item.image }}
          className="w-8 h-8 mx-3"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 uppercase">
            {item.symbol}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="text-base font-semibold text-gray-900">
          {formatPrice(item.current_price)}
        </Text>
        <Text
          className={`text-sm font-medium ${item.price_change_percentage_24h >= 0
            ? 'text-green-600'
            : 'text-red-600'
            }`}
        >
          {formatPercentageChange(item.price_change_percentage_24h)}
        </Text>
        <Text className="text-xs text-gray-500">
          {formatMarketCap(item.market_cap)}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">
            Top 10 Cryptocurrencies
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-600">Loading cryptocurrency data...</Text>
          </View>
        ) : (
          <FlatList
            data={cryptoData}
            keyExtractor={(item) => item.id}
            renderItem={renderCryptoItem}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchCryptoData}
            ListFooterComponent={<View className="p-4 bg-white border-t border-gray-200">
              <Text className="text-xs text-gray-500 text-center">
                Data provided by CoinGecko • Pull to refresh
              </Text>
            </View>}
          />
        )}
      </View>
    </Modal>
  );
}