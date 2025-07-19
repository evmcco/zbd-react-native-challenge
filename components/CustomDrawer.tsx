import '@/global.css';
import { useCrypto } from '@/contexts/CryptoContext';
import { formatPrice } from '@/services/utils';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { cryptos, loading, error } = useCrypto();

  const handleCryptoPress = (cryptoId: string) => {
    router.push(`/crypto/${cryptoId}`);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Default drawer items (Home, etc.) */}
      <DrawerItemList {...props} />

      {/* Section title */}
      <View className="px-4 py-2 border-t border-gray-200 mt-2">
        <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Cryptocurrencies
        </Text>
      </View>

      {/* Custom crypto items */}
      {loading ? (
        <View className="flex-row items-center justify-center px-4 py-6">
          <ActivityIndicator size="small" color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-2">Loading cryptocurrencies...</Text>
        </View>
      ) : error ? (
        <View className="px-4 py-6">
          <Text className="text-sm text-red-500 text-center">{error}</Text>
          <Text className="text-xs text-gray-400 text-center mt-1">
            Pull to refresh or restart the app
          </Text>
        </View>
      ) : (
        cryptos.map((crypto) => (
          <TouchableOpacity
            key={crypto.id}
            onPress={() => {
              console.log(`naving to ${crypto.id}`)
              handleCryptoPress(crypto.id)
            }}
            className="flex-row justify-between items-center px-4 py-3 mx-2 rounded-lg hover:bg-gray-50 active:bg-gray-100"
          >
            <Image
              source={{ uri: crypto.image }}
              className="w-8 h-8 mr-3"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">{crypto.name}</Text>
              <Text className="text-sm text-gray-500 uppercase">{crypto.symbol}</Text>
            </View>
            <Text className="text-sm font-medium text-gray-900">
              {formatPrice(crypto.current_price)}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </DrawerContentScrollView>
  );
}