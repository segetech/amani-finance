import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useBrvmIndices, BrvmIndexWithLatest, BrvmIndexGroup } from "../hooks/useBrvmIndices";
import { BarChart3, TrendingDown, TrendingUp, Minus, RefreshCcw, Plus } from "lucide-react";

export default function BrvmIndicesManagement() {
  const { user, hasPermission } = useAuth();
  const { error: toastError } = useToast();
  const { fetchGroups, fetchIndicesWithLatest, loading, createGroup, createIndex, addPoint } = useBrvmIndices();
  const [groups, setGroups] = useState<BrvmIndexGroup[]>([]);
  const [items, setItems] = useState<BrvmIndexWithLatest[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateIndex, setShowCreateIndex] = useState(false);
  const [showAddPointFor, setShowAddPointFor] = useState<BrvmIndexWithLatest | null>(null);
  const [showBulkEntry, setShowBulkEntry] = useState(false);

  const loadAll = async () => {
    setErr(null);
    try {
      const [g, i] = await Promise.all([fetchGroups(), fetchIndicesWithLatest()]);
      setGroups(g);
      setItems(i);
    } catch (e: any) {
      console.error("[BrvmIndicesManagement] load error", e);
      const msg = e?.message || "Erreur de chargement";
      setErr(msg);
      toastError("Erreur", msg);
    }
  };

  useEffect(() => { loadAll(); }, []);

  if (!user || !hasPermission("create_indices")) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour gérer les indices BRVM.</p>
        </div>
      </div>
    );
  }

  const grouped = useMemo(() => {
    const map = new Map<string, BrvmIndexWithLatest[]>();
    for (const it of items) {
      const key = it.group?.slug || it.group_id || "autres";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return map;
  }, [items]);

  const groupLabel = (slugOrId: string) => {
    const g = groups.find((x) => x.slug === slugOrId || x.id === slugOrId);
    return g?.name || slugOrId;
  };

  const getTrend = (dir?: string | null) => {
    if (dir === "up") return { Icon: TrendingUp, color: "text-green-600 bg-green-50" } as const;
    if (dir === "down") return { Icon: TrendingDown, color: "text-red-600 bg-red-50" } as const;
    return { Icon: Minus, color: "text-gray-600 bg-gray-50" } as const;
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amani-primary">Indices BRVM</h1>
          <p className="text-gray-600 mt-1">Gestion des indices migrés vers le nouveau schéma BRVM</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAll} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 rounded border text-sm hover:bg-gray-50">
            <RefreshCcw className="w-4 h-4" /> Rafraîchir
          </button>
          <button onClick={() => setShowCreateGroup(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded border text-sm hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Nouveau groupe
          </button>
          <button onClick={() => setShowCreateIndex(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-amani-primary text-white text-sm hover:bg-amani-primary/90">
            <Plus className="w-4 h-4" /> Nouvel indice
          </button>
          <button onClick={() => setShowBulkEntry(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700">
            <BarChart3 className="w-4 h-4" /> Saisie rapide
          </button>
          <Link to="/dashboard/indices-help" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-amani-primary text-white text-sm hover:bg-amani-primary/90">
            <Plus className="w-4 h-4" /> Aide indices
          </Link>
        </div>
      </div>

      {err && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded">{err}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-amani-primary">{items.length}</div>
          <div className="text-sm text-gray-600">Total indices</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="text-2xl font-bold text-amani-primary">{groups.length}</div>
          <div className="text-sm text-gray-600">Groupes</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="text-2xl font-bold text-amani-primary">{Array.from(grouped.keys()).length}</div>
          <div className="text-sm text-gray-600">Sections</div>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([key, arr]) => (
          <div key={key} className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-amani-primary">{groupLabel(key)}</h2>
              <div className="text-sm text-gray-500">{arr.length} indice(s)</div>
            </div>
            <div className="divide-y divide-gray-100">
              {arr.map((it) => {
                const t = getTrend(it.latest?.direction ?? undefined);
                return (
                  <div key={it.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-semibold text-amani-primary">{it.name}</div>
                          {it.code && (
                            <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{it.code}</code>
                          )}
                          {!it.is_public && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Privé</span>
                          )}
                        </div>
                        {it.description && (
                          <p className="text-sm text-gray-600 mt-1 max-w-2xl line-clamp-2">{it.description}</p>
                        )}
                        <div className="mt-2 text-xs text-gray-500">Source: {it.source || "-"}</div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded ${t.color}`}>
                        <t.Icon className="w-4 h-4" />
                        <span className="font-semibold text-lg">{it.latest?.close ?? "-"}</span>
                        {it.unit === "percent" && <span>%</span>}
                        <span className="text-sm">({it.latest?.change_percent ?? "0.00"}%)</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                      <div>Dernière mise à jour: {it.latest?.created_at ?? "-"}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowAddPointFor(it)} className="text-sm px-2 py-1 rounded border hover:bg-gray-50">Ajouter un point</button>
                        {/* Future: Edit / Delete */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!items.length && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-white/50">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun indice BRVM</h3>
          <p className="text-gray-600">Commencez par configurer les groupes et importer des points d'indices.</p>
        </div>
      )}

      {/* Modals */}
      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={async (payload) => {
          await createGroup(payload);
          await loadAll();
          setShowCreateGroup(false);
        }}
      />
      <CreateIndexModal
        open={showCreateIndex}
        onClose={() => setShowCreateIndex(false)}
        groups={groups}
        onCreate={async (payload) => {
          await createIndex(payload as any);
          await loadAll();
          setShowCreateIndex(false);
        }}
      />
      <AddPointModal
        open={!!showAddPointFor}
        indice={showAddPointFor}
        onClose={() => setShowAddPointFor(null)}
        onAdd={async (payload) => {
          if (!showAddPointFor) return;
          await addPoint(showAddPointFor.id, payload as any);
          await loadAll();
          setShowAddPointFor(null);
        }}
      />
      <BulkEntryModal
        open={showBulkEntry}
        onClose={() => setShowBulkEntry(false)}
        indices={items}
        onAdd={async (entries) => {
          for (const entry of entries) {
            await addPoint(entry.indiceId, { close: entry.value, created_at: entry.date });
          }
          await loadAll();
          setShowBulkEntry(false);
        }}
      />
    </div>
  );
}

// Simple Modal primitives
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Inline forms hooked to CRUD
function CreateGroupModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (payload: { slug: string; name: string; description?: string }) => Promise<void> }) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const submit = async () => {
    setSaving(true);
    try {
      await onCreate({ slug, name, description });
      success("Groupe créé");
      onClose();
      setSlug(""); setName(""); setDescription("");
    } catch (e: any) {
      error("Erreur", e?.message || "Impossible de créer le groupe");
    } finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau groupe">
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="ex: indices-generaux" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Nom du groupe" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description (optionnel)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded border">Annuler</button>
          <button onClick={submit} disabled={saving || !slug || !name} className="px-3 py-2 rounded bg-amani-primary text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Créer"}</button>
        </div>
      </div>
    </Modal>
  );
}

function CreateIndexModal({ open, onClose, groups, onCreate }: { open: boolean; onClose: () => void; groups: BrvmIndexGroup[]; onCreate: (payload: { slug: string; name: string; code?: string; group_id?: string | null; unit?: string; source?: string; is_public?: boolean }) => Promise<void> }) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [groupId, setGroupId] = useState<string | "">("");
  const [unit, setUnit] = useState("");
  const [source, setSource] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const submit = async () => {
    setSaving(true);
    try {
      await onCreate({ slug, name, code: code || undefined, group_id: groupId || null, unit: unit || undefined, source: source || undefined, is_public: isPublic });
      success("Indice créé");
      onClose();
      setSlug(""); setName(""); setCode(""); setGroupId(""); setUnit(""); setSource(""); setIsPublic(true);
    } catch (e: any) {
      error("Erreur", e?.message || "Impossible de créer l'indice");
    } finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvel indice">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="ex: brvm10" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="BRVM10" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Nom de l'indice" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Groupe</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">(Aucun)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unité</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="points / percent" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Source</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="BRVM" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-sm text-gray-700">Public</label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded border">Annuler</button>
          <button onClick={submit} disabled={saving || !slug || !name} className="px-3 py-2 rounded bg-amani-primary text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Créer"}</button>
        </div>
      </div>
    </Modal>
  );
}

function AddPointModal({ open, onClose, indice, onAdd }: { open: boolean; onClose: () => void; indice: BrvmIndexWithLatest | null; onAdd: (payload: { close: number; created_at?: string }) => Promise<void> }) {
  const [closeVal, setCloseVal] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  // Calcul automatique du pourcentage de changement
  const previousValue = indice?.latest?.close ? Number(indice.latest.close) : null;
  const currentValue = closeVal ? Number(closeVal) : null;
  const changePercent = previousValue && currentValue ? 
    (((currentValue - previousValue) / previousValue) * 100).toFixed(2) : null;

  // Déterminer la direction
  const direction = previousValue && currentValue ? 
    (currentValue > previousValue ? "up" : currentValue < previousValue ? "down" : "neutral") : null;

  // Définir la date par défaut à maintenant
  const setCurrentDateTime = () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCreatedAt(localDateTime);
  };

  // Initialiser avec la date actuelle quand le modal s'ouvre
  React.useEffect(() => {
    if (open && !createdAt) {
      setCurrentDateTime();
    }
  }, [open]);

  const submit = async () => {
    setSaving(true);
    try {
      if (!closeVal) throw new Error("Veuillez saisir la valeur de clôture");
      await onAdd({
        close: Number(closeVal),
        created_at: createdAt ? new Date(createdAt).toISOString() : undefined,
      });
      success("Point ajouté avec succès");
      onClose();
      setCloseVal(""); setCreatedAt("");
    } catch (e: any) {
      error("Erreur", e?.message || "Impossible d'ajouter le point");
    } finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Saisie manuelle — ${indice?.name || "Indice"}`}>
      <div className="space-y-4">
        {/* Informations contextuelles */}
        {indice?.latest && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Dernière valeur enregistrée :</div>
            <div className="font-semibold text-lg">{indice.latest.close} {indice.unit === "percent" ? "%" : "pts"}</div>
            <div className="text-xs text-gray-500">
              {indice.latest.created_at ? new Date(indice.latest.created_at).toLocaleString('fr-FR') : "Date inconnue"}
            </div>
          </div>
        )}

        {/* Saisie de la nouvelle valeur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouvelle valeur de clôture *
          </label>
          <div className="relative">
            <input 
              value={closeVal} 
              onChange={(e) => setCloseVal(e.target.value)} 
              type="number" 
              step="0.01" 
              className="w-full border rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-amani-primary focus:border-amani-primary" 
              placeholder="Ex: 150.25"
            />
            <span className="absolute right-3 top-2 text-gray-500 text-sm">
              {indice?.unit === "percent" ? "%" : "pts"}
            </span>
          </div>
        </div>

        {/* Aperçu du changement */}
        {changePercent && (
          <div className={`rounded-lg p-3 ${
            direction === "up" ? "bg-green-50 text-green-800" : 
            direction === "down" ? "bg-red-50 text-red-800" : 
            "bg-gray-50 text-gray-800"
          }`}>
            <div className="flex items-center gap-2">
              {direction === "up" && <TrendingUp className="w-4 h-4" />}
              {direction === "down" && <TrendingDown className="w-4 h-4" />}
              {direction === "neutral" && <Minus className="w-4 h-4" />}
              <span className="font-medium">
                Variation : {Number(changePercent) > 0 ? "+" : ""}{changePercent}%
              </span>
            </div>
          </div>
        )}

        {/* Date et heure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure
          </label>
          <div className="flex gap-2">
            <input 
              value={createdAt} 
              onChange={(e) => setCreatedAt(e.target.value)} 
              type="datetime-local" 
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amani-primary focus:border-amani-primary" 
            />
            <button 
              type="button"
              onClick={setCurrentDateTime}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Maintenant
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Laissez vide pour utiliser l'heure actuelle
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            onClick={submit} 
            disabled={saving || !closeVal} 
            className="px-4 py-2 rounded-lg bg-amani-primary text-white hover:bg-amani-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Enregistrement…" : "Ajouter le point"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Modal de saisie rapide pour plusieurs indices
function BulkEntryModal({ 
  open, 
  onClose, 
  indices, 
  onAdd 
}: { 
  open: boolean; 
  onClose: () => void; 
  indices: BrvmIndexWithLatest[]; 
  onAdd: (entries: { indiceId: string; value: number; date?: string }[]) => Promise<void>;
}) {
  const [entries, setEntries] = useState<{ [key: string]: string }>({});
  const [commonDate, setCommonDate] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  // Initialiser la date commune avec l'heure actuelle
  React.useEffect(() => {
    if (open && !commonDate) {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setCommonDate(localDateTime);
    }
  }, [open]);

  const handleValueChange = (indiceId: string, value: string) => {
    setEntries(prev => ({ ...prev, [indiceId]: value }));
  };

  const submit = async () => {
    setSaving(true);
    try {
      const validEntries = Object.entries(entries)
        .filter(([_, value]) => value && !isNaN(Number(value)))
        .map(([indiceId, value]) => ({
          indiceId,
          value: Number(value),
          date: commonDate ? new Date(commonDate).toISOString() : undefined
        }));

      if (validEntries.length === 0) {
        throw new Error("Veuillez saisir au moins une valeur valide");
      }

      await onAdd(validEntries);
      success(`${validEntries.length} point(s) ajouté(s) avec succès`);
      onClose();
      setEntries({});
      setCommonDate("");
    } catch (e: any) {
      error("Erreur", e?.message || "Impossible d'ajouter les points");
    } finally {
      setSaving(false);
    }
  };

  const filledCount = Object.values(entries).filter(v => v && !isNaN(Number(v))).length;

  return (
    <Modal open={open} onClose={onClose} title="Saisie rapide des indices BRVM">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Date commune */}
        <div className="sticky top-0 bg-white border-b pb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure commune
          </label>
          <div className="flex gap-2">
            <input 
              value={commonDate} 
              onChange={(e) => setCommonDate(e.target.value)} 
              type="datetime-local" 
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amani-primary focus:border-amani-primary" 
            />
            <button 
              type="button"
              onClick={() => {
                const now = new Date();
                const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 16);
                setCommonDate(localDateTime);
              }}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Maintenant
            </button>
          </div>
          {filledCount > 0 && (
            <div className="text-sm text-green-600 mt-2">
              {filledCount} indice(s) rempli(s)
            </div>
          )}
        </div>

        {/* Liste des indices */}
        <div className="space-y-3">
          {indices.map((indice) => (
            <div key={indice.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{indice.name}</div>
                {indice.code && (
                  <div className="text-xs text-gray-500">{indice.code}</div>
                )}
                {indice.latest && (
                  <div className="text-xs text-gray-400">
                    Dernier: {indice.latest.close} {indice.unit === "percent" ? "%" : "pts"}
                  </div>
                )}
              </div>
              <div className="w-32">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valeur"
                  value={entries[indice.id] || ""}
                  onChange={(e) => handleValueChange(indice.id, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-amani-primary focus:border-amani-primary"
                />
              </div>
              <div className="text-xs text-gray-500 w-8">
                {indice.unit === "percent" ? "%" : "pts"}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            onClick={submit} 
            disabled={saving || filledCount === 0} 
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Enregistrement…" : `Ajouter ${filledCount} point(s)`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
