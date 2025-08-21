import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  content_types: string[];
  created_at: string;
  updated_at: string;
}

export const useContentCategories = () => {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer toutes les catégories
  const fetchCategories = useCallback(async (activeOnly = true) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('content_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (err) {
      console.error('Erreur récupération catégories:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle catégorie
  const createCategory = useCallback(async (categoryData: Omit<ContentCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content_categories')
        .insert(categoryData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erreur création catégorie:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une catégorie
  const updateCategory = useCallback(async (id: string, updates: Partial<ContentCategory>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content_categories')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...data } : cat)
      );
      
      return data;
    } catch (err) {
      console.error('Erreur mise à jour catégorie:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une catégorie
  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('content_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Erreur suppression catégorie:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer une catégorie par slug
  const getCategoryBySlug = useCallback(async (slug: string): Promise<ContentCategory | null> => {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Pas trouvé
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Erreur récupération catégorie par slug:', err);
      return null;
    }
  }, []);

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug
  };
};
