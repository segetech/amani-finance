import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Commodity {
  id: string;
  name: string;
  symbol: string;
  category: string;
  subcategory?: string;
  current_price: number;
  previous_price: number;
  change_amount: number;
  change_percent: number;
  unit: string;
  currency: string;
  market?: string;
  contract_month?: string;
  volume?: number;
  open_interest?: number;
  daily_high?: number;
  daily_low?: number;
  is_active: boolean;
  show_on_homepage: boolean;
  display_order: number;
  description?: string;
  country_origin?: string;
  season_info?: string;
  image_url?: string;
  icon?: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface CommodityFilters {
  category?: string;
  is_active?: boolean;
  show_on_homepage?: boolean;
  limit?: number;
  offset?: number;
}

export function useCommodities(filters: CommodityFilters = {}) {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommodities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('commodities')
        .select('*');

      // Appliquer les filtres
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      
      if (filters.show_on_homepage !== undefined) {
        query = query.eq('show_on_homepage', filters.show_on_homepage);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      // Tri par ordre d'affichage puis par nom
      query = query.order('display_order', { ascending: true })
                   .order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setCommodities(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des matières premières:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.is_active, filters.show_on_homepage, filters.limit, filters.offset]);

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    fetchCommodities();
  }, [fetchCommodities]);

  // Fonction pour obtenir les matières premières par catégorie
  const getCommoditiesByCategory = useCallback(() => {
    const categories: Record<string, Commodity[]> = {};
    
    commodities.forEach(commodity => {
      if (!categories[commodity.category]) {
        categories[commodity.category] = [];
      }
      categories[commodity.category].push(commodity);
    });

    return categories;
  }, [commodities]);

  // Fonction pour obtenir les principales matières premières (homepage)
  const getMainCommodities = useCallback(() => {
    return commodities.filter(commodity => commodity.show_on_homepage && commodity.is_active);
  }, [commodities]);

  // Fonction pour obtenir les catégories disponibles
  const getCategories = useCallback(() => {
    const categories = [...new Set(commodities.map(c => c.category))];
    return categories.sort();
  }, [commodities]);

  // Fonction pour mettre à jour une matière première (admin)
  const updateCommodity = useCallback(async (id: string, updates: Partial<Commodity>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('commodities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mettre à jour l'état local
      setCommodities(prev => 
        prev.map(commodity => 
          commodity.id === id ? { ...commodity, ...data } : commodity
        )
      );

      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour créer une nouvelle matière première (admin)
  const createCommodity = useCallback(async (commodityData: Omit<Commodity, 'id' | 'created_at' | 'updated_at' | 'last_updated'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('commodities')
        .insert(commodityData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ajouter à l'état local
      setCommodities(prev => [...prev, data]);

      return data;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(err instanceof Error ? err.message : 'Erreur de création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour supprimer une matière première (admin)
  const deleteCommodity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('commodities')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Supprimer de l'état local
      setCommodities(prev => prev.filter(commodity => commodity.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    commodities,
    loading,
    error,
    fetchCommodities,
    getCommoditiesByCategory,
    getMainCommodities,
    getCategories,
    updateCommodity,
    createCommodity,
    deleteCommodity,
  };
}
