import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface IndustrialSector {
  id: string;
  name: string;
  description?: string;
  icon_name: string;
  color: string;
  production_value?: number;
  production_unit: string;
  growth_rate?: number;
  employment_count?: number;
  investment_amount?: number;
  investment_unit: string;
  efficiency_improvement?: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface IndustrialCompany {
  id: string;
  name: string;
  sector_id?: string;
  sector_name?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  country?: string;
  city?: string;
  founded_year?: number;
  employee_count?: number;
  revenue_amount?: number;
  revenue_unit: string;
  growth_rate?: number;
  market_cap?: number;
  market_cap_unit: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface IndustrialMetric {
  id: string;
  metric_name: string;
  metric_value: string;
  metric_unit?: string;
  description?: string;
  icon_name: string;
  color: string;
  change_value?: string;
  change_description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface IndustrialDataFilters {
  is_active?: boolean;
  is_featured?: boolean;
}

export function useIndustrialData(filters: IndustrialDataFilters = {}) {
  const [sectors, setSectors] = useState<IndustrialSector[]>([]);
  const [companies, setCompanies] = useState<IndustrialCompany[]>([]);
  const [metrics, setMetrics] = useState<IndustrialMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les secteurs industriels
  const fetchSectors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('industrial_sectors')
        .select('*')
        .order('display_order', { ascending: true });

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setSectors(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des secteurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  }, [filters.is_active]);

  // Récupérer les entreprises industrielles
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('industrial_companies')
        .select('*')
        .order('display_order', { ascending: true });

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setCompanies(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des entreprises:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  }, [filters.is_active, filters.is_featured]);

  // Récupérer les métriques industrielles
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('industrial_metrics')
        .select('*')
        .order('display_order', { ascending: true });

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setMetrics(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des métriques:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  }, [filters.is_active]);

  // Créer un secteur
  const createSector = useCallback(async (sectorData: Omit<IndustrialSector, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('industrial_sectors')
        .insert([sectorData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchSectors();
      return data;
    } catch (err) {
      console.error('Erreur lors de la création du secteur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchSectors]);

  // Mettre à jour un secteur
  const updateSector = useCallback(async (id: string, updates: Partial<IndustrialSector>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('industrial_sectors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchSectors();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du secteur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchSectors]);

  // Supprimer un secteur
  const deleteSector = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('industrial_sectors')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchSectors();
    } catch (err) {
      console.error('Erreur lors de la suppression du secteur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchSectors]);

  // Créer une entreprise
  const createCompany = useCallback(async (companyData: Omit<IndustrialCompany, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('industrial_companies')
        .insert([companyData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchCompanies();
      return data;
    } catch (err) {
      console.error('Erreur lors de la création de l\'entreprise:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchCompanies]);

  // Mettre à jour une entreprise
  const updateCompany = useCallback(async (id: string, updates: Partial<IndustrialCompany>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('industrial_companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchCompanies();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchCompanies]);

  // Supprimer une entreprise
  const deleteCompany = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('industrial_companies')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchCompanies();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'entreprise:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchCompanies]);

  // Créer une métrique
  const createMetric = useCallback(async (metricData: Omit<IndustrialMetric, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('industrial_metrics')
        .insert([metricData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchMetrics();
      return data;
    } catch (err) {
      console.error('Erreur lors de la création de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchMetrics]);

  // Mettre à jour une métrique
  const updateMetric = useCallback(async (id: string, updates: Partial<IndustrialMetric>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('industrial_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchMetrics();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchMetrics]);

  // Supprimer une métrique
  const deleteMetric = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('industrial_metrics')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchMetrics();
    } catch (err) {
      console.error('Erreur lors de la suppression de la métrique:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchMetrics]);

  // Actualiser toutes les données
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchSectors(),
      fetchCompanies(),
      fetchMetrics()
    ]);
  }, [fetchSectors, fetchCompanies, fetchMetrics]);

  // Charger les données au montage
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    // Données
    sectors,
    companies,
    metrics,
    loading,
    error,
    
    // Actions secteurs
    fetchSectors,
    createSector,
    updateSector,
    deleteSector,
    
    // Actions entreprises
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    
    // Actions métriques
    fetchMetrics,
    createMetric,
    updateMetric,
    deleteMetric,
    
    // Utilitaires
    refresh
  };
}
