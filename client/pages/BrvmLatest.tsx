import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = {
  code: string | null;
  name: string | null;
  latest_close: number | null;
  latest_change: number | null;
  latest_change_percent: number | null;
  latest_at: string | null;
};

export default function BrvmLatest() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("brvm_indices_latest")
          .select("code,name,latest_close,latest_change,latest_change_percent,latest_at")
          .order("name", { ascending: true });
        if (error) throw error;
        setRows((data ?? []) as Row[]);
      } catch (e: any) {
        setError(e.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
        <h1 className="text-2xl font-bold text-amani-primary mb-4">BRVM — Derniers points</h1>
        {loading && <div className="text-gray-600">Chargement…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Nom</th>
                  <th className="py-2 pr-4">Dernier</th>
                  <th className="py-2 pr-4">Variation</th>
                  <th className="py-2 pr-4">% Var</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const isPos = (r.latest_change ?? 0) >= 0;
                  return (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 pr-4 font-mono text-xs">{r.code ?? "-"}</td>
                      <td className="py-2 pr-4">{r.name ?? "-"}</td>
                      <td className="py-2 pr-4">{r.latest_close ?? "-"}</td>
                      <td className={`py-2 pr-4 ${isPos ? "text-green-600" : "text-red-600"}`}>
                        {r.latest_change ?? "-"}
                      </td>
                      <td className="py-2 pr-4">{r.latest_change_percent ?? "-"}%</td>
                      <td className="py-2 pr-4 text-xs text-gray-500">{r.latest_at ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
