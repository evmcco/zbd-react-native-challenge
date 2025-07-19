import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { TOP_CRYPTOS } from '../constants/cryptoData';
import { useAlerts } from '../contexts/AlertsContext';
import '../global.css';
import { formatPrice } from '../services/utils';

export default function AlertsScreen() {
  const { triggeredAlerts, clearAllAlerts } = useAlerts();

  useFocusEffect(
    useCallback(() => {
      // Clear alerts when the user navigates away from this screen
      return () => {
        clearAllAlerts();
      };
    }, [clearAllAlerts])
  );

  const getCryptoImage = (cryptoId: string) => {
    const crypto = TOP_CRYPTOS.find(c => c.id === cryptoId);
    return crypto?.imageUrl || '';
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString();
  };

  if (triggeredAlerts.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="notifications-off" size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
            No Triggered Alerts
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            When your price alerts are triggered, they&apos;ll appear here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {triggeredAlerts.map((alert, index) => (
            <View
              key={`${alert.id}-${index}`}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm"
            >
              <View className="flex-row items-start">
                <Image
                  source={{ uri: getCryptoImage(alert.cryptoId) }}
                  className="w-12 h-12 mr-3 mt-1"
                  resizeMode="contain"
                />

                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg font-semibold text-gray-900">
                      {alert.cryptoName}
                    </Text>
                    <View
                      className={`ml-2 px-2 py-1 rounded-full ${alert.direction === 'above' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                    >
                      <Text
                        className={`text-xs font-medium ${alert.direction === 'above' ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {alert.direction === 'above' ? 'Above' : 'Below'}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-600 mb-1">
                    Target: {formatPrice(alert.targetPrice)}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    Triggered at: {formatPrice(alert.triggeredPrice)}
                  </Text>

                  <View className="flex-row items-center">
                    <Ionicons name="time" size={14} color="#9CA3AF" />
                    <Text className="text-sm text-gray-500 ml-1">
                      {formatTimestamp(alert.triggeredAt)}
                    </Text>
                  </View>
                </View>

                <View className="ml-2">
                  <Ionicons
                    name={alert.direction === 'above' ? 'trending-up' : 'trending-down'}
                    size={24}
                    color={alert.direction === 'above' ? '#10B981' : '#EF4444'}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}