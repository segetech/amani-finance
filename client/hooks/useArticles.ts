import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Helper: strict UUID v4 detection
const isUUID = (value: string | undefined | null): boolean => {
  if (!value || typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export type ArticleStatus = 'draft' | 'published' | 'archived' | 'review';

// Type for a row returned from the `contents` table
type ContentRow = {
  id: string;
  type: 'article' | 'podcast' | 'indice';
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  content: string | null;
  status: ArticleStatus;
  category_id: string;
  country: string;
  tags?: string[] | null;
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
  article_data?: Record<string, any> | null;
};

export interface Article {
  id: string;
  type: 'article';
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  content: string | null;
  status: ArticleStatus;
  category_id: string;
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
  article_data?: Record<string, any>;
  author?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role: "admin" | "editor" | "analyst" | "moderator" | "subscriber";
    permissions: string[];
    organization?: string;
    country?: string;
    phone?: string;
    location?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    preferences?: Record<string, any>;
    created_at: string;
    updated_at: string;
    last_login?: string;
    is_active: boolean;
  };
  category_info?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    icon?: string;
    parent_id?: string;
    sort_order: number;
    is_active: boolean;
    content_types: ("article" | "podcast" | "indice")[];
  };
  comment_count: number;
  is_liked_by_user?: boolean;
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
      console.log('📥 Début récupération articles...', { status, limit, offset, category, authorId });
      setLoading(true);
      setError(null);
      
      // Requête avec jointures pour author et category
      console.log('🔗 Requête avec jointures profiles et content_categories...');

      let query = supabase
        .from('contents')
        .select(`
          *,
          categories:content_categories!category_id(
            id,
            name,
            slug,
            description,
            color,
            icon,
            parent_id,
            sort_order,
            is_active,
            content_types
          )
        `, { count: 'planned' })
        .eq('type', 'article');

      console.log('🎯 Filtres appliqués:');
      
      if (status !== 'all') {
        console.log('  - Status:', status);
        query = query.eq('status', status);
      } else {
        console.log('  - Status: tous');
      }
      
      if (category) {
        console.log('  - Catégorie (input):', category);
        let categoryId = category;
        // Si ce n'est pas un UUID, on suppose un slug et on le résout
        if (!isUUID(category)) {
          const { data: cat, error: catErr } = await supabase
            .from('content_categories')
            .select('id')
            .eq('slug', category)
            .single<{ id: string }>();
          if (cat?.id) {
            categoryId = cat.id;
            console.log('    -> Slug résolu en UUID:', categoryId);
          } else {
            console.warn('    -> Slug introuvable, aucun résultat ne sera retourné');
            // UUID impossible pour forcer 0 résultat
            categoryId = '00000000-0000-0000-0000-000000000000';
          }
        }
        query = query.eq('category_id', categoryId);
      }
      
      if (authorId) {
        console.log('  - Auteur:', authorId);
        query = query.eq('author_id', authorId);
      }

      console.log('🚀 Exécution de la requête...');
      
      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      console.log('🔍 Résultat brut de Supabase:', result);
      const { data, error, count } = result;

      console.log('📊 Résultat requête:', { 
        dataLength: data?.length || 0, 
        error: error?.message || 'Aucune erreur', 
        count,
        firstItem: data?.[0]?.title || 'Aucun'
      });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        setError(error as Error);
        setArticles([]);
        setCount(0);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Aucun article trouvé');
        setArticles([]);
        setCount(0);
        return [];
      }

      console.log('🔄 Formatage des données...');
      const formattedData: Article[] = (data as any[]).map((row: any) => {
        const { categories, ...content } = row || {};
        const article: Article = {
          ...(content as any),
          type: 'article',
          // author: undefined for now (no FK relationship to join)
          category_info: categories ? {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            color: categories.color,
            icon: categories.icon,
            parent_id: categories.parent_id,
            sort_order: categories.sort_order || 0,
            is_active: categories.is_active ?? true,
            content_types: categories.content_types || ['article']
          } : undefined,
          comment_count: 0,
          is_liked_by_user: false
        };
        return article;
      });

      console.log('✅ Articles récupérés avec succès:', formattedData.length);
      setArticles(formattedData);
      if (count !== null) setCount(count);
      return formattedData;
    } catch (err) {
      console.error('💥 Erreur dans fetchArticles:', err);
      setError(err as Error);
      setArticles([]);
      setCount(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, [status, limit, offset, category, authorId]);

  const fetchArticleBySlug = useCallback(async (slug: string): Promise<Article> => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('contents')
        .select(`
          *,
          categories:content_categories!category_id(
            id,
            name,
            slug,
            description,
            color,
            icon,
            parent_id,
            sort_order,
            is_active,
            content_types
          )
        `)
        .eq('slug', slug)
        .eq('type', 'article')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Article not found');

      const { categories, ...content } = (data as any);

      const formattedData: Article = {
        ...(content as any),
        type: 'article',
        published_at: content.published_at ? new Date(content.published_at).toISOString() : null,
        created_at: new Date(content.created_at).toISOString(),
        updated_at: new Date(content.updated_at).toISOString(),
        // author left as-is (no FK join available yet)
        author: {
          id: content.author_id,
          email: 'author@example.com',
          first_name: 'Auteur',
          last_name: 'Test',
          avatar_url: undefined,
          role: 'editor' as const,
          permissions: ['create_content', 'edit_content'],
          organization: undefined,
          country: undefined,
          phone: undefined,
          location: undefined,
          bio: undefined,
          website: undefined,
          linkedin: undefined,
          twitter: undefined,
          preferences: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: undefined,
          is_active: true
        },
        category_info: categories ? {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          color: categories.color,
          icon: categories.icon,
          parent_id: categories.parent_id,
          sort_order: categories.sort_order || 0,
          is_active: categories.is_active ?? true,
          content_types: categories.content_types || ['article']
        } : undefined,
        comment_count: 0,
        is_liked_by_user: false
      };

      return formattedData;
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createArticle = useCallback(async (articleData: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'shares' | 'comment_count' | 'is_liked_by_user'>) => {
    try {
      console.log('🚀 Début création article:', articleData);
      setLoading(true);
      setError(null);
      
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }
      console.log('✅ Utilisateur connecté:', user.id);
      
      // Générer un slug si pas fourni
      const slug = articleData.slug || articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 200);
      
      // Résoudre category_id et le slug de catégorie (pour colonne legacy `category` non NULL)
      let categoryIdToUse = articleData.category_id;
      let categorySlugToUse = articleData.category_id as string;
      if (categoryIdToUse && typeof categoryIdToUse === 'string') {
        if (!isUUID(categoryIdToUse)) {
          // Input est un slug -> récupérer l'id
          const { data: catRes, error: catErr } = await supabase
            .from('content_categories')
            .select('id, slug')
            .eq('slug', categoryIdToUse)
            .single<{ id: string; slug: string }>();
          if (catErr) {
            console.warn('⚠️ Erreur résolution slug catégorie:', catErr.message);
          }
          if (catRes?.id) {
            categoryIdToUse = catRes.id;
            categorySlugToUse = catRes.slug;
            console.log('    -> Slug de catégorie résolu en UUID:', categoryIdToUse);
          } else {
            throw new Error(`Catégorie introuvable pour le slug: ${categoryIdToUse}`);
          }
        } else {
          // Input ressemble à un UUID -> récupérer le slug pour la colonne legacy
          const { data: catSlugRes } = await supabase
            .from('content_categories')
            .select('slug')
            .eq('id', categoryIdToUse)
            .single<{ slug: string }>();
          if (catSlugRes?.slug) {
            categorySlugToUse = catSlugRes.slug;
          }
        }
      }

      // Préparer les données de l'article
      const articleToCreate = {
        title: articleData.title,
        slug: slug,
        summary: articleData.summary,
        description: articleData.description || null,
        content: articleData.content || null,
        type: 'article' as const,
        status: articleData.status || 'draft',
        category_id: categoryIdToUse,
        // Colonne legacy encore NOT NULL dans la DB distante
        category: categorySlugToUse,
        country: articleData.country || 'mali',
        tags: articleData.tags || [],
        author_id: user.id,
        meta_title: articleData.meta_title || null,
        meta_description: articleData.meta_description || null,
        featured_image: articleData.featured_image || null,
        featured_image_alt: articleData.featured_image_alt || null,
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
        article_data: articleData.article_data || {}
      };
      
      console.log('📝 Données à insérer:', JSON.stringify(articleToCreate, null, 2));
      
      // Insérer l'article
      const { data, error } = await supabase
        .from('contents')
        .insert([articleToCreate])
        .select('*')
        .single();

      console.log('📊 Réponse Supabase:', { data, error });
      
      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Aucune donnée retournée par Supabase');
      }
      
      // Formater la réponse sans relations
      const content = data as unknown as ContentRow;
      const formattedArticle: Article = {
        ...(content as any),
        type: 'article',
        author: undefined,
        category_info: undefined,
        comment_count: 0,
        is_liked_by_user: false
      };
      
      // Rafraîchir la liste des articles
      console.log('🔄 Rafraîchissement liste...');
      await fetchArticles();
      
      console.log('✅ Article créé avec succès!');
      return formattedArticle;
    } catch (err) {
      console.error('💥 Erreur création article:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchArticles]);

  const updateArticle = useCallback(async (id: string, updates: Partial<Article>) => {
    try {
      setLoading(true);
      
      // Préparer les données pour la mise à jour en excluant les champs non-DB
      const dbUpdates: any = { ...updates };
      
      // Supprimer les champs qui ne sont pas dans la table contents
      delete dbUpdates.author;
      delete dbUpdates.category_info;
      delete dbUpdates.comment_count;
      delete dbUpdates.is_liked_by_user;
      delete dbUpdates.created_at; // Géré automatiquement
      
      // Convertir un éventuel slug de catégorie en UUID et renseigner la colonne legacy `category`
      if (dbUpdates.category_id && typeof dbUpdates.category_id === 'string') {
        if (!isUUID(dbUpdates.category_id)) {
          // Input est un slug
          const { data: categoryData } = await supabase
            .from('content_categories')
            .select('id, slug')
            .eq('slug', dbUpdates.category_id)
            .single();
          if (categoryData?.id) {
            dbUpdates.category_id = categoryData.id;
            dbUpdates.category = categoryData.slug; // legacy column
          }
        } else {
          // Input est un UUID -> chercher le slug pour mettre à jour la colonne legacy
          const { data: categoryData } = await supabase
            .from('content_categories')
            .select('slug')
            .eq('id', dbUpdates.category_id)
            .single();
          if (categoryData?.slug) {
            dbUpdates.category = categoryData.slug;
          }
        }
      }
      
      // If status is being updated to published and published_at is not set
      if (dbUpdates.status === 'published' && !dbUpdates.published_at) {
        dbUpdates.published_at = new Date().toISOString();
      }
      
      // Calculate read time if content is being updated
      if (dbUpdates.content) {
        dbUpdates.read_time = Math.ceil(dbUpdates.content.split(/\s+/).length / 200);
      }

      // Ne pas inclure updated_at car il est géré automatiquement par le trigger
      delete dbUpdates.updated_at;

      console.log('📝 Données article à mettre à jour:', JSON.stringify(dbUpdates, null, 2));

      const { data, error } = await supabase
        .from('contents')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
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
      
      // Update local state
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
  }, [status, limit, offset, category, authorId]);

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
