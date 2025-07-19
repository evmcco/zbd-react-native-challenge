import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { deleteAlert, getAlertForCrypto, PriceAlert, PriceDirection, saveAlert } from '../services/alertService';
import { formatPrice } from '../services/utils';

interface PriceAlertProps {
  cryptoId: string;
  cryptoName: string;
}

export const PriceAlertComponent = ({
  cryptoId,
  cryptoName,
}: PriceAlertProps) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<PriceDirection>('above');
  const [alert, setAlert] = useState<PriceAlert | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAlert = useCallback(async () => {
    try {
      const existingAlert = await getAlertForCrypto(cryptoId);
      setAlert(existingAlert);

      // If there's an existing alert, populate the form
      if (existingAlert) {
        setTargetPrice(existingAlert.targetPrice.toString());
        setDirection(existingAlert.direction);
      } else {
        setTargetPrice('');
        setDirection('above');
      }
    } catch (error) {
      console.error('Error loading alert:', error);
    }
  }, [cryptoId]);

  useEffect(() => {
    loadAlert();

  }, [loadAlert]);


  const handleSaveAlert = async () => {
    if (!targetPrice.trim()) {
      Alert.alert('Error', 'Please enter a target price');
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      await saveAlert({
        cryptoId,
        cryptoName,
        targetPrice: price,
        direction,
      });

      await loadAlert();
      Alert.alert('Success', 'Price alert saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save price alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async () => {
    if (!alert) return;

    try {
      await deleteAlert(alert.id);
      await loadAlert();
      Alert.alert('Success', 'Alert deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete alert');
    }
  };

  const renderCurrentAlert = () => {
    if (!alert) return null;

    return (
      <View className="p-4 bg-gray-50 rounded-lg mb-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              Alert when price goes {alert.direction} {formatPrice(alert.targetPrice)}
            </Text>
            <Text className="text-sm text-gray-500">
              Created: {alert.createdAt.toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDeleteAlert}
            className="p-2 bg-red-100 rounded-full"
          >
            <Ionicons name="trash" size={16} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 bg-white rounded-lg border-2 border-blue-500 m-4">
        <View className="flex-1 p-4">
          {renderCurrentAlert()}

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              {alert ? 'Edit Price Alert' : 'Set New Price Alert'}
            </Text>

            <View className="flex-row mb-3">
              <TouchableOpacity
                onPress={() => setDirection('above')}
                className={`flex-1 py-3 px-4 rounded-l-lg border ${direction === 'above'
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <Text className={`text-center font-medium ${direction === 'above' ? 'text-white' : 'text-gray-700'
                  }`}>
                  Above
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDirection('below')}
                className={`flex-1 py-3 px-4 rounded-r-lg border ${direction === 'below'
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <Text className={`text-center font-medium ${direction === 'below' ? 'text-white' : 'text-gray-700'
                  }`}>
                  Below
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center space-x-3">
              <TextInput
                className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 mr-2"
                placeholder="Enter target price..."
                value={targetPrice}
                onChangeText={setTargetPrice}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={handleSaveAlert}
                disabled={loading}
                className={`px-6 py-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'
                  }`}
              >
                <Text className="text-white font-semibold">
                  {loading ? 'Saving...' : (alert ? 'Update' : 'Save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};