import AsyncStorage from '@react-native-async-storage/async-storage';

export type PriceDirection = 'above' | 'below'

export interface PriceAlert {
  id: string;
  cryptoId: string;
  cryptoName: string;
  targetPrice: number;
  direction: PriceDirection;
  createdAt: Date;
}

const ALERTS_STORAGE_KEY = 'price_alerts';

export const saveAlert = async (alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const existingAlerts = await getAlerts();
    
    // Remove any existing alert for this crypto (only one alert per crypto)
    const filteredAlerts = existingAlerts.filter(existingAlert => existingAlert.cryptoId !== alert.cryptoId);
    
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedAlerts = [...filteredAlerts, newAlert];
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  } catch (error) {
    console.error('Error saving alert:', error);
  }
};

export const getAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const alertsJson = await AsyncStorage.getItem(ALERTS_STORAGE_KEY);
    if (!alertsJson) return [];
    
    const alerts = JSON.parse(alertsJson);
    return alerts.map((alert: any) => ({
      ...alert,
      createdAt: new Date(alert.createdAt),
    }));
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
};

export const getAlertForCrypto = async (cryptoId: string): Promise<PriceAlert | null> => {
  try {
    const allAlerts = await getAlerts();
    const alert = allAlerts.find(alert => alert.cryptoId === cryptoId);
    return alert || null;
  } catch (error) {
    console.error('Error getting alert for crypto:', error);
    return null;
  }
};

export const deleteAlert = async (alertId: string): Promise<void> => {
  try {
    const existingAlerts = await getAlerts();
    const updatedAlerts = existingAlerts.filter(alert => alert.id !== alertId);
    await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  } catch (error) {
    console.error('Error deleting alert:', error);
  }
};