import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type PublicBrvmIndex = {
  id: string;
  name: string;
  code?: string;
  unit?: string;
  latest?: {
    close: number;
    change_percent?: string;
    direction?: "up" | "down" | "neutral";
    created_at: string;
  };
};

export function usePublicBrvmIndices() {
  const [indices, setIndices] = useState<PublicBrvmIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPublicIndices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les indices publics avec leurs derniers points
      const { data: indices, error: indicesError } = await supabase
        .from("brvm_indices")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (indicesError) throw indicesError;

      if (!indices || indices.length === 0) {
        setIndices([]);
        setLastUpdate(new Date());
        return;
      }

      // Récupérer les derniers points pour chaque indice
      const indiceIds = indices.map(i => i.id);
      const { data: points, error: pointsError } = await supabase
        .from("brvm_index_points")
        .select("*")
        .in("indice_id", indiceIds)
        .order("created_at", { ascending: false });

      if (pointsError) throw pointsError;

      // Mapper les derniers points par indice
      const latestByIndex = new Map();
      for (const point of (points || [])) {
        if (!latestByIndex.has(point.indice_id)) {
          latestByIndex.set(point.indice_id, point);
        }
      }

      // Construire les données finales
      const publicIndices: PublicBrvmIndex[] = indices.map(indice => {
        const metadata = indice.metadata || {};
        const latestPoint = latestByIndex.get(indice.id);

        return {
          id: indice.id,
          name: indice.name,
          code: indice.code,
          unit: metadata.unit || "points",
          latest: latestPoint ? {
            close: Number(latestPoint.close) || 0,
            change_percent: latestPoint.change_percent,
            direction: latestPoint.direction || "neutral",
            created_at: latestPoint.created_at
          } : undefined
        };
      });

      setIndices(publicIndices);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error("[usePublicBrvmIndices] Error:", err);
      setError(err.message || "Erreur lors du chargement des indices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicIndices();
  }, [fetchPublicIndices]);

  const refresh = useCallback(() => {
    fetchPublicIndices();
  }, [fetchPublicIndices]);

  return {
    indices,
    loading,
    error,
    lastUpdate,
    refresh
  };
}
