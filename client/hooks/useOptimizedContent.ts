import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

// Cache pour les résolutions de slug vers UUID
const categorySlugCache = new Map<string, string>();

// Helper: strict UUID v4 detection
const isUUID = (value: string | undefined | null): boolean => {
  if (!value || typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

type ContentType = 'article' | 'podcast' | 'indice';
type ContentStatus = 'draft' | 'published' | 'archived';

interface UseOptimizedContentOptions {
  type: ContentType;
  status?: ContentStatus | 'all';
  limit?: number;
  offset?: number;
  category?: string;
  authorId?: string;
}

interface OptimizedContent {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  status: ContentStatus;
  category_id: string;
  country: string;
  tags?: string[];
  author_id: string;
  featured_image?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  likes: number;
  shares: number;
  category_info?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon?: string;
  };
}

export const useOptimizedContent = ({
  type,
  status = 'published',
  limit = 10,
  offset = 0,
  category,
  authorId
}: UseOptimizedContentOptions) => {
  const [content, setContent] = useState<OptimizedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number>(0);
  const [authReady, setAuthReady] = useState(false);
  const didInitialFetch = useRef(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Requête optimisée avec sélection minimale des champs
      let query = supabase
        .from('contents')
        .select(`
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
          shares,
          categories:content_categories!category_id(
            id,
            name,
            slug,
            color,
            icon
          )
        `, { count: 'exact' })
        .eq('type', type);

      // Appliquer les filtres
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      if (category) {
        let categoryId = category;
        if (!isUUID(category)) {
          // Vérifier le cache d'abord
          if (categorySlugCache.has(category)) {
            categoryId = categorySlugCache.get(category)!;
          } else {
            const { data: cat } = await supabase
              .from('content_categories')
              .select('id')
              .eq('slug', category)
              .single<{ id: string }>();
            
            if (cat?.id) {
              categoryId = cat.id;
              categorySlugCache.set(category, categoryId);
            } else {
              setContent([]);
              setCount(0);
              return [];
            }
          }
        }
        query = query.eq('category_id', categoryId);
      }
      
      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      // Exécuter la requête avec pagination optimisée
      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      const { data, error, count } = result;

      if (error) {
        setError(error as Error);
        setContent([]);
        setCount(0);
        return [];
      }

      if (!data || data.length === 0) {
        setContent([]);
        setCount(0);
        return [];
      }

      // Formatage optimisé des données
      const formattedData: OptimizedContent[] = (data as any[]).map((row: any) => {
        const { categories, ...content } = row;
        return {
          ...content,
          type: type,
          category_info: categories ? {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
            icon: categories.icon
          } : undefined
        };
      });

      setContent(formattedData);
      if (count !== null) setCount(count);
      return formattedData;
    } catch (err) {
      setError(err as Error);
      setContent([]);
      setCount(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, [type, status, limit, offset, category, authorId]);

  // Auth ready effect
  useEffect(() => {
    supabase.auth.getSession().then(() => setAuthReady(true));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setAuthReady(true);
    });
    return () => subscription?.unsubscribe();
  }, []);

  // Fetch effect
  useEffect(() => {
    if (!authReady) return;
    if (didInitialFetch.current) {
      fetchContent();
      return;
    }
    didInitialFetch.current = true;
    fetchContent();
  }, [authReady, fetchContent]);

  return {
    content,
    loading,
    error,
    count,
    refetch: fetchContent
  };
};
