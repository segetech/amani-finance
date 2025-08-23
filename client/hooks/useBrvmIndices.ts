import { useCallback, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export type BrvmIndexGroup = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BrvmIndex = {
  id: string;
  slug: string;
  name: string;
  code?: string | null;
  description?: string | null;
  group_id: string | null;
  country?: string | null;
  currency?: string | null;
  unit?: string | null;
  frequency?: string | null;
  source?: string | null;
  methodology?: string | null;
  is_public?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type BrvmIndexPoint = {
  id: string;
  indice_id: string;
  close?: number | string | null;
  change_percent?: string | null;
  ytd_percent?: string | null;
  direction?: "up" | "down" | "neutral" | string | null;
  as_of?: string | null; // date
  meta?: Record<string, any> | null;
  created_at?: string;
};

export type BrvmIndexWithLatest = BrvmIndex & {
  group?: BrvmIndexGroup | null;
  latest?: BrvmIndexPoint | null;
};

export function useBrvmIndices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async (): Promise<BrvmIndexGroup[]> => {
    setError(null);
    const { data, error } = await supabase
      .from("brvm_index_groups")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []) as BrvmIndexGroup[];
  }, []);

  // Fetch indices with latest points (manual join for stability)
  const fetchIndicesWithLatest = useCallback(async (): Promise<BrvmIndexWithLatest[]> => {
    setLoading(true);
    setError(null);
    try {
      // Fallback: manual join of indices + latest points (max as_of)
      const { data: indices, error: e1 } = await supabase
        .from("brvm_indices")
        .select("*")
        .order("name", { ascending: true });
      if (e1) throw e1;

      const ids = ((indices ?? []) as BrvmIndex[]).map((i) => i.id);
      if (!ids.length) return [];

      // For latest per index, we can select by index_id and order/as_of desc with distinct on not supported; fetch limited and map client-side
      const { data: points, error: e2 } = await supabase
        .from("brvm_index_points")
        .select("*")
        .in("indice_id", ids);
      if (e2) throw e2;

      const latestByIndex = new Map<string, BrvmIndexPoint>();
      for (const p of (points ?? []) as BrvmIndexPoint[]) {
        const current = latestByIndex.get(p.indice_id);
        if (!current) {
          latestByIndex.set(p.indice_id, p);
        } else {
          const pc = (p.created_at ? Date.parse(p.created_at) : 0);
          const cc = (current.created_at ? Date.parse(current.created_at) : 0);
          if (pc >= cc) latestByIndex.set(p.indice_id, p);
        }
      }

      // Fetch groups for mapping
      const { data: groups, error: e3 } = await supabase
        .from("brvm_index_groups")
        .select("*");
      if (e3) throw e3;
      const groupById = new Map<string, BrvmIndexGroup>(
        ((groups ?? []) as BrvmIndexGroup[]).map((g) => [g.id, g])
      );

      return ((indices ?? []) as any[]).map((raw) => {
        const meta = (raw?.metadata ?? {}) as Record<string, any>;
        const i: BrvmIndex = {
          id: raw.id,
          slug: raw.slug,
          name: raw.name,
          code: raw.code ?? null,
          description: raw.description ?? null,
          group_id: raw.group_id ?? null,
          country: meta.country ?? null,
          currency: meta.currency ?? null,
          unit: meta.unit ?? null,
          frequency: meta.frequency ?? null,
          source: meta.source ?? null,
          methodology: meta.methodology ?? null,
          is_public: (raw.is_active ?? true) as boolean,
          created_at: raw.created_at,
          updated_at: raw.updated_at,
        };
        return {
          ...i,
          group: i.group_id ? groupById.get(i.group_id) ?? null : null,
          latest: latestByIndex.get(i.id) ?? null,
        };
      });
    } catch (e: any) {
      console.error("[useBrvmIndices] fetchIndicesWithLatest error", e);
      setError(e.message || "Erreur de chargement des indices");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPointsByIndex = useCallback(async (indexId: string, { limit = 100 }: { limit?: number } = {}) => {
    setError(null);
    const { data, error } = await supabase
      .from("brvm_index_points")
      .select("*")
      .eq("indice_id", indexId)
      .limit(limit);
    if (error) throw error;
    const arr = (data ?? []) as BrvmIndexPoint[];
    arr.sort((a, b) => {
      const ad = a.created_at ? Date.parse(a.created_at) : 0;
      const bd = b.created_at ? Date.parse(b.created_at) : 0;
      return bd - ad;
    });
    return arr;
  }, []);

  // CRUD: Groups
  const createGroup = useCallback(async (payload: Pick<BrvmIndexGroup, "slug" | "name"> & Partial<BrvmIndexGroup>) => {
    setError(null);
    const { data, error } = await supabase
      .from("brvm_index_groups")
      .insert([{ slug: payload.slug, name: payload.name, description: payload.description ?? null }])
      .select()
      .single();
    if (error) throw error;
    return data as BrvmIndexGroup;
  }, []);

  const updateGroup = useCallback(async (id: string, patch: Partial<BrvmIndexGroup>) => {
    setError(null);
    const { data, error } = await supabase
      .from("brvm_index_groups")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as BrvmIndexGroup;
  }, []);

  const deleteGroup = useCallback(async (id: string) => {
    setError(null);
    const { error } = await supabase
      .from("brvm_index_groups")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }, []);

  // CRUD: Indices
  const createIndex = useCallback(async (payload: Pick<BrvmIndex, "slug" | "name"> & Partial<BrvmIndex>) => {
    setError(null);
    const metadata: Record<string, any> = {
      country: payload.country ?? undefined,
      currency: payload.currency ?? undefined,
      unit: payload.unit ?? undefined,
      frequency: payload.frequency ?? undefined,
      source: payload.source ?? undefined,
      methodology: payload.methodology ?? undefined,
      // description can be stored in metadata if needed
      description: payload.description ?? undefined,
    };
    // Remove undefined keys
    Object.keys(metadata).forEach((k) => metadata[k] === undefined && delete metadata[k]);

    const { data, error } = await supabase
      .from("brvm_indices")
      .insert([{
        slug: payload.slug,
        name: payload.name,
        code: payload.code ?? null,
        group_id: payload.group_id ?? null,
        metadata: Object.keys(metadata).length ? metadata : undefined,
        is_active: payload.is_public ?? true,
      }])
      .select()
      .single();
    if (error) throw error;
    // Map back metadata to BrvmIndex shape
    const raw: any = data;
    const meta = (raw?.metadata ?? {}) as Record<string, any>;
    const mapped: BrvmIndex = {
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      code: raw.code ?? null,
      description: meta.description ?? null,
      group_id: raw.group_id ?? null,
      country: meta.country ?? null,
      currency: meta.currency ?? null,
      unit: meta.unit ?? null,
      frequency: meta.frequency ?? null,
      source: meta.source ?? null,
      methodology: meta.methodology ?? null,
      is_public: (raw.is_active ?? true) as boolean,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    };
    return mapped;
  }, []);

  const updateIndex = useCallback(async (id: string, patch: Partial<BrvmIndex>) => {
    setError(null);
    const { data, error } = await supabase
      .from("brvm_indices")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as BrvmIndex;
  }, []);

  const deleteIndex = useCallback(async (id: string) => {
    setError(null);
    const { error } = await supabase
      .from("brvm_indices")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }, []);

  // Add a point to an index
  const addPoint = useCallback(async (
    indice_id: string,
    payload: { close: number | string; created_at?: string | null }
  ) => {
    setError(null);
    // Basic validation/coercion
    const uuidRe = /^[0-9a-fA-F-]{36}$/;
    if (!uuidRe.test(indice_id)) {
      const msg = "Indice_id invalide (UUID attendu)";
      setError(msg);
      throw new Error(msg);
    }
    const closeNum = typeof payload.close === 'string' ? Number(payload.close) : payload.close;
    if (Number.isNaN(closeNum)) {
      const msg = "Valeur 'close' invalide";
      setError(msg);
      throw new Error(msg);
    }
    const row: Record<string, any> = { indice_id, close: closeNum };
    if (payload.created_at) row.created_at = payload.created_at;
    const { data, error } = await supabase
      .from("brvm_index_points")
      .insert([row])
      .select()
      .single();
    if (error) throw error;
    return data as BrvmIndexPoint;
  }, []);

  return useMemo(
    () => ({
      loading,
      error,
      fetchGroups,
      fetchIndicesWithLatest,
      fetchPointsByIndex,
      createGroup,
      updateGroup,
      deleteGroup,
      createIndex,
      updateIndex,
      deleteIndex,
      addPoint,
    }),
    [loading, error, fetchGroups, fetchIndicesWithLatest, fetchPointsByIndex, createGroup, updateGroup, deleteGroup, createIndex, updateIndex, deleteIndex, addPoint]
  );
}
