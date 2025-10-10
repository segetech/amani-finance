import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client creator for server-side routes
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[industrial-data routes] Missing Supabase env vars. Please set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your .env/.env.local"
    );
  }
  return createClient(url, key);
}

// GET /api/industrial-data/sectors - Récupérer tous les secteurs industriels
export const getIndustrialSectors: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;
    
    let query = supabase
      .from('industrial_sectors')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des secteurs industriels:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/industrial-data/sectors - Créer un nouveau secteur industriel
export const createIndustrialSector: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const sectorData = req.body;
    
    const { data, error } = await supabase
      .from('industrial_sectors')
      .insert([sectorData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création du secteur industriel:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/industrial-data/sectors/:id - Mettre à jour un secteur industriel
export const updateIndustrialSector: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('industrial_sectors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Secteur industriel non trouvé' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du secteur industriel:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/industrial-data/sectors/:id - Supprimer un secteur industriel
export const deleteIndustrialSector: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('industrial_sectors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du secteur industriel:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// GET /api/industrial-data/companies - Récupérer toutes les entreprises industrielles
export const getIndustrialCompanies: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active, is_featured } = req.query;
    
    let query = supabase
      .from('industrial_companies')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    if (is_featured !== undefined) {
      query = query.eq('is_featured', is_featured === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises industrielles:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/industrial-data/companies - Créer une nouvelle entreprise industrielle
export const createIndustrialCompany: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const companyData = req.body;
    
    const { data, error } = await supabase
      .from('industrial_companies')
      .insert([companyData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'entreprise industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/industrial-data/companies/:id - Mettre à jour une entreprise industrielle
export const updateIndustrialCompany: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('industrial_companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Entreprise industrielle non trouvée' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/industrial-data/companies/:id - Supprimer une entreprise industrielle
export const deleteIndustrialCompany: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('industrial_companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// GET /api/industrial-data/metrics - Récupérer toutes les métriques industrielles
export const getIndustrialMetrics: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { is_active } = req.query;
    
    let query = supabase
      .from('industrial_metrics')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques industrielles:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// POST /api/industrial-data/metrics - Créer une nouvelle métrique industrielle
export const createIndustrialMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const metricData = req.body;
    
    const { data, error } = await supabase
      .from('industrial_metrics')
      .insert([metricData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la métrique industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// PUT /api/industrial-data/metrics/:id - Mettre à jour une métrique industrielle
export const updateIndustrialMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('industrial_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Métrique industrielle non trouvée' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la métrique industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};

// DELETE /api/industrial-data/metrics/:id - Supprimer une métrique industrielle
export const deleteIndustrialMetric: RequestHandler = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { id } = req.params;
    
    const { error } = await supabase
      .from('industrial_metrics')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la métrique industrielle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
};
