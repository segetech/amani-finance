import { supabase } from '@/lib/supabase';

type Article = {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  author_id: string;
  cover_image?: string;
  excerpt?: string;
  category_id?: string;
};

export const fetchArticles = async (status: 'draft' | 'published' | 'all' = 'published') => {
  let query = supabase
    .from('articles')
    .select('*');

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return data as Article[];
};

export const fetchArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }

  return data as Article;
};

export const createArticle = async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data as Article;
};

export const updateArticle = async (id: string, updates: Partial<Article>) => {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    throw error;
  }

  return data as Article;
};

export const deleteArticle = async (id: string) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw error;
  }

  return true;
};
