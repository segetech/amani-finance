import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  type: 'article';
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  content: string | null;
  status: ArticleStatus;
  category: string;
  country: string;
  tags?: string[];
  author_id: string;
  meta_title?: string | null;
  meta_description?: string | null;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  likes: number;
  shares: number;
  read_time?: number | null;
  author?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface UseArticlesOptions {
  status?: ArticleStatus | 'all';
  limit?: number;
  offset?: number;
  category?: string;
  authorId?: string;
}

export const useArticles = ({
  status = 'published',
  limit = 10,
  offset = 0,
  category,
  authorId
}: UseArticlesOptions = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number>(0);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('contents')
        .select('*', { count: 'exact' })
        .eq('type', 'article');

      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      const { data, error: queryError, count } = await query
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (queryError) throw queryError;

      setArticles(data || []);
      if (count !== null) setCount(count);
      return data || [];
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [status, limit, offset, category, authorId]);

  const fetchArticleBySlug = useCallback(async (slug: string): Promise<Article | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'article')
        .single();

      if (error) throw error;
      
      // Update view count
      if (data) {
        await supabase.rpc('increment_views', { row_id: data.id });
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createArticle = useCallback(async (articleData: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'shares'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contents')
        .insert([{
          ...articleData,
          id: uuidv4(),
          type: 'article',
          status: articleData.status || 'draft',
          published_at: articleData.status === 'published' ? new Date().toISOString() : null,
          read_time: articleData.content ? Math.ceil(articleData.content.split(/\s+/).length / 200) : 5
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchArticles();
      return data;
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchArticles]);

  const updateArticle = useCallback(async (id: string, updates: Partial<Article>) => {
    try {
      setLoading(true);
      
      if (updates.status === 'published' && !updates.published_at) {
        updates.published_at = new Date().toISOString();
      }
      
      if (updates.content) {
        updates.read_time = Math.ceil(updates.content.split(/\s+/).length / 200);
      }

      const { data, error } = await supabase
        .from('contents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setArticles(prev => 
        prev.map(article => 
          article.id === id ? { ...article, ...updates } : article
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(prev => prev.filter(article => article.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    count,
    refetch: fetchArticles,
    fetchArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle
  };
};
