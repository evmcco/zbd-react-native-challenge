import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAlerts } from '../contexts/AlertsContext';

import "../global.css";

export default function HomeScreen() {
  const { addTriggeredAlert } = useAlerts();

  const createDummyAlerts = async () => {
    const dummyAlerts = [
      {
        id: 'test-1',
        cryptoId: 'bitcoin',
        cryptoName: 'Bitcoin',
        targetPrice: 50000,
        direction: 'above' as const,
        createdAt: new Date(),
      },
      {
        id: 'test-2',
        cryptoId: 'ethereum',
        cryptoName: 'Ethereum',
        targetPrice: 3000,
        direction: 'below' as const,
        createdAt: new Date(),
      },
      {
        id: 'test-3',
        cryptoId: 'solana',
        cryptoName: 'Solana',
        targetPrice: 100,
        direction: 'above' as const,
        createdAt: new Date(),
      },
    ];

    // Pick a random alert from the list
    const randomIndex = Math.floor(Math.random() * dummyAlerts.length);
    const randomAlert = dummyAlerts[randomIndex];

    await addTriggeredAlert(randomAlert, randomAlert.targetPrice + (Math.random() - 0.5) * 1000);
  };

  return (
    <View className="flex-1 p-4 bg-gray-50">
      <TouchableOpacity
        onPress={createDummyAlerts}
        className="bg-orange-500 p-4 rounded-lg flex-row items-center justify-center mb-4"
      >
        <Ionicons name="notifications" size={24} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">
          Test Alerts (Create Dummy Alert)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
