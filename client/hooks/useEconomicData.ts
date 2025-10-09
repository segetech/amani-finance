import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface EconomicCountry {
  id: string;
  name: string;
  flag_emoji: string;
  currency: string;
  population: string;
  gdp_growth_rate: number;
  inflation_rate: number;
  unemployment_rate: number;
  gdp_per_capita: number;
  main_sectors: string[];
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RegionalMetric {
  id: string;
  metric_name: string;
  metric_value: string;
  metric_unit?: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface EconomicDataFilters {
  is_active?: boolean;
  limit?: number;
}

export function useEconomicData(filters: EconomicDataFilters = {}) {
  const [countries, setCountries] = useState<EconomicCountry[]>([]);
  const [regionalMetrics, setRegionalMetrics] = useState<RegionalMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données des pays
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('economic_countries')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setCountries(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des pays:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filters.is_active, filters.limit]);

  // Récupérer les métriques régionales
  const fetchRegionalMetrics = useCallback(async () => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('regional_economic_metrics')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setRegionalMetrics(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des métriques régionales:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }, []);

  // Créer un nouveau pays
  const createCountry = useCallback(async (countryData: Omit<EconomicCountry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('economic_countries')
        .insert(countryData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchCountries();
      return data;
    } catch (err) {
      console.error('Erreur lors de la création du pays:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchCountries]);

  // Mettre à jour un pays
  const updateCountry = useCallback(async (id: string, updates: Partial<EconomicCountry>) => {
    try {
      setError(null);

      // Enlever les champs read-only qui pourraient causer des problèmes
      const { created_at, updated_at, ...cleanUpdates } = updates as any;

      const { data, error: updateError } = await supabase
        .from('economic_countries')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Erreur Supabase:', updateError);
        throw updateError;
      }

      await fetchCountries();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du pays:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchCountries]);

  // Supprimer un pays
  const deleteCountry = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('economic_countries')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchCountries();
    } catch (err) {
      console.error('Erreur lors de la suppression du pays:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchCountries]);

  // Créer une nouvelle métrique régionale
  const createRegionalMetric = useCallback(async (metricData: Omit<RegionalMetric, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('regional_economic_metrics')
        .insert(metricData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchRegionalMetrics();
      return data;
    } catch (err) {
      console.error('Erreur lors de la création de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchRegionalMetrics]);

  // Mettre à jour une métrique régionale
  const updateRegionalMetric = useCallback(async (id: string, updates: Partial<RegionalMetric>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('regional_economic_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchRegionalMetrics();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchRegionalMetrics]);

  // Supprimer une métrique régionale
  const deleteRegionalMetric = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('regional_economic_metrics')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchRegionalMetrics();
    } catch (err) {
      console.error('Erreur lors de la suppression de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchRegionalMetrics]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchCountries();
    fetchRegionalMetrics();
  }, [fetchCountries, fetchRegionalMetrics]);

  // Fonctions utilitaires
  const getCountryById = useCallback((id: string) => {
    return countries.find(country => country.id === id);
  }, [countries]);

  const getMetricById = useCallback((id: string) => {
    return regionalMetrics.find(metric => metric.id === id);
  }, [regionalMetrics]);

  const getActiveCountries = useCallback(() => {
    return countries.filter(country => country.is_active);
  }, [countries]);

  const getActiveMetrics = useCallback(() => {
    return regionalMetrics.filter(metric => metric.is_active);
  }, [regionalMetrics]);

  // Calculer des statistiques agrégées
  const getRegionalStats = useCallback(() => {
    const activeCountries = getActiveCountries();
    
    if (activeCountries.length === 0) {
      return {
        averageGrowth: 0,
        averageInflation: 0,
        totalPopulation: 0,
        averageGdpPerCapita: 0
      };
    }

    const totalPopulationNum = activeCountries.reduce((sum, country) => {
      const pop = parseFloat(country.population.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(pop) ? 0 : pop);
    }, 0);

    return {
      averageGrowth: activeCountries.reduce((sum, c) => sum + c.gdp_growth_rate, 0) / activeCountries.length,
      averageInflation: activeCountries.reduce((sum, c) => sum + c.inflation_rate, 0) / activeCountries.length,
      totalPopulation: totalPopulationNum,
      averageGdpPerCapita: activeCountries.reduce((sum, c) => sum + c.gdp_per_capita, 0) / activeCountries.length
    };
  }, [getActiveCountries]);

  return {
    // Données
    countries,
    regionalMetrics,
    loading,
    error,

    // Actions CRUD pays
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,

    // Actions CRUD métriques régionales
    fetchRegionalMetrics,
    createRegionalMetric,
    updateRegionalMetric,
    deleteRegionalMetric,

    // Utilitaires
    getCountryById,
    getMetricById,
    getActiveCountries,
    getActiveMetrics,
    getRegionalStats,

    // Refresh général
    refresh: useCallback(() => {
      fetchCountries();
      fetchRegionalMetrics();
    }, [fetchCountries, fetchRegionalMetrics])
  };
}
