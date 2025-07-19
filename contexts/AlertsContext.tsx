import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PriceAlert } from '../services/alertService';

export interface TriggeredAlert extends PriceAlert {
  triggeredAt: Date;
  triggeredPrice: number;
}

interface AlertsContextType {
  triggeredAlerts: TriggeredAlert[];
  hasUnreadAlerts: boolean;
  addTriggeredAlert: (alert: PriceAlert, triggeredPrice: number) => Promise<void>;
  clearAllAlerts: () => Promise<void>;
  checkPriceAlerts: (cryptoId: string, currentPrice: number) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

const TRIGGERED_ALERTS_KEY = 'triggered_alerts';

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  const loadTriggeredAlerts = async () => {
    try {
      const alertsJson = await AsyncStorage.getItem(TRIGGERED_ALERTS_KEY);
      if (alertsJson) {
        const alerts = JSON.parse(alertsJson);
        const parsedAlerts = alerts.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
          triggeredAt: new Date(alert.triggeredAt),
        }));
        setTriggeredAlerts(parsedAlerts);
        setHasUnreadAlerts(parsedAlerts.length > 0);
      }
    } catch (error) {
      console.error('Error loading triggered alerts:', error);
    }
  };

  const addTriggeredAlert = async (alert: PriceAlert, triggeredPrice: number) => {
    try {
      const triggeredAlert: TriggeredAlert = {
        ...alert,
        triggeredAt: new Date(),
        triggeredPrice,
      };

      const updatedAlerts = [...triggeredAlerts, triggeredAlert];
      setTriggeredAlerts(updatedAlerts);
      setHasUnreadAlerts(true);

      await AsyncStorage.setItem(TRIGGERED_ALERTS_KEY, JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error adding triggered alert:', error);
    }
  };

  const clearAllAlerts = async () => {
    try {
      setTriggeredAlerts([]);
      setHasUnreadAlerts(false);
      await AsyncStorage.removeItem(TRIGGERED_ALERTS_KEY);
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  const checkPriceAlerts = async (cryptoId: string, currentPrice: number) => {
    try {
      const { getAlertForCrypto } = await import('../services/alertService');
      const alert = await getAlertForCrypto(cryptoId);
      
      if (!alert) return;

      // Check if this alert has already been triggered
      const alreadyTriggered = triggeredAlerts.some(ta => ta.id === alert.id);
      if (alreadyTriggered) return;

      // Check if alert condition is met
      const shouldTrigger = 
        (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.direction === 'below' && currentPrice <= alert.targetPrice);

      if (shouldTrigger) {
        await addTriggeredAlert(alert, currentPrice);
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  };

  useEffect(() => {
    loadTriggeredAlerts();
  }, []);

  return (
    <AlertsContext.Provider
      value={{
        triggeredAlerts,
        hasUnreadAlerts,
        addTriggeredAlert,
        clearAllAlerts,
        checkPriceAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};