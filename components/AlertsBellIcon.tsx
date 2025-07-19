import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAlerts } from '../contexts/AlertsContext';
import '../global.css';

export const AlertsBellIcon = () => {
  const { hasUnreadAlerts, triggeredAlerts } = useAlerts();
  const router = useRouter();

  const handlePress = () => {
    router.push('/alerts');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="relative p-2 mr-2"
    >
      <Ionicons 
        name="notifications" 
        size={24} 
        color="#374151" 
      />
      {hasUnreadAlerts && triggeredAlerts.length > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {triggeredAlerts.length > 99 ? '99+' : triggeredAlerts.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};