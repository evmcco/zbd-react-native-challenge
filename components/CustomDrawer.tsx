import { TOP_CRYPTOS } from '@/constants/cryptoData';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import '@/global.css';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();

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
      {TOP_CRYPTOS.map((crypto) => (
        <TouchableOpacity
          key={crypto.id}
          onPress={() => {
            console.log(`naving to ${crypto.id}`)
            handleCryptoPress(crypto.id)
          }}
          className="flex-row items-center px-4 py-3 mx-2 rounded-lg hover:bg-gray-50 active:bg-gray-100"
        >
          <Image
            source={{ uri: crypto.imageUrl }}
            className="w-8 h-8 mr-3"
            resizeMode="contain"
          />
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">{crypto.name}</Text>
            <Text className="text-sm text-gray-500 uppercase">{crypto.symbol}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
}