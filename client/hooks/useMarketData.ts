import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  current_price: number;
  previous_close: number;
  change_amount: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  high_52w: number;
  low_52w: number;
  pe_ratio?: number;
  dividend_yield?: number;
  last_updated: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMarketDataInput {
  symbol: string;
  name: string;
  sector: string;
  current_price: number;
  previous_close: number;
  volume?: number;
  market_cap?: number;
  high_52w?: number;
  low_52w?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  is_active?: boolean;
}

export interface UpdateMarketDataInput extends Partial<CreateMarketDataInput> {
  id: string;
}

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les données de marché
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .order('symbol', { ascending: true });

      if (error) throw error;

      // Calculer les variations automatiquement
      const processedData = data.map(item => ({
        ...item,
        change_amount: item.current_price - item.previous_close,
        change_percent: ((item.current_price - item.previous_close) / item.previous_close) * 100,
      }));

      setMarketData(processedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur lors de la récupération des données de marché:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle donnée de marché
  const createMarketData = useCallback(async (input: CreateMarketDataInput) => {
    try {
      setLoading(true);
      setError(null);

      const marketDataToCreate = {
        ...input,
        change_amount: input.current_price - input.previous_close,
        change_percent: ((input.current_price - input.previous_close) / input.previous_close) * 100,
        last_updated: new Date().toISOString(),
        is_active: input.is_active ?? true,
      };

      const { data, error } = await supabase
        .from('market_data')
        .insert([marketDataToCreate])
        .select()
        .single();

      if (error) throw error;

      // Ajouter à la liste locale
      setMarketData(prev => [...prev, data]);
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une donnée de marché
  const updateMarketData = useCallback(async (id: string, updates: Partial<CreateMarketDataInput>) => {
    try {
      setLoading(true);
      setError(null);

      // Calculer les nouvelles variations si les prix changent
      let processedUpdates = { ...updates };
      if (updates.current_price !== undefined || updates.previous_close !== undefined) {
        const currentItem = marketData.find(item => item.id === id);
        if (currentItem) {
          const newCurrentPrice = updates.current_price ?? currentItem.current_price;
          const newPreviousClose = updates.previous_close ?? currentItem.previous_close;
          
          // Les champs calculés sont gérés par la base de données
          processedUpdates = {
            ...processedUpdates,
            last_updated: new Date().toISOString(),
          } as any;
        }
      }

      const { data, error } = await supabase
        .from('market_data')
        .update(processedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste locale
      setMarketData(prev => prev.map(item => item.id === id ? data : item));
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [marketData]);

  // Supprimer une donnée de marché
  const deleteMarketData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('market_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Supprimer de la liste locale
      setMarketData(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Activer/désactiver une donnée de marché
  const toggleMarketDataStatus = useCallback(async (id: string) => {
    try {
      const currentItem = marketData.find(item => item.id === id);
      if (!currentItem) throw new Error('Élément non trouvé');

      await updateMarketData(id, { is_active: !currentItem.is_active });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [marketData, updateMarketData]);

  // Mettre à jour les prix en masse (pour import de données)
  const bulkUpdatePrices = useCallback(async (updates: Array<{ symbol: string; current_price: number; volume?: number }>) => {
    try {
      setLoading(true);
      setError(null);

      const promises = updates.map(async (update) => {
        const currentItem = marketData.find(item => item.symbol === update.symbol);
        if (currentItem) {
          return updateMarketData(currentItem.id, {
            current_price: update.current_price,
            volume: update.volume,
          });
        }
        return null;
      });

      await Promise.all(promises);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [marketData, updateMarketData]);

  // Récupérer les données actives seulement
  const getActiveMarketData = useCallback(() => {
    return marketData.filter(item => item.is_active);
  }, [marketData]);

  // Récupérer les données par secteur
  const getMarketDataBySector = useCallback((sector: string) => {
    return marketData.filter(item => item.sector === sector && item.is_active);
  }, [marketData]);

  // Calculer les statistiques du marché
  const getMarketStats = useCallback(() => {
    const activeData = getActiveMarketData();
    
    return {
      totalStocks: activeData.length,
      gainers: activeData.filter(item => item.change_percent > 0).length,
      losers: activeData.filter(item => item.change_percent < 0).length,
      unchanged: activeData.filter(item => item.change_percent === 0).length,
      totalVolume: activeData.reduce((sum, item) => sum + (item.volume || 0), 0),
      totalMarketCap: activeData.reduce((sum, item) => sum + (item.market_cap || 0), 0),
      avgChange: activeData.length > 0 
        ? activeData.reduce((sum, item) => sum + item.change_percent, 0) / activeData.length 
        : 0,
    };
  }, [getActiveMarketData]);

  return {
    marketData,
    loading,
    error,
    fetchMarketData,
    createMarketData,
    updateMarketData,
    deleteMarketData,
    toggleMarketDataStatus,
    bulkUpdatePrices,
    getActiveMarketData,
    getMarketDataBySector,
    getMarketStats,
  };
}
