import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/database";

// Use the database type for consistency
export type StockIndex = Database["public"]["Tables"]["stock_indices"]["Row"];
export type StockIndexInsert = Database["public"]["Tables"]["stock_indices"]["Insert"];
export type StockIndexUpdate = Database["public"]["Tables"]["stock_indices"]["Update"];

export function useStockIndices() {
  const [indices, setIndices] = useState<StockIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await (supabase as any)
        .from('stock_indices')
        .select('*')
        .order('display_order', { ascending: true });

      if (err) throw err;
      setIndices(data || []);
    } catch (err: any) {
      console.error('[useStockIndices] Error:', err);
      setError(err.message || "Erreur lors du chargement des indices");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHomepageIndices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await (supabase as any)
        .from('stock_indices')
        .select('*')
        .eq('is_active', true)
        .eq('show_on_homepage', true)
        .order('display_order', { ascending: true });

      if (err) throw err;
      return data || [];
    } catch (err: any) {
      console.error('[useStockIndices] Error fetching homepage indices:', err);
      setError(err.message || "Erreur lors du chargement des indices");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createIndex = useCallback(async (indexData: Partial<StockIndexInsert>) => {
    try {
      const insertData: StockIndexInsert = {
        name: indexData.name!,
        symbol: indexData.symbol!,
        market: indexData.market || 'BRVM',
        country: indexData.country || 'Mali',
        current_value: indexData.current_value || null,
        previous_value: indexData.previous_value || null,
        change_amount: indexData.change_amount || null,
        change_percent: indexData.change_percent || null,
        unit: indexData.unit || 'points',
        currency: indexData.currency || 'XOF',
        description: indexData.description || null,
        show_on_homepage: indexData.show_on_homepage ?? true,
        is_active: indexData.is_active ?? true,
        display_order: indexData.display_order || 0
      };

      const { data, error: err } = await (supabase as any)
        .from('stock_indices')
        .insert(insertData)
        .select()
        .single();

      if (err) throw err;
      await fetchIndices(); // Recharger la liste
      return data;
    } catch (err: any) {
      console.error('[useStockIndices] Error creating index:', err);
      throw err;
    }
  }, [fetchIndices]);

  const updateIndex = useCallback(async (id: string, updates: StockIndexUpdate) => {
    try {
      // Calculer automatiquement les variations si les valeurs changent
      if (updates.current_value !== undefined && updates.previous_value !== undefined) {
        if (updates.previous_value && updates.previous_value !== 0) {
          updates.change_amount = updates.current_value - updates.previous_value;
          updates.change_percent = Number(((updates.change_amount / updates.previous_value) * 100).toFixed(2));
        }
      }

      // Note: last_updated is automatically handled by the database trigger

      const { data, error: err } = await (supabase as any)
        .from('stock_indices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      await fetchIndices(); // Recharger la liste
      return data;
    } catch (err: any) {
      console.error('[useStockIndices] Error updating index:', err);
      throw err;
    }
  }, [fetchIndices]);

  const deleteIndex = useCallback(async (id: string) => {
    try {
      const { error: err } = await (supabase as any)
        .from('stock_indices')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await fetchIndices(); // Recharger la liste
    } catch (err: any) {
      console.error('[useStockIndices] Error deleting index:', err);
      throw err;
    }
  }, [fetchIndices]);

  const updateValue = useCallback(async (id: string, newValue: number) => {
    try {
      // Récupérer la valeur actuelle pour la mettre en previous_value
      const { data: currentIndex } = await (supabase as any)
        .from('stock_indices')
        .select('current_value')
        .eq('id', id)
        .single();

      const updates: StockIndexUpdate = {
        previous_value: currentIndex?.current_value || 0,
        current_value: newValue
      };

      return await updateIndex(id, updates);
    } catch (err: any) {
      console.error('[useStockIndices] Error updating value:', err);
      throw err;
    }
  }, [updateIndex]);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  return {
    indices,
    loading,
    error,
    fetchIndices,
    fetchHomepageIndices,
    createIndex,
    updateIndex,
    deleteIndex,
    updateValue
  };
}
