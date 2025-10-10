import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client creator for server-side routes
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[investment-data routes] Missing Supabase env vars. Please set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your .env/.env.local"
    );
  }
  return createClient(url, key);
}

// =====================================================
// ROUTES POUR LES CATÉGORIES D'INVESTISSEMENT
// =====================================================

// GET /api/investment-data/categories - Récupérer toutes les catégories
export const getInvestmentCategories: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;
    
    let query = supabase
      .from('investment_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/investment-data/categories - Créer une nouvelle catégorie
export const createInvestmentCategory: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const categoryData = req.body;
    
    const { data, error } = await supabase
      .from('investment_categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/investment-data/categories/:id - Mettre à jour une catégorie
export const updateInvestmentCategory: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('investment_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/investment-data/categories/:id - Supprimer une catégorie
export const deleteInvestmentCategory: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('investment_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// =====================================================
// ROUTES POUR LES OPPORTUNITÉS D'INVESTISSEMENT
// =====================================================

// GET /api/investment-data/opportunities - Récupérer toutes les opportunités
export const getInvestmentOpportunities: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active, is_featured, status } = req.query;
    
    let query = supabase
      .from('investment_opportunities')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured === 'true');
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des opportunités d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/investment-data/opportunities - Créer une nouvelle opportunité
export const createInvestmentOpportunity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const opportunityData = req.body;
    
    const { data, error } = await supabase
      .from('investment_opportunities')
      .insert([opportunityData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'opportunité d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/investment-data/opportunities/:id - Mettre à jour une opportunité
export const updateInvestmentOpportunity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('investment_opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'opportunité d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/investment-data/opportunities/:id - Supprimer une opportunité
export const deleteInvestmentOpportunity: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('investment_opportunities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'opportunité d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// =====================================================
// ROUTES POUR LES MÉTRIQUES D'INVESTISSEMENT
// =====================================================

// GET /api/investment-data/metrics - Récupérer toutes les métriques
export const getInvestmentMetrics: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;
    
    let query = supabase
      .from('investment_metrics')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/investment-data/metrics - Créer une nouvelle métrique
export const createInvestmentMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const metricData = req.body;
    
    const { data, error } = await supabase
      .from('investment_metrics')
      .insert([metricData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la métrique d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/investment-data/metrics/:id - Mettre à jour une métrique
export const updateInvestmentMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('investment_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la métrique d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/investment-data/metrics/:id - Supprimer une métrique
export const deleteInvestmentMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('investment_metrics')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la métrique d\'investissement:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// =====================================================
// ROUTES POUR LES TENDANCES DU MARCHÉ
// =====================================================

// GET /api/investment-data/trends - Récupérer toutes les tendances
export const getMarketTrends: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;
    
    let query = supabase
      .from('market_trends')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des tendances du marché:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/investment-data/trends - Créer une nouvelle tendance
export const createMarketTrend: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const trendData = req.body;
    
    const { data, error } = await supabase
      .from('market_trends')
      .insert([trendData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la tendance du marché:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/investment-data/trends/:id - Mettre à jour une tendance
export const updateMarketTrend: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('market_trends')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tendance du marché:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/investment-data/trends/:id - Supprimer une tendance
export const deleteMarketTrend: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('market_trends')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la tendance du marché:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};
