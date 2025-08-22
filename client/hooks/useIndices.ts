import { useCallback, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

// Unified contents schema supports type = 'indice' with indice_data JSONB
// This hook exposes CRUD for economic indices.

export type Indice = {
  id: string;
  type: 'indice';
  title: string; // mapped from name in UI
  slug: string;
  summary: string; // short description
  description?: string;
  status: 'draft' | 'published' | 'archived';
  category_id: string;
  author_id: string;
  country?: string;
  tags?: string[];
  featured_image?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null; // yyyy-MM-dd for form consumption
  views: number;
  likes: number;
  shares: number;
  read_time?: number | null;
  // index specific data
  indice_data?: {
    code?: string;
    unit?: string;
    frequency?: 'real-time' | 'daily' | 'weekly' | 'monthly' | string;
    currency?: string;
    source?: string;
    methodology?: string;
    historicalNote?: string;
    isPublic?: boolean;
    currentValue?: string;
    previousValue?: string;
    changePercent?: string;
    changeDirection?: 'up' | 'down' | 'neutral' | string;
    lastUpdated?: string; // yyyy-MM-dd
    // Additional fields for homepage tables
    ytdPercent?: string; // Variation 31 décembre (%)
    group?: string; // e.g., "indices", "indices-sectoriels-nouveaux", "indices-sectoriels-anciens"
  } | null;
};

export type CreateIndiceInput = {
  name: string;
  code: string;
  summary: string;
  description?: string;
  status: 'draft' | 'published';
  categorySlug?: string; // provide a valid categories.slug when possible
  country?: string;
  tags?: string[];
  isPublic?: boolean;
  unit?: string;
  frequency?: 'real-time' | 'daily' | 'weekly' | 'monthly' | string;
  currency?: string;
  source?: string;
  methodology?: string;
  historicalNote?: string;
  currentValue: string;
  previousValue?: string;
  changePercent?: string;
  changeDirection?: 'up' | 'down' | 'neutral' | string;
  lastUpdated?: string; // yyyy-MM-dd
  publishDate?: string; // yyyy-MM-dd
  // Optional extras for grouped table rendering
  ytdPercent?: string;
  group?: string;
};

export type UpdateIndiceInput = Partial<CreateIndiceInput> & {
  name?: string;
};

const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Ensure Supabase auth/session is ready before performing queries (avoids RLS-empty results on first render)
async function awaitAuthReady() {
  try {
    await supabase.auth.getSession();
  } catch (e) {
    // Non-fatal; continue anyway
  }
}

async function resolveCategoryIdBySlug(categorySlug?: string): Promise<string> {
  // Fallback to 'economie' if not provided or not found
  const desired = categorySlug || 'economie';
  // First attempt: categories.slug
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', desired)
      .maybeSingle<{ id: string; slug: string }>();
    if (error) throw error;
    if (data?.id) {
      console.debug('[resolveCategoryIdBySlug] hit categories.slug', { desired, id: data.id });
      return data.id;
    }
  } catch (e: any) {
    // If slug column doesn't exist (42703) or bad request, try by name
    if (e?.code === '42703' || e?.message?.includes('does not exist')) {
      const byName = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', desired)
        .maybeSingle<{ id: string; name: string }>();
      if (byName.data?.id) {
        console.debug('[resolveCategoryIdBySlug] hit categories.name', { desired, id: byName.data.id });
        return byName.data.id;
      }
      // Try legacy table: content_categories.slug then name
      const byLegacySlug = await supabase
        .from('content_categories')
        .select('id, slug')
        .eq('slug', desired)
        .maybeSingle<{ id: string; slug: string }>();
      if (byLegacySlug.data?.id) {
        console.debug('[resolveCategoryIdBySlug] hit content_categories.slug', { desired, id: byLegacySlug.data.id });
        return byLegacySlug.data.id;
      }
      const byLegacyName = await supabase
        .from('content_categories')
        .select('id, name')
        .eq('name', desired)
        .maybeSingle<{ id: string; name: string }>();
      if (byLegacyName.data?.id) {
        console.debug('[resolveCategoryIdBySlug] hit content_categories.name', { desired, id: byLegacyName.data.id });
        return byLegacyName.data.id;
      }
    } else {
      // Other errors should bubble up later if no fallback works
      console.warn('[resolveCategoryIdBySlug] slug lookup failed:', e);
    }
  }

  // Final fallback: try content_categories first
  const fallbackContentCat = await supabase
    .from('content_categories')
    .select('id')
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (fallbackContentCat.data?.id) {
    console.debug('[resolveCategoryIdBySlug] fallback content_categories first row', { id: fallbackContentCat.data.id });
    return fallbackContentCat.data.id;
  }

  // As a last resort, try categories
  const fallback = await supabase
    .from('categories')
    .select('id')
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (fallback.data?.id) {
    console.debug('[resolveCategoryIdBySlug] fallback categories first row', { id: fallback.data.id });
    return fallback.data.id;
  }
  throw new Error('No category available to assign to indice. Please seed at least one row in content_categories or categories (e.g., slug "economie").');
}

export function useIndices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // List indices with optional filters
  const fetchIndices = useCallback(
    async (opts?: { status?: 'draft' | 'published' | 'archived'; search?: string; limit?: number; offset?: number }) => {
      setLoading(true);
      setError(null);
      try {
        await awaitAuthReady();
        let query = supabase
          .from('contents')
          .select('*')
          .eq('type', 'indice');

        if (opts?.status) query = query.eq('status', opts.status);
        if (opts?.search) {
          // simple ILIKE on title or summary
          query = query.or(`title.ilike.%${opts.search}%,summary.ilike.%${opts.search}%`);
        }
        if (typeof opts?.limit === 'number') query = query.limit(opts.limit);
        if (typeof opts?.offset === 'number') query = query.range(opts.offset, (opts.offset || 0) + (opts.limit || 20) - 1);

        const { data, error } = await query.order('updated_at', { ascending: false });
        if (error) throw error;

        const items: Indice[] = (data || []).map((row: any) => ({
          ...(row as any),
          type: 'indice',
          // Normalize date-only for published_at for form controls
          published_at: row.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : null,
        }));
        return items;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchIndiceById = useCallback(async (id: string): Promise<Indice> => {
    setLoading(true);
    setError(null);
    try {
      await awaitAuthReady();
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('id', id)
        .eq('type', 'indice')
        .single();
      if (error) throw error;
      if (!data) throw new Error('Indice not found');
      const row: any = data;
      const formatted: Indice = {
        ...(row as any),
        type: 'indice',
        published_at: row.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : null,
      };
      return formatted;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIndiceBySlug = useCallback(async (slug: string): Promise<Indice> => {
    setLoading(true);
    setError(null);
    try {
      await awaitAuthReady();
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'indice')
        .single();
      if (error) throw error;
      if (!data) throw new Error('Indice not found');
      const row: any = data;
      const formatted: Indice = {
        ...(row as any),
        type: 'indice',
        published_at: row.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : null,
      };
      return formatted;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIndiceByIdOrSlug = useCallback(async (idOrSlug: string) => {
    return isUUID(idOrSlug) ? fetchIndiceById(idOrSlug) : fetchIndiceBySlug(idOrSlug);
  }, [fetchIndiceById, fetchIndiceBySlug]);

  const createIndice = useCallback(async (input: CreateIndiceInput) => {
    setLoading(true);
    setError(null);
    try {
      await awaitAuthReady();
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      if (!userId) throw new Error('Utilisateur non authentifié');

      const slug = slugify(input.name);
      const category_id = await resolveCategoryIdBySlug(input.categorySlug);
      console.debug('[useIndices.createIndice] resolved category_id', { desired: input.categorySlug || 'economie', category_id });

      const insertPayload: any = {
        type: 'indice',
        title: input.name,
        slug,
        summary: input.summary,
        description: input.description || null,
        status: input.status,
        // Legacy text column kept NOT NULL in schema; store the slug as a simple label
        category: input.categorySlug || 'economie',
        category_id,
        author_id: userId,
        country: input.country || 'mali',
        tags: input.tags || [],
        published_at: input.status === 'published' && input.publishDate ? new Date(input.publishDate).toISOString() : null,
        indice_data: {
          code: input.code,
          unit: input.unit,
          frequency: input.frequency,
          currency: input.currency,
          source: input.source,
          methodology: input.methodology,
          historicalNote: input.historicalNote,
          isPublic: input.isPublic ?? true,
          currentValue: input.currentValue,
          previousValue: input.previousValue,
          changePercent: input.changePercent,
          changeDirection: input.changeDirection ?? 'neutral',
          lastUpdated: input.lastUpdated || new Date().toISOString().slice(0, 10),
          ytdPercent: input.ytdPercent,
          group: input.group,
        },
      };
      console.debug('[useIndices.createIndice] insert payload', insertPayload);

      const { data, error } = await supabase.from('contents').insert(insertPayload).select('*').single();
      if (error) {
        console.error('[useIndices.createIndice] insert error', error);
        // Improve common hints
        if (error.code === '42501') {
          // insufficient_privilege under Postgres => likely RLS
          throw new Error('Insert blocked by RLS or permissions. Ensure an insert policy exists on table contents for authenticated users.');
        }
        if (/(column|relation)/i.test(error.message)) {
          throw new Error(`Schema mismatch: ${error.message}`);
        }
        throw error;
      }
      return data as Indice;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIndice = useCallback(async (id: string, updates: UpdateIndiceInput) => {
    setLoading(true);
    setError(null);
    try {
      await awaitAuthReady();
      // fetch existing to merge indice_data properly
      const existing = await fetchIndiceById(id);

      const nextSlug = updates.name ? slugify(updates.name) : existing.slug;
      const category_id = updates.categorySlug
        ? await resolveCategoryIdBySlug(updates.categorySlug)
        : existing.category_id;

      const nextIndiceData = {
        ...(existing.indice_data || {}),
        code: updates.code ?? existing.indice_data?.code,
        unit: updates.unit ?? existing.indice_data?.unit,
        frequency: updates.frequency ?? existing.indice_data?.frequency,
        currency: updates.currency ?? existing.indice_data?.currency,
        source: updates.source ?? existing.indice_data?.source,
        methodology: updates.methodology ?? existing.indice_data?.methodology,
        historicalNote: updates.historicalNote ?? existing.indice_data?.historicalNote,
        isPublic: updates.isPublic ?? existing.indice_data?.isPublic ?? true,
        currentValue: updates.currentValue ?? existing.indice_data?.currentValue,
        previousValue: updates.previousValue ?? existing.indice_data?.previousValue,
        changePercent: updates.changePercent ?? existing.indice_data?.changePercent,
        changeDirection: updates.changeDirection ?? (existing.indice_data?.changeDirection as any) ?? 'neutral',
        lastUpdated: updates.lastUpdated ?? existing.indice_data?.lastUpdated ?? new Date().toISOString().slice(0, 10),
      };

      const payload: any = {
        title: updates.name ?? existing.title,
        slug: nextSlug,
        summary: updates.summary ?? existing.summary,
        description: updates.description ?? existing.description,
        status: updates.status ?? existing.status,
        // Keep legacy text column coherent with chosen slug (or previous value)
        category: updates.categorySlug ?? (existing as any).category ?? 'economie',
        category_id,
        country: updates.country ?? existing.country,
        tags: updates.tags ?? existing.tags,
        published_at:
          (updates.status ?? existing.status) === 'published'
            ? (updates.publishDate
                ? new Date(updates.publishDate).toISOString()
                : existing.published_at
                  ? new Date(existing.published_at).toISOString()
                  : new Date().toISOString())
            : null,
        indice_data: nextIndiceData,
      };

      const { data, error } = await supabase
        .from('contents')
        .update(payload)
        .eq('id', id)
        .eq('type', 'indice')
        .select('*')
        .single();
      if (error) throw error;
      return data as Indice;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchIndiceById]);

  const deleteIndice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await awaitAuthReady();
      const { error } = await supabase.from('contents').delete().eq('id', id).eq('type', 'indice');
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      loading,
      error,
      fetchIndices,
      fetchIndiceById,
      fetchIndiceBySlug,
      fetchIndiceByIdOrSlug,
      createIndice,
      updateIndice,
      deleteIndice,
    }),
    [loading, error, fetchIndices, fetchIndiceById, fetchIndiceBySlug, fetchIndiceByIdOrSlug, createIndice, updateIndice, deleteIndice],
  );
}
