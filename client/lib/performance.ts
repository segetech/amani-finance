// Configuration et utilitaires pour optimiser les performances

// Cache global pour les résolutions de slug vers UUID
export const globalCache = {
  categories: new Map<string, string>(),
  authors: new Map<string, any>(),
  
  // Méthodes pour gérer le cache
  getCategoryId: (slug: string): string | undefined => {
    return globalCache.categories.get(slug);
  },
  
  setCategoryId: (slug: string, id: string): void => {
    globalCache.categories.set(slug, id);
  },
  
  clearCache: (): void => {
    globalCache.categories.clear();
    globalCache.authors.clear();
  }
};

// Configuration des requêtes optimisées
export const QUERY_CONFIG = {
  // Champs minimaux pour les listes
  MINIMAL_CONTENT_FIELDS: `
    id,
    title,
    slug,
    summary,
    status,
    category_id,
    country,
    tags,
    author_id,
    featured_image,
    created_at,
    updated_at,
    published_at,
    views,
    likes,
    shares
  `,
  
  // Champs pour les catégories
  CATEGORY_FIELDS: `
    id,
    name,
    slug,
    color,
    icon
  `,
  
  // Pagination par défaut
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  
  // Timeout pour les requêtes
  QUERY_TIMEOUT: 10000, // 10 secondes
};

// Utilitaire pour débouncer les requêtes
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Utilitaire pour throttler les requêtes
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Helper pour mesurer les performances
export const measurePerformance = async <T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    if (duration > 1000) {
      console.warn(`⚠️ Opération lente détectée: ${name} (${duration.toFixed(2)}ms)`);
    }
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ Erreur dans ${name} après ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

// Configuration des index recommandés pour Supabase
export const RECOMMENDED_INDEXES = {
  contents: [
    'CREATE INDEX IF NOT EXISTS idx_contents_type_status ON contents(type, status);',
    'CREATE INDEX IF NOT EXISTS idx_contents_category_id ON contents(category_id);',
    'CREATE INDEX IF NOT EXISTS idx_contents_author_id ON contents(author_id);',
    'CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_contents_published_at ON contents(published_at DESC) WHERE published_at IS NOT NULL;'
  ],
  content_categories: [
    'CREATE INDEX IF NOT EXISTS idx_categories_slug ON content_categories(slug);',
    'CREATE INDEX IF NOT EXISTS idx_categories_active ON content_categories(is_active) WHERE is_active = true;'
  ]
};
