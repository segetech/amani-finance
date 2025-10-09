import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';

// Fonction pour obtenir le client Supabase de manière lazy
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_SERVICE_ROLE_KEY dans votre fichier .env');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET /api/commodities - Récupérer toutes les matières premières
export const getCommodities: RequestHandler = async (req, res) => {
  try {
    const { 
      category, 
      is_active, 
      show_on_homepage, 
      limit, 
      offset 
    } = req.query;

    const supabase = getSupabaseClient();
    let query = supabase
      .from('commodities')
      .select('*');

    // Appliquer les filtres
    if (category) {
      query = query.eq('category', category);
    }
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    if (show_on_homepage !== undefined) {
      query = query.eq('show_on_homepage', show_on_homepage === 'true');
    }

    // Pagination
    if (limit) {
      query = query.limit(parseInt(limit as string));
    }
    
    if (offset) {
      const limitNum = parseInt(limit as string) || 10;
      const offsetNum = parseInt(offset as string);
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    // Tri par ordre d'affichage puis par nom
    query = query.order('display_order', { ascending: true })
                 .order('name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des matières premières:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des matières premières'
    });
  }
};

// GET /api/commodities/:id - Récupérer une matière première par ID
export const getCommodityById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('commodities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Matière première non trouvée'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la matière première:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de la matière première'
    });
  }
};

// POST /api/commodities - Créer une nouvelle matière première
export const createCommodity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const commodityData = req.body;

    // Validation des champs obligatoires
    if (!commodityData.name || !commodityData.symbol || !commodityData.current_price || !commodityData.unit) {
      return res.status(400).json({
        success: false,
        error: 'Les champs name, symbol, current_price et unit sont obligatoires'
      });
    }

    // Calculer automatiquement les variations si previous_price est fourni
    if (commodityData.previous_price && commodityData.current_price) {
      commodityData.change_amount = commodityData.current_price - commodityData.previous_price;
      commodityData.change_percent = ((commodityData.change_amount / commodityData.previous_price) * 100);
    }

    const { data, error } = await supabase
      .from('commodities')
      .insert(commodityData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({
          success: false,
          error: 'Une matière première avec ce symbole existe déjà'
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Matière première créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la matière première:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création de la matière première'
    });
  }
};

// PUT /api/commodities/:id - Mettre à jour une matière première
export const updateCommodity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;

    // Calculer automatiquement les variations si les prix sont modifiés
    if (updates.current_price && updates.previous_price) {
      updates.change_amount = updates.current_price - updates.previous_price;
      updates.change_percent = ((updates.change_amount / updates.previous_price) * 100);
    }

    const { data, error } = await supabase
      .from('commodities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Matière première non trouvée'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data,
      message: 'Matière première mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la matière première:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour de la matière première'
    });
  }
};

// DELETE /api/commodities/:id - Supprimer une matière première
export const deleteCommodity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('commodities')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Matière première supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la matière première:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression de la matière première'
    });
  }
};

// GET /api/commodities/categories - Récupérer les catégories disponibles
export const getCommodityCategories: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('commodities')
      .select('category')
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    // Extraire les catégories uniques
    const categories = [...new Set(data?.map(item => item.category) || [])];

    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};

// POST /api/commodities/bulk-update - Mise à jour en lot des prix
export const bulkUpdateCommodities: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre updates doit être un tableau'
      });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { id, ...updateData } = update;

        // Calculer automatiquement les variations si nécessaire
        if (updateData.current_price && updateData.previous_price) {
          updateData.change_amount = updateData.current_price - updateData.previous_price;
          updateData.change_percent = ((updateData.change_amount / updateData.previous_price) * 100);
        }

        const { data, error } = await supabase
          .from('commodities')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          errors.push({ id, error: error.message });
        } else {
          results.push(data);
        }
      } catch (error) {
        errors.push({ id: update.id, error: (error as Error).message });
      }
    }

    res.json({
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} matières premières mises à jour${errors.length > 0 ? `, ${errors.length} erreurs` : ''}`
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour en lot:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour en lot'
    });
  }
};
