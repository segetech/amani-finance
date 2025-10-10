import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';

// Fonction pour obtenir le client Supabase côté serveur (lazy)
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Variables d'environnement Supabase manquantes. Définissez SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY) dans votre fichier .env/.env.local"
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

// GET /api/economic-data/countries - Récupérer tous les pays
export const getEconomicCountries: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active, limit } = req.query;

    let query = supabase
      .from('economic_countries')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

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
    console.error('Erreur lors de la récupération des pays:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des pays'
    });
  }
};

// GET /api/economic-data/countries/:id - Récupérer un pays par ID
export const getEconomicCountryById: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('economic_countries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Pays non trouvé'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du pays:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération du pays'
    });
  }
};

// POST /api/economic-data/countries - Créer un nouveau pays
export const createEconomicCountry: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const countryData = req.body;

    // Validation des champs obligatoires
    const requiredFields = ['name', 'flag_emoji', 'currency', 'population', 'gdp_growth_rate', 'inflation_rate', 'unemployment_rate', 'gdp_per_capita'];
    const missingFields = requiredFields.filter(field => !countryData[field] && countryData[field] !== 0);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Champs obligatoires manquants: ${missingFields.join(', ')}`
      });
    }

    const { data, error } = await supabase
      .from('economic_countries')
      .insert(countryData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({
          success: false,
          error: 'Un pays avec ce nom existe déjà'
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Pays créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du pays:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création du pays'
    });
  }
};

// PUT /api/economic-data/countries/:id - Mettre à jour un pays
export const updateEconomicCountry: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('economic_countries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Pays non trouvé'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data,
      message: 'Pays mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pays:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour du pays'
    });
  }
};

// DELETE /api/economic-data/countries/:id - Supprimer un pays
export const deleteEconomicCountry: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('economic_countries')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Pays supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du pays:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression du pays'
    });
  }
};

// GET /api/economic-data/metrics - Récupérer toutes les métriques régionales
export const getRegionalMetrics: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;

    let query = supabase
      .from('regional_economic_metrics')
      .select('*')
      .order('display_order', { ascending: true });

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

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
    console.error('Erreur lors de la récupération des métriques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des métriques'
    });
  }
};

// POST /api/economic-data/metrics - Créer une nouvelle métrique régionale
export const createRegionalMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const metricData = req.body;

    // Validation des champs obligatoires
    const requiredFields = ['metric_name', 'metric_value', 'icon_name'];
    const missingFields = requiredFields.filter(field => !metricData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Champs obligatoires manquants: ${missingFields.join(', ')}`
      });
    }

    const { data, error } = await supabase
      .from('regional_economic_metrics')
      .insert(metricData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        return res.status(409).json({
          success: false,
          error: 'Une métrique avec ce nom existe déjà'
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Métrique créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la métrique:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création de la métrique'
    });
  }
};

// PUT /api/economic-data/metrics/:id - Mettre à jour une métrique régionale
export const updateRegionalMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('regional_economic_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Métrique non trouvée'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data,
      message: 'Métrique mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la métrique:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la mise à jour de la métrique'
    });
  }
};

// DELETE /api/economic-data/metrics/:id - Supprimer une métrique régionale
export const deleteRegionalMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;

    const { error } = await supabase
      .from('regional_economic_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Métrique supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la métrique:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la suppression de la métrique'
    });
  }
};
