import { useState, useEffect } from 'react';

// Types pour les données d'investissement
export interface InvestmentCategory {
  id: string;
  name: string;
  description?: string;
  icon_name: string;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  category_name: string;
  description: string;
  risk_level: 'Faible' | 'Modéré' | 'Élevé';
  expected_return_min: number;
  expected_return_max: number;
  min_investment_amount: number;
  min_investment_unit: string;
  time_horizon_min: number;
  time_horizon_max: number;
  status: 'Ouvert' | 'Bientôt' | 'Fermé';
  funded_percentage: number;
  image_url?: string;
  highlights: string[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentMetric {
  id: string;
  metric_name: string;
  metric_value: string;
  metric_unit?: string;
  change_value?: string;
  change_description?: string;
  description?: string;
  icon_name: string;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MarketTrend {
  id: string;
  title: string;
  growth_percentage: string;
  description: string;
  icon_name: string;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface UseInvestmentDataOptions {
  is_active?: boolean;
  is_featured?: boolean;
  status?: string;
}

interface UseInvestmentDataReturn {
  // Data
  categories: InvestmentCategory[];
  opportunities: InvestmentOpportunity[];
  metrics: InvestmentMetric[];
  trends: MarketTrend[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // CRUD operations for categories
  createCategory: (data: Omit<InvestmentCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<InvestmentCategory>;
  updateCategory: (id: string, data: Partial<InvestmentCategory>) => Promise<InvestmentCategory>;
  deleteCategory: (id: string) => Promise<void>;
  
  // CRUD operations for opportunities
  createOpportunity: (data: Omit<InvestmentOpportunity, 'id' | 'created_at' | 'updated_at'>) => Promise<InvestmentOpportunity>;
  updateOpportunity: (id: string, data: Partial<InvestmentOpportunity>) => Promise<InvestmentOpportunity>;
  deleteOpportunity: (id: string) => Promise<void>;
  
  // CRUD operations for metrics
  createMetric: (data: Omit<InvestmentMetric, 'id' | 'created_at' | 'updated_at'>) => Promise<InvestmentMetric>;
  updateMetric: (id: string, data: Partial<InvestmentMetric>) => Promise<InvestmentMetric>;
  deleteMetric: (id: string) => Promise<void>;
  
  // CRUD operations for trends
  createTrend: (data: Omit<MarketTrend, 'id' | 'created_at' | 'updated_at'>) => Promise<MarketTrend>;
  updateTrend: (id: string, data: Partial<MarketTrend>) => Promise<MarketTrend>;
  deleteTrend: (id: string) => Promise<void>;
  
  // Utility functions
  refresh: () => Promise<void>;
}

export const useInvestmentData = (options: UseInvestmentDataOptions = {}): UseInvestmentDataReturn => {
  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [metrics, setMetrics] = useState<InvestmentMetric[]>([]);
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction utilitaire pour construire les paramètres de requête
  const buildQueryParams = (additionalParams: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    
    if (options.is_active !== undefined) {
      params.append('is_active', options.is_active.toString());
    }
    if (options.is_featured !== undefined) {
      params.append('is_featured', options.is_featured.toString());
    }
    if (options.status) {
      params.append('status', options.status);
    }
    
    // Ajouter les paramètres supplémentaires
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/investment-data/categories?${queryParams}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Erreur fetchCategories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour récupérer les opportunités
  const fetchOpportunities = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/investment-data/opportunities?${queryParams}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des opportunités');
      const data = await response.json();
      setOpportunities(data);
    } catch (err) {
      console.error('Erreur fetchOpportunities:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour récupérer les métriques
  const fetchMetrics = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/investment-data/metrics?${queryParams}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Erreur fetchMetrics:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour récupérer les tendances
  const fetchTrends = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/investment-data/trends?${queryParams}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des tendances');
      const data = await response.json();
      setTrends(data);
    } catch (err) {
      console.error('Erreur fetchTrends:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Fonction pour rafraîchir toutes les données
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchCategories(),
        fetchOpportunities(),
        fetchMetrics(),
        fetchTrends()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du rafraîchissement');
    } finally {
      setLoading(false);
    }
  };

  // CRUD pour les catégories
  const createCategory = async (data: Omit<InvestmentCategory, 'id' | 'created_at' | 'updated_at'>): Promise<InvestmentCategory> => {
    const response = await fetch('/api/investment-data/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la catégorie');
    const newCategory = await response.json();
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = async (id: string, data: Partial<InvestmentCategory>): Promise<InvestmentCategory> => {
    const response = await fetch(`/api/investment-data/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la catégorie');
    const updatedCategory = await response.json();
    setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
    return updatedCategory;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const response = await fetch(`/api/investment-data/categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la catégorie');
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  // CRUD pour les opportunités
  const createOpportunity = async (data: Omit<InvestmentOpportunity, 'id' | 'created_at' | 'updated_at'>): Promise<InvestmentOpportunity> => {
    const response = await fetch('/api/investment-data/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'opportunité');
    const newOpportunity = await response.json();
    setOpportunities(prev => [...prev, newOpportunity]);
    return newOpportunity;
  };

  const updateOpportunity = async (id: string, data: Partial<InvestmentOpportunity>): Promise<InvestmentOpportunity> => {
    const response = await fetch(`/api/investment-data/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'opportunité');
    const updatedOpportunity = await response.json();
    setOpportunities(prev => prev.map(opp => opp.id === id ? updatedOpportunity : opp));
    return updatedOpportunity;
  };

  const deleteOpportunity = async (id: string): Promise<void> => {
    const response = await fetch(`/api/investment-data/opportunities/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'opportunité');
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  // CRUD pour les métriques
  const createMetric = async (data: Omit<InvestmentMetric, 'id' | 'created_at' | 'updated_at'>): Promise<InvestmentMetric> => {
    const response = await fetch('/api/investment-data/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la métrique');
    const newMetric = await response.json();
    setMetrics(prev => [...prev, newMetric]);
    return newMetric;
  };

  const updateMetric = async (id: string, data: Partial<InvestmentMetric>): Promise<InvestmentMetric> => {
    const response = await fetch(`/api/investment-data/metrics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la métrique');
    const updatedMetric = await response.json();
    setMetrics(prev => prev.map(metric => metric.id === id ? updatedMetric : metric));
    return updatedMetric;
  };

  const deleteMetric = async (id: string): Promise<void> => {
    const response = await fetch(`/api/investment-data/metrics/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la métrique');
    setMetrics(prev => prev.filter(metric => metric.id !== id));
  };

  // CRUD pour les tendances
  const createTrend = async (data: Omit<MarketTrend, 'id' | 'created_at' | 'updated_at'>): Promise<MarketTrend> => {
    const response = await fetch('/api/investment-data/trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la tendance');
    const newTrend = await response.json();
    setTrends(prev => [...prev, newTrend]);
    return newTrend;
  };

  const updateTrend = async (id: string, data: Partial<MarketTrend>): Promise<MarketTrend> => {
    const response = await fetch(`/api/investment-data/trends/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la tendance');
    const updatedTrend = await response.json();
    setTrends(prev => prev.map(trend => trend.id === id ? updatedTrend : trend));
    return updatedTrend;
  };

  const deleteTrend = async (id: string): Promise<void> => {
    const response = await fetch(`/api/investment-data/trends/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la tendance');
    setTrends(prev => prev.filter(trend => trend.id !== id));
  };

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    refresh();
  }, [options.is_active, options.is_featured, options.status]);

  return {
    // Data
    categories,
    opportunities,
    metrics,
    trends,
    
    // Loading states
    loading,
    error,
    
    // CRUD operations
    createCategory,
    updateCategory,
    deleteCategory,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    createMetric,
    updateMetric,
    deleteMetric,
    createTrend,
    updateTrend,
    deleteTrend,
    
    // Utility functions
    refresh
  };
};
