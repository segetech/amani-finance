import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMarketData, type MarketData as MarketDataType, type CreateMarketDataInput } from '../hooks/useMarketData';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';

export default function MarketDataManager() {
  const { user, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();
  
  // Utiliser le hook personnalisé
  const {
    marketData,
    loading,
    error,
    fetchMarketData,
    createMarketData,
    updateMarketData,
    deleteMarketData,
    toggleMarketDataStatus,
    getMarketStats,
  } = useMarketData();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketDataType | null>(null);
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Vérification des permissions
  if (!hasPermission('manage_market_data')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les données de marché.</p>
        </div>
      </div>
    );
  }

  // Charger les données au montage du composant
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const sectors = ['all', 'Banque', 'Télécommunications', 'Industrie', 'Services', 'Agriculture'];

  const filteredData = marketData.filter(item => {
    const matchesSector = selectedSector === 'all' || item.sector === selectedSector;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const marketSummary = getMarketStats();

  const handleRefresh = async () => {
    try {
      await fetchMarketData();
      success('Données actualisées avec succès');
    } catch (err) {
      toastError('Erreur lors de l\'actualisation');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleMarketDataStatus(id);
      success('Statut mis à jour');
    } catch (err) {
      toastError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteMarketData(id);
        success('Élément supprimé');
      } catch (err) {
        toastError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Gestionnaire de Données de Marché
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les données des actions, prix, volumes et informations financières
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Action
              </button>
            </div>
          </div>
        </div>

        {/* Résumé du marché */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{marketSummary.totalStocks}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En hausse</p>
                <p className="text-2xl font-bold text-green-600">{marketSummary.gainers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En baisse</p>
                <p className="text-2xl font-bold text-red-600">{marketSummary.losers}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inchangées</p>
                <p className="text-2xl font-bold text-gray-600">{marketSummary.unchanged}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(marketSummary.totalVolume / 1000).toFixed(0)}K
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cap. Marché</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(marketSummary.totalMarketCap / 1000000000).toFixed(1)}B
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou symbole..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'all' ? 'Tous les secteurs' : sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des données */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Actions et Données ({filteredData.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variation
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cap. Marché
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.symbol}
                          </div>
                          <div className="text-sm text-gray-500">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.sector}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {item.current_price.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          Préc: {item.previous_close.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          item.change_percent > 0 ? 'text-green-600' : 
                          item.change_percent < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.change_percent > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : item.change_percent < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : null}
                          <span className="text-sm font-medium">
                            {item.change_percent > 0 ? '+' : ''}{item.change_percent.toFixed(2)}%
                          </span>
                        </div>
                        <div className={`text-xs ${
                          item.change_percent > 0 ? 'text-green-600' : 
                          item.change_percent < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.change_amount > 0 ? '+' : ''}{item.change_amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {item.volume.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {(item.market_cap / 1000000).toFixed(0)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleActive(item.id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.is_active ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal de création */}
      {showCreateModal && (
        <CreateEditModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            try {
              await createMarketData(data);
              success('Action créée avec succès');
              setShowCreateModal(false);
            } catch (err) {
              toastError('Erreur lors de la création');
            }
          }}
          title="Nouvelle Action"
        />
      )}

      {/* Modal d'édition */}
      {editingItem && (
        <CreateEditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={async (data) => {
            try {
              await updateMarketData(editingItem.id, data);
              success('Action mise à jour avec succès');
              setEditingItem(null);
            } catch (err) {
              toastError('Erreur lors de la mise à jour');
            }
          }}
          title="Modifier l'Action"
          initialData={editingItem}
        />
      )}
    </div>
  );
}

// Composant Modal pour création/édition
interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMarketDataInput) => Promise<void>;
  title: string;
  initialData?: MarketDataType;
}

function CreateEditModal({ isOpen, onClose, onSubmit, title, initialData }: CreateEditModalProps) {
  const [formData, setFormData] = useState<CreateMarketDataInput>({
    symbol: initialData?.symbol || '',
    name: initialData?.name || '',
    sector: initialData?.sector || 'Banque',
    current_price: initialData?.current_price || 0,
    previous_close: initialData?.previous_close || 0,
    volume: initialData?.volume || 0,
    market_cap: initialData?.market_cap || 0,
    high_52w: initialData?.high_52w || 0,
    low_52w: initialData?.low_52w || 0,
    pe_ratio: initialData?.pe_ratio || 0,
    dividend_yield: initialData?.dividend_yield || 0,
    is_active: initialData?.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const sectors = ['Banque', 'Télécommunications', 'Industrie', 'Services', 'Agriculture', 'Énergie', 'Immobilier'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbole *
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: BOAB, ETIT"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Bank of Africa Bénin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secteur *
            </label>
            <select
              required
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Prix et variations */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prix et Cotations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix actuel (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.current_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4250.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clôture précédente (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.previous_close}
                  onChange={(e) => setFormData(prev => ({ ...prev, previous_close: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4100.00"
                />
              </div>
            </div>

            {/* Affichage de la variation calculée */}
            {formData.current_price > 0 && formData.previous_close > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Variation calculée :</p>
                <div className={`text-lg font-semibold ${
                  formData.current_price > formData.previous_close ? 'text-green-600' : 
                  formData.current_price < formData.previous_close ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formData.current_price > formData.previous_close ? '+' : ''}
                  {(formData.current_price - formData.previous_close).toFixed(2)} FCFA 
                  ({formData.current_price > formData.previous_close ? '+' : ''}
                  {(((formData.current_price - formData.previous_close) / formData.previous_close) * 100).toFixed(2)}%)
                </div>
              </div>
            )}
          </div>

          {/* Données de trading */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Données de Trading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.volume}
                  onChange={(e) => setFormData(prev => ({ ...prev, volume: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capitalisation boursière (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.market_cap}
                  onChange={(e) => setFormData(prev => ({ ...prev, market_cap: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="425000000"
                />
              </div>
            </div>
          </div>

          {/* Données 52 semaines */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plage 52 Semaines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plus haut 52S (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.high_52w}
                  onChange={(e) => setFormData(prev => ({ ...prev, high_52w: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plus bas 52S (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.low_52w}
                  onChange={(e) => setFormData(prev => ({ ...prev, low_52w: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3800.00"
                />
              </div>
            </div>
          </div>

          {/* Ratios financiers */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratios Financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ratio P/E
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.pe_ratio}
                  onChange={(e) => setFormData(prev => ({ ...prev, pe_ratio: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendement dividende (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.dividend_yield}
                  onChange={(e) => setFormData(prev => ({ ...prev, dividend_yield: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4.2"
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="border-t pt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Action active (visible sur le site)
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              {initialData ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
