import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrencies, type Currency, type CreateCurrencyInput } from '../hooks/useCurrencies';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  DollarSign,
  Activity,
  AlertCircle,
  X,
  Star,
  StarOff,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function CurrencyManager() {
  const { user, hasPermission } = useAuth();
  const { success, error: toastError } = useToast();
  
  const {
    currencies,
    loading,
    error,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    toggleCurrencyStatus,
    toggleMajorStatus,
    getCurrencyStats,
  } = useCurrencies();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, major, active, inactive

  // Vérification des permissions
  if (!hasPermission('manage_currencies')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour gérer les devises.</p>
        </div>
      </div>
    );
  }

  const stats = getCurrencyStats();

  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'major' && currency.is_major) ||
                         (filterType === 'active' && currency.is_active) ||
                         (filterType === 'inactive' && !currency.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    try {
      await fetchCurrencies();
      success('Données actualisées avec succès');
    } catch (err) {
      toastError('Erreur lors de l\'actualisation');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleCurrencyStatus(id);
      success('Statut mis à jour');
    } catch (err) {
      toastError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleToggleMajor = async (id: string) => {
    try {
      await toggleMajorStatus(id);
      success('Statut devise majeure mis à jour');
    } catch (err) {
      toastError('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette devise ?')) {
      try {
        await deleteCurrency(id);
        success('Devise supprimée');
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
                <DollarSign className="w-8 h-8 text-green-600" />
                Gestionnaire de Devises
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les taux de change, devises majeures et données Forex
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
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Devise
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Devises</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCurrencies}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devises Majeures</p>
                <p className="text-2xl font-bold text-blue-600">{stats.majorCurrencies}</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En hausse</p>
                <p className="text-2xl font-bold text-green-600">{stats.gainers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En baisse</p>
                <p className="text-2xl font-bold text-red-600">{stats.losers}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Variation Moy.</p>
                <p className={`text-2xl font-bold ${stats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
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
                  placeholder="Rechercher par nom ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Toutes les devises</option>
                  <option value="major">Devises majeures</option>
                  <option value="active">Actives</option>
                  <option value="inactive">Inactives</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des devises */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Devises ({filteredCurrencies.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des devises...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Devise
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taux (FCFA)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variation
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
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
                  {filteredCurrencies.map((currency) => (
                    <tr key={currency.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{currency.flag_emoji}</span>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {currency.code} {currency.symbol && `(${currency.symbol})`}
                            </div>
                            <div className="text-sm text-gray-500">{currency.name}</div>
                            <div className="text-xs text-gray-400">{currency.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {currency.current_rate.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Préc: {currency.previous_rate?.toLocaleString('fr-FR', { maximumFractionDigits: 3 }) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          (currency.change_percent || 0) > 0 ? 'text-green-600' : 
                          (currency.change_percent || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {(currency.change_percent || 0) > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (currency.change_percent || 0) < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : null}
                          <span className="text-sm font-medium">
                            {(currency.change_percent || 0) > 0 ? '+' : ''}{(currency.change_percent || 0).toFixed(2)}%
                          </span>
                        </div>
                        <div className={`text-xs ${
                          (currency.change_percent || 0) > 0 ? 'text-green-600' : 
                          (currency.change_percent || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {(currency.change_amount || 0) > 0 ? '+' : ''}{(currency.change_amount || 0).toFixed(3)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {currency.volume || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleActive(currency.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currency.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                            title={currency.is_active ? 'Désactiver' : 'Activer'}
                          >
                            {currency.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                            {currency.is_active ? 'Actif' : 'Inactif'}
                          </button>
                          <button
                            onClick={() => handleToggleMajor(currency.id)}
                            className={`p-1 rounded ${
                              currency.is_major
                                ? 'text-yellow-600 hover:text-yellow-800'
                                : 'text-gray-400 hover:text-yellow-600'
                            }`}
                            title={currency.is_major ? 'Retirer des devises majeures' : 'Marquer comme devise majeure'}
                          >
                            {currency.is_major ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingCurrency(currency)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(currency.id)}
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
        <CurrencyFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            try {
              await createCurrency(data);
              success('Devise créée avec succès');
              setShowCreateModal(false);
            } catch (err) {
              toastError('Erreur lors de la création');
            }
          }}
          title="Nouvelle Devise"
        />
      )}

      {/* Modal d'édition */}
      {editingCurrency && (
        <CurrencyFormModal
          isOpen={!!editingCurrency}
          onClose={() => setEditingCurrency(null)}
          onSubmit={async (data) => {
            try {
              await updateCurrency(editingCurrency.id, data);
              success('Devise mise à jour avec succès');
              setEditingCurrency(null);
            } catch (err) {
              toastError('Erreur lors de la mise à jour');
            }
          }}
          title="Modifier la Devise"
          initialData={editingCurrency}
        />
      )}
    </div>
  );
}

// Composant Modal pour création/édition de devises
interface CurrencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCurrencyInput) => Promise<void>;
  title: string;
  initialData?: Currency;
}

function CurrencyFormModal({ isOpen, onClose, onSubmit, title, initialData }: CurrencyFormModalProps) {
  const [formData, setFormData] = useState<CreateCurrencyInput>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    symbol: initialData?.symbol || '',
    flag_emoji: initialData?.flag_emoji || '',
    current_rate: initialData?.current_rate || 0,
    previous_rate: initialData?.previous_rate || 0,
    daily_high: initialData?.daily_high || 0,
    daily_low: initialData?.daily_low || 0,
    volume: initialData?.volume || '',
    is_active: initialData?.is_active ?? true,
    is_major: initialData?.is_major ?? false,
    display_order: initialData?.display_order || 0,
    description: initialData?.description || '',
    country: initialData?.country || '',
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

  const commonCurrencies = [
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Zone Euro' },
    { code: 'USD', name: 'Dollar Américain', symbol: '$', flag: '🇺🇸', country: 'États-Unis' },
    { code: 'GBP', name: 'Livre Sterling', symbol: '£', flag: '🇬🇧', country: 'Royaume-Uni' },
    { code: 'CHF', name: 'Franc Suisse', symbol: 'CHF', flag: '🇨🇭', country: 'Suisse' },
    { code: 'JPY', name: 'Yen Japonais', symbol: '¥', flag: '🇯🇵', country: 'Japon' },
    { code: 'CAD', name: 'Dollar Canadien', symbol: 'C$', flag: '🇨🇦', country: 'Canada' },
    { code: 'AUD', name: 'Dollar Australien', symbol: 'A$', flag: '🇦🇺', country: 'Australie' },
    { code: 'CNY', name: 'Yuan Chinois', symbol: '¥', flag: '🇨🇳', country: 'Chine' },
  ];

  const fillCommonCurrency = (currency: typeof commonCurrencies[0]) => {
    setFormData(prev => ({
      ...prev,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      flag_emoji: currency.flag,
      country: currency.country,
    }));
  };

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
          {/* Devises communes (seulement pour création) */}
          {!initialData && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Devises communes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => fillCommonCurrency(currency)}
                    className="flex items-center gap-2 p-2 text-sm border border-gray-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-lg">{currency.flag}</span>
                    <span className="font-medium">{currency.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code devise (ISO) *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: EUR, USD, GBP"
                maxLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la devise *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Euro, Dollar Américain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbole
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: €, $, £"
                maxLength={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drapeau (Emoji)
              </label>
              <input
                type="text"
                value={formData.flag_emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: 🇪🇺, 🇺🇸, 🇬🇧"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Zone Euro, États-Unis"
              />
            </div>
          </div>

          {/* Taux de change */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de Change (contre FCFA)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux actuel (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.001"
                  value={formData.current_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_rate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="655.957"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux précédent (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={formData.previous_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, previous_rate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="652.340"
                />
              </div>
            </div>

            {/* Affichage de la variation calculée */}
            {formData.current_rate > 0 && formData.previous_rate > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Variation calculée :</p>
                <div className={`text-lg font-semibold ${
                  formData.current_rate > formData.previous_rate ? 'text-green-600' : 
                  formData.current_rate < formData.previous_rate ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formData.current_rate > formData.previous_rate ? '+' : ''}
                  {(formData.current_rate - formData.previous_rate).toFixed(3)} FCFA 
                  ({formData.current_rate > formData.previous_rate ? '+' : ''}
                  {(((formData.current_rate - formData.previous_rate) / formData.previous_rate) * 100).toFixed(2)}%)
                </div>
              </div>
            )}
          </div>

          {/* Données de trading */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Données de Trading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plus haut du jour
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={formData.daily_high}
                  onChange={(e) => setFormData(prev => ({ ...prev, daily_high: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="658.120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plus bas du jour
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={formData.daily_low}
                  onChange={(e) => setFormData(prev => ({ ...prev, daily_low: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="651.890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="2.4M, 890K, etc."
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Devise active (visible sur le site)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_major"
                    checked={formData.is_major}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_major: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="is_major" className="ml-2 text-sm text-gray-700">
                    Devise majeure (affichée en priorité)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Description optionnelle de la devise..."
            />
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
