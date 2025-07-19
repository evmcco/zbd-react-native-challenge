import { Image, ImageBackground, Text, View } from 'react-native';

import { TestAlertButton } from '@/components/TestAlertButton';
import "../global.css";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/bg-light.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-between py-8">
        <Image
          source={require('../assets/images/zbd-black.png')}
        />
        <View className="flex items-center p-4 rounded-lg border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900">
            Crypto Prices App
          </Text>
          <Text className="text-lg font-semibold text-gray-900">
            Created by Evan McCoy for ZBD
          </Text>
        </View>
        <TestAlertButton />
      </View>
    </ImageBackground>
  );
}
