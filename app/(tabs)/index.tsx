import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { CryptoDetailScreen } from '@/components/CryptoDetailScreen';
import { CryptoDrawer } from '@/components/CryptoDrawer';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import "../../global.css";

export default function HomeScreen() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string | null>(null);

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCryptoId(cryptoId);
    setIsDrawerVisible(false);
  };

  const handleDetailClose = () => {
    setSelectedCryptoId(null);
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>

        <TouchableOpacity
          onPress={() => setIsDrawerVisible(true)}
          className="bg-blue-500 p-4 rounded-lg flex-row items-center justify-center my-4"
        >
          <Ionicons name="trending-up" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            View Top Cryptocurrencies
          </Text>
        </TouchableOpacity>
      </ParallaxScrollView>

      <CryptoDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        onCryptoSelect={handleCryptoSelect}
      />

      {selectedCryptoId && (
        <CryptoDetailScreen
          onClose={handleDetailClose}
          cryptoId={selectedCryptoId}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
