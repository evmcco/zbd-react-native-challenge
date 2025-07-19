import { useAlerts } from "@/contexts/AlertsContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

export const TestAlertButton = () => {
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
    <TouchableOpacity
      onPress={createDummyAlerts}
      className="bg-blue-400 p-4 rounded-lg flex-row items-center justify-center mb-4"
    >
      <Ionicons name="notifications" size={24} color="white" />
      <Text className="text-white font-semibold text-lg ml-2">
        Fire Test Alert
      </Text>
    </TouchableOpacity>
  )
}