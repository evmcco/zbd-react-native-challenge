import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTopCryptocurrencies } from '../services/marketService';
import type { Cryptocurrency } from '../services/types';

interface CryptoContextType {
  cryptos: Cryptocurrency[];
  loading: boolean;
  error: string | null;
  refreshCryptos: () => Promise<void>;
  getCryptoById: (id: string) => Cryptocurrency | undefined;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider = ({ children }: { children: ReactNode }) => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      const topCryptos = await getTopCryptocurrencies();
      setCryptos(topCryptos);
    } catch (err) {
      console.error('Error fetching top cryptocurrencies:', err);
      setError('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const refreshCryptos = async () => {
    await fetchCryptos();
  };

  const getCryptoById = (id: string): Cryptocurrency | undefined => {
    return cryptos.find(crypto => crypto.id === id);
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  return (
    <CryptoContext.Provider
      value={{
        cryptos,
        loading,
        error,
        refreshCryptos,
        getCryptoById,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};