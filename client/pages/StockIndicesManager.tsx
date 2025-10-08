import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useStockIndices, type StockIndex } from "../hooks/useStockIndices";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  X,
  HelpCircle,
} from "lucide-react";

export default function StockIndicesManager() {
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const { indices, loading, updateIndex, fetchIndices, createIndex } = useStockIndices();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<StockIndex | null>(null);

  // Toggle affichage sur l'accueil
  const toggleHomepage = async (id: string, currentValue: boolean) => {
    try {
      await updateIndex(id, { show_on_homepage: !currentValue });
      success('Affichage mis à jour');
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  // Toggle actif/inactif
  const toggleActive = async (id: string, currentValue: boolean) => {
    try {
      await updateIndex(id, { is_active: !currentValue });
      success('Statut mis à jour');
    } catch (err: any) {
      error('Erreur', err.message);
    }
  };

  if (!hasPermission('manage_indices')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les indices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Gestion des Indices Boursiers
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez vos indices boursiers et leur affichage sur la page d'accueil
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchIndices}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nouvel Indice
              </button>
            </div>
          </div>
        </div>

        {/* Liste des indices */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Indices Configurés ({indices.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">Chargement des indices...</p>
            </div>
          ) : indices.length === 0 ? (
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun indice configuré</h3>
              <p className="text-gray-600 mb-4">Créez votre premier indice boursier</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Créer un indice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affichage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {indices.map((index) => (
                    <tr key={index.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{index.name}</span>
                            {!index.is_active && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Inactif
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {index.symbol} • {index.market}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index.current_value ? `${index.current_value} ${index.unit}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index.change_percent !== null ? (
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            index.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {index.change_percent >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {index.change_percent >= 0 ? '+' : ''}{index.change_percent}%
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleHomepage(index.id, index.show_on_homepage)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            index.show_on_homepage
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {index.show_on_homepage ? (
                            <>
                              <Eye className="w-4 h-4" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Masqué
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(index.id, index.is_active)}
                            className={index.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {index.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création d'indice */}
      {showCreateModal && (
        <CreateIndexModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            try {
              await createIndex(data);
              success('Indice créé avec succès');
              setShowCreateModal(false);
            } catch (err: any) {
              error('Erreur', err.message);
            }
          }}
        />
      )}

      {/* Modal d'édition d'indice */}
      {editingIndex && (
        <EditIndexModal
          open={!!editingIndex}
          index={editingIndex}
          onClose={() => setEditingIndex(null)}
          onSubmit={async (data) => {
            try {
              await updateIndex(editingIndex.id, data);
              success('Indice mis à jour avec succès');
              setEditingIndex(null);
            } catch (err: any) {
              error('Erreur', err.message);
            }
          }}
        />
      )}
    </div>
  );
}

// Composant Tooltip pour les aides
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-6 transform -translate-y-full w-64">
          {content}
          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

// Composant Label avec aide
function LabelWithHelp({ label, help, required = false }: { label: string; help: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Tooltip content={help}>
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </Tooltip>
    </div>
  );
}

// Modal de création d'indice
function CreateIndexModal({ 
  open, 
  onClose, 
  onSubmit 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({
    name: '',
    symbol: '',
    market: 'BRVM',
    country: 'Mali',
    current_value: '',
    unit: 'points',
    currency: 'XOF',
    description: '',
    show_on_homepage: true,
    is_active: true,
    display_order: 0
  });
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        current_value: formData.current_value ? Number(formData.current_value) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nouvel Indice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithHelp 
                label="Nom de l'indice" 
                help="Le nom complet de l'indice boursier. Ex: BRVM Composite, CAC 40, Dow Jones" 
                required 
              />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: BRVM Composite"
              />
            </div>
            <div>
              <LabelWithHelp 
                label="Symbole" 
                help="Le code court de l'indice utilisé pour l'identifier. Ex: BRVM10, CAC40, DJI" 
                required 
              />
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: BRVM10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithHelp 
                label="Marché" 
                help="Le nom du marché boursier où l'indice est coté. Ex: BRVM, NYSE, NASDAQ, Euronext" 
              />
              <input
                type="text"
                value={formData.market}
                onChange={(e) => setFormData(prev => ({ ...prev, market: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: BRVM"
              />
            </div>
            <div>
              <LabelWithHelp 
                label="Pays" 
                help="Le pays principal du marché boursier. Ex: Mali, France, États-Unis" 
              />
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Mali"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <LabelWithHelp 
                label="Valeur actuelle" 
                help="La dernière valeur connue de l'indice. Ex: 185.42 pour le BRVM Composite" 
              />
              <input
                type="number"
                step="0.01"
                value={formData.current_value}
                onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="185.42"
              />
            </div>
            <div>
              <LabelWithHelp 
                label="Unité" 
                help="L'unité de mesure de l'indice. Points pour les indices classiques, Pourcentage pour les taux, Devise pour les changes" 
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="points">Points</option>
                <option value="percent">Pourcentage</option>
                <option value="currency">Devise</option>
              </select>
            </div>
            <div>
              <LabelWithHelp 
                label="Devise" 
                help="La devise de référence pour l'indice. Ex: XOF (Franc CFA), EUR (Euro), USD (Dollar)" 
              />
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: XOF"
              />
            </div>
          </div>

          <div>
            <LabelWithHelp 
              label="Description" 
              help="Description détaillée de l'indice, son utilité et ce qu'il mesure. Ex: 'Indice principal de la BRVM regroupant les 10 plus grandes capitalisations'" 
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description de l'indice..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show_on_homepage"
                checked={formData.show_on_homepage}
                onChange={(e) => setFormData(prev => ({ ...prev, show_on_homepage: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show_on_homepage" className="text-sm text-gray-700">
                Afficher sur la page d'accueil
              </label>
              <Tooltip content="Si coché, cet indice apparaîtra dans la section 'Indices en temps réel' de la page d'accueil">
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Indice actif
              </label>
              <Tooltip content="Si décoché, l'indice sera masqué partout sur le site et ne sera plus mis à jour">
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Création...' : 'Créer l\'indice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal d'édition d'indice
function EditIndexModal({ 
  open, 
  index,
  onClose, 
  onSubmit 
}: { 
  open: boolean; 
  index: any;
  onClose: () => void; 
  onSubmit: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({
    name: index?.name || '',
    symbol: index?.symbol || '',
    market: index?.market || 'BRVM',
    country: index?.country || 'Mali',
    current_value: index?.current_value?.toString() || '',
    previous_value: index?.previous_value?.toString() || '',
    change_amount: index?.change_amount?.toString() || '',
    change_percent: index?.change_percent?.toString() || '',
    unit: index?.unit || 'points',
    currency: index?.currency || 'XOF',
    description: index?.description || '',
    show_on_homepage: index?.show_on_homepage ?? true,
    is_active: index?.is_active ?? true,
    display_order: index?.display_order || 0
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (index) {
      setFormData({
        name: index.name || '',
        symbol: index.symbol || '',
        market: index.market || 'BRVM',
        country: index.country || 'Mali',
        current_value: index.current_value?.toString() || '',
        previous_value: index.previous_value?.toString() || '',
        change_amount: index.change_amount?.toString() || '',
        change_percent: index.change_percent?.toString() || '',
        unit: index.unit || 'points',
        currency: index.currency || 'XOF',
        description: index.description || '',
        show_on_homepage: index.show_on_homepage ?? true,
        is_active: index.is_active ?? true,
        display_order: index.display_order || 0
      });
    }
  }, [index]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        current_value: formData.current_value ? Number(formData.current_value) : null,
        previous_value: formData.previous_value ? Number(formData.previous_value) : null,
        change_amount: formData.change_amount ? Number(formData.change_amount) : null,
        change_percent: formData.change_percent ? Number(formData.change_percent) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Modifier l'indice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'indice *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbole *
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithHelp 
                label="Valeur actuelle" 
                help="La valeur la plus récente de l'indice. Cette valeur sera affichée sur le site" 
              />
              <input
                type="number"
                step="0.01"
                value={formData.current_value}
                onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <LabelWithHelp 
                label="Valeur précédente" 
                help="La valeur de l'indice lors de la session précédente, utilisée pour calculer la variation" 
              />
              <input
                type="number"
                step="0.01"
                value={formData.previous_value}
                onChange={(e) => setFormData(prev => ({ ...prev, previous_value: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithHelp 
                label="Variation (montant)" 
                help="La différence absolue entre la valeur actuelle et précédente. Ex: +2.5 points" 
              />
              <input
                type="number"
                step="0.01"
                value={formData.change_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, change_amount: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <LabelWithHelp 
                label="Variation (%)" 
                help="Le pourcentage de variation par rapport à la valeur précédente. Ex: +1.35%" 
              />
              <input
                type="number"
                step="0.01"
                value={formData.change_percent}
                onChange={(e) => setFormData(prev => ({ ...prev, change_percent: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit_show_on_homepage"
                checked={formData.show_on_homepage}
                onChange={(e) => setFormData(prev => ({ ...prev, show_on_homepage: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="edit_show_on_homepage" className="ml-2 text-sm text-gray-700">
                Page d'accueil
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit_is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
                Actif
              </label>
            </div>
            <div>
              <LabelWithHelp 
                label="Ordre d'affichage" 
                help="Détermine l'ordre d'affichage des indices sur la page d'accueil. Plus le nombre est petit, plus l'indice apparaît en premier" 
              />
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
