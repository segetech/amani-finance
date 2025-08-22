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
  price?: string | null;
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

      return ((indices ?? []) as BrvmIndex[]).map((i) => ({
        ...i,
        group: i.group_id ? groupById.get(i.group_id) ?? null : null,
        latest: latestByIndex.get(i.id) ?? null,
      }));
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

  return useMemo(
    () => ({
      loading,
      error,
      fetchGroups,
      fetchIndicesWithLatest,
      fetchPointsByIndex,
    }),
    [loading, error, fetchGroups, fetchIndicesWithLatest, fetchPointsByIndex]
  );
}
