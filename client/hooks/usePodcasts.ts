import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
 

export type PodcastStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface Podcast {
  id: string;
  type: 'podcast';
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  content: string | null;
  status: PodcastStatus;
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
  podcast_data?: {
    duration?: string;
    audio_url?: string;
    video_url?: string;
    host?: string;
    guests?: string[];
    episode_number?: number;
    season?: number;
    transcript?: string;
    cover_image?: string;
    audio_file?: string;
    plays?: number;
    downloads?: number;
    rating?: number;
  };
  author?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  categories?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
}

interface UsePodcastsOptions {
  status?: PodcastStatus | 'all';
  limit?: number;
  offset?: number;
  category?: string;
  authorId?: string;
}

export const usePodcasts = ({
  status = 'published',
  limit = 10,
  offset = 0,
  category,
  authorId
}: UsePodcastsOptions = {}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number>(0);
  // Attendre readiness auth pour éviter fetch à vide sous RLS
  const [authReady, setAuthReady] = useState(false);
  // Eviter double-fetch en StrictMode
  const didInitialFetch = useRef(false);

  const fetchPodcasts = useCallback(async () => {
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
          description,
          content,
          status,
          category_id,
          country,
          tags,
          author_id,
          featured_image,
          featured_image_alt,
          created_at,
          updated_at,
          published_at,
          views,
          likes,
          shares,
          read_time,
          podcast_data
        `, { count: 'exact' })
        .eq('type', 'podcast');

      // Appliquer les filtres
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      if (category) {
        query = query.eq('category_id', category);
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
        setPodcasts([]);
        setCount(0);
        return [];
      }

      if (!data || data.length === 0) {
        setPodcasts([]);
        setCount(0);
        return [];
      }

      // Formatage optimisé des données
      const formattedData: Podcast[] = data.map((item: any) => ({
        ...item,
        type: 'podcast' as const,
        author: {
          id: item.author_id,
          first_name: 'Animateur',
          last_name: 'Podcast',
          avatar_url: null
        },
        categories: {
          id: item.category_id,
          name: 'Catégorie Podcast',
          slug: 'podcast',
          color: '#8B5CF6'
        }
      }));

      setPodcasts(formattedData);
      if (count !== null) setCount(count);
      return formattedData;
    } catch (err) {
      console.error('💥 Erreur dans fetchPodcasts:', err);
      setError(err as Error);
      setPodcasts([]);
      setCount(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, [status, limit, offset, category, authorId]);

  // Auth readiness sans refetch automatique
  useEffect(() => {
    supabase.auth.getSession().then(() => setAuthReady(true));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setAuthReady(true);
    });
    return () => subscription?.unsubscribe();
  }, []);

  const fetchPodcastBySlug = useCallback(async (slug: string): Promise<Podcast> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contents')
        .select(`
          *,
          content_categories!inner(id, name, slug, color)
        `)
        .eq('slug', slug)
        .eq('type', 'podcast')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Podcast not found');
      
      // Format the response to match Podcast type
      const row = data as any;
      const { content_categories, ...restData } = row as any;
      const formattedData: Podcast = {
        ...(restData as Podcast),
        published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
        created_at: new Date(row.created_at).toISOString(),
        updated_at: new Date(row.updated_at).toISOString(),
        author: {
          id: row.author_id,
          first_name: 'Animateur',
          last_name: 'Podcast',
          avatar_url: null
        },
        categories: content_categories ? {
          id: content_categories.id,
          name: content_categories.name,
          slug: content_categories.slug,
          color: content_categories.color
        } : {
          id: row.category_id,
          name: 'Catégorie Podcast',
          slug: 'podcast',
          color: '#8B5CF6'
        }
      };

      return formattedData;
    } catch (err) {
      console.error('Error fetching podcast:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPodcast = useCallback(async (podcastData: Omit<Podcast, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'shares'>) => {
    try {
      console.log('🚀 Début création podcast:', podcastData);
      console.log('🔍 Type de podcastData:', typeof podcastData);
      console.log('🔍 Clés disponibles:', Object.keys(podcastData));
      console.log('🔍 Valeurs importantes:', {
        title: podcastData.title,
        category_id: podcastData.category_id,
        author_id: podcastData.author_id, 
        type: podcastData.type
      });
      setLoading(true);
      setError(null);
      
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }
      console.log('✅ Utilisateur connecté:', user.id);
      console.log('🔄 Continuons avec la création...');
      
      // Générer un slug si pas fourni
      const slug = podcastData.slug || podcastData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 200);
      
      console.log('🔧 Slug généré:', slug);
      
      // Vérifier que category_id est valide
      if (!podcastData.category_id) {
        console.warn('⚠️ Aucune catégorie fournie, utilisation de la catégorie par défaut');
      }
      
      // Résoudre la catégorie texte (schéma legacy) à partir de category_id si nécessaire
      let legacyCategoryText: string = 'general';
      try {
        if (podcastData.category_id) {
          const { data: catRow, error: catErr } = await supabase
            .from('content_categories')
            .select('slug')
            .eq('id', podcastData.category_id)
            .single();
          if (catErr) {
            console.warn('⚠️ Impossible de récupérer le slug de catégorie, fallback sur "general"', catErr);
          } else if (catRow && typeof (catRow as any).slug === 'string') {
            legacyCategoryText = (catRow as { slug: string }).slug;
          }
        }
      } catch (catLookupErr) {
        console.warn('⚠️ Erreur lors de la résolution du slug de catégorie, fallback sur "general"', catLookupErr);
        legacyCategoryText = 'general';
      }
      console.log('🏷️ Catégorie (legacy text) utilisée pour insertion:', legacyCategoryText);

      // Préparer les données du podcast (respecter Database[contents].Insert)
      const dbStatus: Database['public']['Tables']['contents']['Row']['status'] =
        (['draft', 'published', 'archived'] as const).includes(
          (podcastData.status as unknown as Database['public']['Tables']['contents']['Row']['status']) || 'draft'
        )
          ? ((podcastData.status as unknown) as Database['public']['Tables']['contents']['Row']['status'])
          : 'draft';

      const podcastToCreate: Database['public']['Tables']['contents']['Insert'] = {
        title: podcastData.title,
        slug: slug,
        summary: podcastData.summary,
        description: podcastData.description ?? undefined,
        content: podcastData.content ?? undefined,
        type: 'podcast',
        status: dbStatus,
        // `category` (legacy texte) + `category_id` (clé étrangère)
        category: legacyCategoryText,
        category_id: podcastData.category_id,
        country: podcastData.country || 'mali',
        tags: podcastData.tags || [],
        author_id: user.id,
        meta_title: podcastData.meta_title ?? undefined,
        meta_description: podcastData.meta_description ?? undefined,
        featured_image: podcastData.featured_image ?? undefined,
        featured_image_alt: podcastData.featured_image_alt ?? undefined,
        published_at: dbStatus === 'published' ? new Date().toISOString() : undefined,
        podcast_data: (podcastData as any).podcast_data ?? undefined
      };
      
      console.log('🔍 Validation des données avant insertion:');
      console.log('  - Title:', podcastToCreate.title);
      console.log('  - Slug:', podcastToCreate.slug);
      console.log('  - Category ID:', podcastToCreate.category_id);
      console.log('  - Author ID:', podcastToCreate.author_id);
      
      console.log('📝 Données podcast à insérer:', JSON.stringify(podcastToCreate, null, 2));
      
      // Insérer le podcast avec un garde-fou de timeout pour détecter un éventuel blocage
      const insertStart = Date.now();
      const insertPromise = supabase
        .from('contents')
        .insert<Database['public']['Tables']['contents']['Insert']>([
          podcastToCreate as Database['public']['Tables']['contents']['Insert']
        ])
        .select()
        .single();
      const timeoutMs = 15000; // 15s timeout
      let insertResult: any;
      try {
        insertResult = await Promise.race([
          insertPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error(`Insert timeout après ${timeoutMs} ms`)), timeoutMs))
        ]);
      } catch (e) {
        console.error('⏳ Timeout ou échec pendant l\'insertion:', e);
        throw e;
      }
      const insertDuration = Date.now() - insertStart;
      const { data, error } = insertResult || {};
      console.log(`📥 Insertion terminée en ${insertDuration} ms`, { hasData: !!data, hasError: !!error });

      console.log('📊 Réponse Supabase (podcast):', { data, error });
      
      if (error) {
        console.error('❌ Erreur Supabase (podcast):', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Aucune donnée retournée par Supabase');
      }
      
      // Formater la réponse
      const formattedPodcast: Podcast = {
        ...data,
        author: {
          id: data.author_id,
          first_name: 'Animateur',
          last_name: 'Podcast',
          avatar_url: null
        },
        categories: {
          id: data.category_id,
          name: 'Catégorie Podcast',
          slug: 'podcast',
          color: '#8B5CF6'
        }
      };
      
      // Rafraîchir la liste des podcasts (non bloquant pour éviter les blocages UI)
      console.log('🔄 Rafraîchissement liste podcasts (async, non bloquant)...');
      fetchPodcasts().then(() => console.log('🔃 Liste podcasts rafraîchie')).catch(err => console.error('⚠️ Erreur rafraîchissement podcasts:', err));
      
      console.log('✅ Podcast créé avec succès!');
      return formattedPodcast;
    } catch (err) {
      console.error('💥 Erreur création podcast:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPodcasts]);

  const updatePodcast = useCallback(async (id: string, updates: Partial<Podcast>) => {
    try {
      setLoading(true);
      
      // Préparer les données pour la mise à jour en excluant les champs non-DB
      const dbUpdates: any = { ...updates };
      
      // Supprimer les champs qui ne sont pas dans la table contents
      delete dbUpdates.author;
      delete dbUpdates.categories;
      delete dbUpdates.created_at; // Géré automatiquement
      delete dbUpdates.id; // fourni dans l'URL, pas dans payload
      // Champs non supportés par la table contents qui peuvent venir du formulaire
      delete (dbUpdates as any).article_data;
      delete (dbUpdates as any).indice_data;
      delete (dbUpdates as any).content_categories;
      
      // Convertir category slug en UUID si nécessaire
      if (dbUpdates.category_id && typeof dbUpdates.category_id === 'string') {
        // Vérifier si c'est un UUID valide (format: 8-4-4-4-12 caractères)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dbUpdates.category_id);
        if (!isUUID) {
          try {
            const { data: categoryData, error: catError } = await supabase
              .from('content_categories')
              .select('id')
              .eq('slug', dbUpdates.category_id)
              .single();
            
            if (catError) {
              console.error('❌ Erreur récupération catégorie:', catError);
              // Utiliser une catégorie par défaut ou supprimer le champ
              delete dbUpdates.category_id;
            } else if (categoryData) {
              dbUpdates.category_id = categoryData.id;
              console.log('✅ Catégorie convertie:', dbUpdates.category_id);
            }
          } catch (catErr) {
            console.error('❌ Erreur conversion catégorie:', catErr);
            delete dbUpdates.category_id;
          }
        }
      }
      
      // If status is being updated to published and published_at is not set
      if (dbUpdates.status === 'published' && !dbUpdates.published_at) {
        dbUpdates.published_at = new Date().toISOString();
      }
      // Normaliser published_at si fourni au format date-only
      if (dbUpdates.published_at && typeof dbUpdates.published_at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dbUpdates.published_at)) {
        dbUpdates.published_at = new Date(dbUpdates.published_at + 'T00:00:00.000Z').toISOString();
      }

      // Ne pas inclure updated_at car il est géré automatiquement par le trigger
      delete dbUpdates.updated_at;

      console.log('📝 Données podcast à mettre à jour:', JSON.stringify(dbUpdates, null, 2));

      // Vérifier que category_id est bien un UUID avant la mise à jour
      if (dbUpdates.category_id && typeof dbUpdates.category_id === 'string') {
        const isUUID = dbUpdates.category_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        if (!isUUID) {
          console.warn('⚠️ category_id n\'est pas un UUID valide:', dbUpdates.category_id);
          console.log('🔄 Tentative de conversion slug vers UUID...');
          // Ne pas supprimer, laisser la conversion slug->UUID se faire plus haut
        }
      }

      console.log('🔄 Envoi de la mise à jour vers Supabase...');
      
      const { data, error } = await supabase
        .from('contents')
        .update(dbUpdates)
        .eq('id', id)
        .select('*')
        .single();

      console.log('📊 Réponse Supabase:', { data, error });

      if (error) throw error;
      
      // Update local state
      setPodcasts(prev => 
        prev.map(podcast => 
          podcast.id === id ? { ...podcast, ...updates } : podcast
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating podcast:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePodcast = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setPodcasts(prev => prev.filter(podcast => podcast.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting podcast:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (didInitialFetch.current) {
      fetchPodcasts();
      return;
    }
    didInitialFetch.current = true;
    fetchPodcasts();
  }, [authReady, status, limit, offset, category, authorId, fetchPodcasts]);

  return {
    podcasts,
    loading,
    error,
    count,
    refetch: fetchPodcasts,
    fetchPodcastBySlug,
    createPodcast,
    updatePodcast,
    deletePodcast
  };
};
