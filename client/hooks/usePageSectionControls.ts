import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface PageSectionControl {
  id: string;
  page_name: string;
  section_name: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PageSectionControlsFilters {
  page_name?: string;
}

export function usePageSectionControls(filters: PageSectionControlsFilters = {}) {
  const [controls, setControls] = useState<PageSectionControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les contrôles
  const fetchControls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('page_section_controls')
        .select('*')
        .order('display_order', { ascending: true });

      if (filters.page_name) {
        query = query.eq('page_name', filters.page_name);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setControls(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des contrôles:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  }, [filters.page_name]);

  // Mettre à jour un contrôle
  const updateControl = useCallback(async (id: string, updates: Partial<PageSectionControl>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('page_section_controls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchControls();
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du contrôle:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchControls]);

  // Basculer la visibilité d'une section
  const toggleSectionVisibility = useCallback(async (sectionName: string, pageName: string = 'economie') => {
    try {
      const control = controls.find(c => c.section_name === sectionName && c.page_name === pageName);
      if (!control) {
        throw new Error('Contrôle de section non trouvé');
      }

      await updateControl(control.id, { is_visible: !control.is_visible });
    } catch (err) {
      console.error('Erreur lors du basculement de visibilité:', err);
      throw err;
    }
  }, [controls, updateControl]);

  // Vérifier si une section est visible
  const isSectionVisible = useCallback((sectionName: string, pageName: string = 'economie') => {
    const control = controls.find(c => c.section_name === sectionName && c.page_name === pageName);
    return control?.is_visible ?? true; // Par défaut visible si pas de contrôle
  }, [controls]);

  // Charger les données au montage
  useEffect(() => {
    fetchControls();
  }, [fetchControls]);

  return {
    controls,
    loading,
    error,
    fetchControls,
    updateControl,
    toggleSectionVisibility,
    isSectionVisible,
    refresh: fetchControls
  };
}
