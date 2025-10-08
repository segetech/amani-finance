import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Types pour les devises
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol?: string;
  flag_emoji?: string;
  current_rate: number;
  previous_rate?: number;
  change_amount?: number;
  change_percent?: number;
  daily_high?: number;
  daily_low?: number;
  volume?: string;
  is_active: boolean;
  is_major: boolean;
  display_order: number;
  description?: string;
  country?: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCurrencyInput {
  code: string;
  name: string;
  symbol?: string;
  flag_emoji?: string;
  current_rate: number;
  previous_rate?: number;
  daily_high?: number;
  daily_low?: number;
  volume?: string;
  is_active?: boolean;
  is_major?: boolean;
  display_order?: number;
  description?: string;
  country?: string;
}

export interface UpdateCurrencyInput extends Partial<CreateCurrencyInput> {
  id: string;
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les devises
  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('currencies')
        .select('*')
        .order('display_order', { ascending: true });

      if (err) throw err;
      setCurrencies(data || []);
    } catch (err: any) {
      console.error('[useCurrencies] Error:', err);
      setError(err.message || "Erreur lors du chargement des devises");
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle devise
  const createCurrency = useCallback(async (input: CreateCurrencyInput) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('currencies')
        .insert([{
          ...input,
          is_active: input.is_active ?? true,
          is_major: input.is_major ?? false,
          display_order: input.display_order ?? 0,
        }])
        .select()
        .single();

      if (err) throw err;

      // Ajouter à la liste locale
      setCurrencies(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order));
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une devise
  const updateCurrency = useCallback(async (id: string, updates: Partial<CreateCurrencyInput>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('currencies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      // Mettre à jour la liste locale
      setCurrencies(prev => 
        prev.map(item => item.id === id ? data : item)
           .sort((a, b) => a.display_order - b.display_order)
      );
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une devise
  const deleteCurrency = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: err } = await supabase
        .from('currencies')
        .delete()
        .eq('id', id);

      if (err) throw err;

      // Supprimer de la liste locale
      setCurrencies(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Activer/désactiver une devise
  const toggleCurrencyStatus = useCallback(async (id: string) => {
    try {
      const currency = currencies.find(c => c.id === id);
      if (!currency) throw new Error('Devise non trouvée');

      await updateCurrency(id, { is_active: !currency.is_active });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [currencies, updateCurrency]);

  // Marquer comme devise majeure
  const toggleMajorStatus = useCallback(async (id: string) => {
    try {
      const currency = currencies.find(c => c.id === id);
      if (!currency) throw new Error('Devise non trouvée');

      await updateCurrency(id, { is_major: !currency.is_major });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [currencies, updateCurrency]);

  // Mettre à jour les taux en masse (pour import de données externes)
  const bulkUpdateRates = useCallback(async (updates: Array<{ code: string; current_rate: number; daily_high?: number; daily_low?: number; volume?: string }>) => {
    try {
      setLoading(true);
      setError(null);

      const promises = updates.map(async (update) => {
        const currency = currencies.find(c => c.code === update.code);
        if (currency) {
          return updateCurrency(currency.id, {
            previous_rate: currency.current_rate, // Sauvegarder l'ancien taux
            current_rate: update.current_rate,
            daily_high: update.daily_high,
            daily_low: update.daily_low,
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
  }, [currencies, updateCurrency]);

  // Récupérer seulement les devises actives
  const getActiveCurrencies = useCallback(() => {
    return currencies.filter(currency => currency.is_active);
  }, [currencies]);

  // Récupérer seulement les devises majeures
  const getMajorCurrencies = useCallback(() => {
    return currencies.filter(currency => currency.is_active && currency.is_major);
  }, [currencies]);

  // Calculer les statistiques du marché des devises
  const getCurrencyStats = useCallback(() => {
    const activeCurrencies = getActiveCurrencies();
    
    return {
      totalCurrencies: activeCurrencies.length,
      majorCurrencies: activeCurrencies.filter(c => c.is_major).length,
      gainers: activeCurrencies.filter(c => (c.change_percent || 0) > 0).length,
      losers: activeCurrencies.filter(c => (c.change_percent || 0) < 0).length,
      unchanged: activeCurrencies.filter(c => (c.change_percent || 0) === 0).length,
      avgChange: activeCurrencies.length > 0 
        ? activeCurrencies.reduce((sum, c) => sum + (c.change_percent || 0), 0) / activeCurrencies.length 
        : 0,
    };
  }, [getActiveCurrencies]);

  // Fonction de conversion entre devises
  const convertCurrency = useCallback((amount: number, fromCode: string, toCode: string) => {
    if (fromCode === toCode) return amount;
    
    // Si une des devises est FCFA, conversion directe
    if (fromCode === 'XOF') {
      const toCurrency = currencies.find(c => c.code === toCode);
      return toCurrency ? amount / toCurrency.current_rate : amount;
    }
    
    if (toCode === 'XOF') {
      const fromCurrency = currencies.find(c => c.code === fromCode);
      return fromCurrency ? amount * fromCurrency.current_rate : amount;
    }
    
    // Conversion via FCFA
    const fromCurrency = currencies.find(c => c.code === fromCode);
    const toCurrency = currencies.find(c => c.code === toCode);
    
    if (!fromCurrency || !toCurrency) return amount;
    
    const amountInFCFA = amount * fromCurrency.current_rate;
    return amountInFCFA / toCurrency.current_rate;
  }, [currencies]);

  // Charger les données au montage
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    toggleCurrencyStatus,
    toggleMajorStatus,
    bulkUpdateRates,
    getActiveCurrencies,
    getMajorCurrencies,
    getCurrencyStats,
    convertCurrency,
  };
}
