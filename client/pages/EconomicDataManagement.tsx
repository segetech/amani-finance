import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEconomicData, EconomicCountry, RegionalMetric } from "../hooks/useEconomicData";
import { usePageSectionControls } from "../hooks/usePageSectionControls";
import {
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Building,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe
} from "lucide-react";

export default function EconomicDataManagement() {
  const {
    countries,
    regionalMetrics,
    loading,
    error,
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    fetchRegionalMetrics,
    createRegionalMetric,
    updateRegionalMetric,
    deleteRegionalMetric,
    refresh
  } = useEconomicData();

  // Hook pour les contrôles d'affichage
  const { 
    controls, 
    loading: controlsLoading, 
    toggleSectionVisibility, 
    isSectionVisible 
  } = usePageSectionControls({ page_name: 'economie' });

  const [activeTab, setActiveTab] = useState<'countries' | 'metrics' | 'display'>('countries');
  const [editingCountry, setEditingCountry] = useState<EconomicCountry | null>(null);
  const [editingMetric, setEditingMetric] = useState<RegionalMetric | null>(null);
  const [showAddCountryForm, setShowAddCountryForm] = useState(false);
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto-hide après 4 secondes
    setTimeout(() => setNotification(null), 4000);
  };

  // Formulaire pour nouveau pays
  const [newCountry, setNewCountry] = useState<Partial<EconomicCountry>>({
    name: '',
    flag_emoji: '',
    currency: 'FCFA',
    population: '',
    gdp_growth_rate: 0,
    inflation_rate: 0,
    unemployment_rate: 0,
    gdp_per_capita: 0,
    main_sectors: [],
    description: '',
    is_active: true,
    display_order: 0
  });

  // Formulaire pour nouvelle métrique
  const [newMetric, setNewMetric] = useState<Partial<RegionalMetric>>({
    metric_name: '',
    metric_value: '',
    metric_unit: '',
    icon_name: 'TrendingUp',
    display_order: 0,
    is_active: true,
    description: ''
  });

  const handleCreateCountry = async () => {
    try {
      await createCountry(newCountry as Omit<EconomicCountry, 'id' | 'created_at' | 'updated_at'>);
      setShowAddCountryForm(false);
      setNewCountry({
        name: '',
        flag_emoji: '',
        currency: 'FCFA',
        population: '',
        gdp_growth_rate: 0,
        inflation_rate: 0,
        unemployment_rate: 0,
        gdp_per_capita: 0,
        main_sectors: [],
        description: '',
        is_active: true,
        display_order: 0
      });
      showNotification('success', `Pays "${newCountry.name}" créé avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la création du pays:', error);
      showNotification('error', 'Erreur lors de la création du pays. Vérifiez les données saisies.');
    }
  };

  const handleCreateMetric = async () => {
    try {
      await createRegionalMetric(newMetric as Omit<RegionalMetric, 'id' | 'created_at' | 'updated_at'>);
      setShowAddMetricForm(false);
      setNewMetric({
        metric_name: '',
        metric_value: '',
        metric_unit: '',
        icon_name: 'TrendingUp',
        display_order: 0,
        is_active: true,
        description: ''
      });
      showNotification('success', `Métrique "${newMetric.metric_name}" créée avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la création de la métrique:', error);
      showNotification('error', 'Erreur lors de la création de la métrique.');
    }
  };

  const handleUpdateCountry = async (id: string, updates: Partial<EconomicCountry>) => {
    try {
      await updateCountry(id, updates);
      setEditingCountry(null);
      showNotification('success', `Pays "${updates.name || 'sélectionné'}" mis à jour avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pays:', error);
      showNotification('error', 'Erreur lors de la mise à jour. Vérifiez vos permissions ou les données saisies.');
    }
  };

  const handleUpdateMetric = async (id: string, updates: Partial<RegionalMetric>) => {
    try {
      await updateRegionalMetric(id, updates);
      setEditingMetric(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la métrique:', error);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    const country = countries.find(c => c.id === id);
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${country?.name || 'ce pays'} ?`)) {
      try {
        await deleteCountry(id);
        showNotification('success', `Pays "${country?.name || 'sélectionné'}" supprimé avec succès !`);
      } catch (error) {
        console.error('Erreur lors de la suppression du pays:', error);
        showNotification('error', 'Erreur lors de la suppression du pays.');
      }
    }
  };

  const handleDeleteMetric = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette métrique ?')) {
      try {
        await deleteRegionalMetric(id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la métrique:', error);
      }
    }
  };

  const iconOptions = [
    { name: 'TrendingUp', component: TrendingUp },
    { name: 'DollarSign', component: DollarSign },
    { name: 'Users', component: Users },
    { name: 'Activity', component: Activity },
    { name: 'Building', component: Building },
    { name: 'BarChart3', component: BarChart3 },
    { name: 'Globe', component: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Retour au dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-amani-primary" />
                Gestion des Données Économiques
              </h1>
            </div>
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('countries')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'countries'
                    ? 'border-amani-primary text-amani-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pays ({countries.length})
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'metrics'
                    ? 'border-amani-primary text-amani-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Métriques Régionales ({regionalMetrics.length})
              </button>
              <button
                onClick={() => setActiveTab('display')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'display'
                    ? 'border-amani-primary text-amani-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contrôles d'Affichage
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 min-w-80 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Onglet Pays */}
        {activeTab === 'countries' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Données des Pays</h2>
              <button
                onClick={() => setShowAddCountryForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Ajouter un pays
              </button>
            </div>

            {/* Modal d'ajout de pays */}
            {showAddCountryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Nouveau Pays</h3>
                    <button
                      onClick={() => setShowAddCountryForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du pays *</label>
                      <input
                        type="text"
                        value={newCountry.name}
                        onChange={(e) => setNewCountry({...newCountry, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="Mali"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emoji du drapeau *</label>
                      <input
                        type="text"
                        value={newCountry.flag_emoji}
                        onChange={(e) => setNewCountry({...newCountry, flag_emoji: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="🇲🇱"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                      <input
                        type="text"
                        value={newCountry.currency}
                        onChange={(e) => setNewCountry({...newCountry, currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="FCFA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Population *</label>
                      <input
                        type="text"
                        value={newCountry.population}
                        onChange={(e) => setNewCountry({...newCountry, population: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="21.9M"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Croissance PIB (%) *</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCountry.gdp_growth_rate}
                        onChange={(e) => setNewCountry({...newCountry, gdp_growth_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="5.2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inflation (%) *</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCountry.inflation_rate}
                        onChange={(e) => setNewCountry({...newCountry, inflation_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="2.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chômage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCountry.unemployment_rate}
                        onChange={(e) => setNewCountry({...newCountry, unemployment_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="8.4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PIB/habitant (USD) *</label>
                      <input
                        type="number"
                        value={newCountry.gdp_per_capita}
                        onChange={(e) => setNewCountry({...newCountry, gdp_per_capita: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="875"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                      <input
                        type="number"
                        value={newCountry.display_order}
                        onChange={(e) => setNewCountry({...newCountry, display_order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                        placeholder="1"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secteurs principaux (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={newCountry.main_sectors?.join(', ') || ''}
                      onChange={(e) => setNewCountry({...newCountry, main_sectors: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                      placeholder="Agriculture, Mines, Services"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newCountry.description || ''}
                      onChange={(e) => setNewCountry({...newCountry, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                      rows={3}
                      placeholder="Description du pays et de son économie..."
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddCountryForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreateCountry}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Créer le pays
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des pays */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIB</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {countries.map((country) => (
                      <tr key={country.id} className={`${
                        !country.is_active ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{country.flag_emoji}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{country.name}</div>
                              <div className="text-sm text-gray-500">{country.currency}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.population}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">+{country.gdp_growth_rate}%</div>
                          <div className="text-sm text-gray-500">{country.gdp_per_capita} USD/hab</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.inflation_rate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={async () => {
                              const newStatus = !country.is_active;
                              try {
                                await updateCountry(country.id, { is_active: newStatus });
                                showNotification('success', 
                                  `${country.name} ${newStatus ? 'affiché' : 'masqué'} sur la page économie !`
                                );
                              } catch (error) {
                                showNotification('error', 'Erreur lors du changement de visibilité');
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              country.is_active ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                            title={`${country.is_active ? 'Masquer' : 'Afficher'} ${country.name} sur la page économie`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                country.is_active ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingCountry(country)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCountry(country.id)}
                              className="text-red-600 hover:text-red-900"
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
            </div>

            {/* Modal de modification de pays */}
            {editingCountry && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-3xl">{editingCountry.flag_emoji}</span>
                      Modifier {editingCountry.name}
                    </h3>
                    <button
                      onClick={() => setEditingCountry(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du pays</label>
                      <input
                        type="text"
                        value={editingCountry.name}
                        onChange={(e) => setEditingCountry({...editingCountry, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emoji du drapeau</label>
                      <input
                        type="text"
                        value={editingCountry.flag_emoji}
                        onChange={(e) => setEditingCountry({...editingCountry, flag_emoji: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                      <input
                        type="text"
                        value={editingCountry.currency}
                        onChange={(e) => setEditingCountry({...editingCountry, currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                      <input
                        type="text"
                        value={editingCountry.population}
                        onChange={(e) => setEditingCountry({...editingCountry, population: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Croissance PIB (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingCountry.gdp_growth_rate}
                        onChange={(e) => setEditingCountry({...editingCountry, gdp_growth_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inflation (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingCountry.inflation_rate}
                        onChange={(e) => setEditingCountry({...editingCountry, inflation_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chômage (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingCountry.unemployment_rate}
                        onChange={(e) => setEditingCountry({...editingCountry, unemployment_rate: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PIB/habitant (USD)</label>
                      <input
                        type="number"
                        value={editingCountry.gdp_per_capita}
                        onChange={(e) => setEditingCountry({...editingCountry, gdp_per_capita: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                      <input
                        type="number"
                        value={editingCountry.display_order}
                        onChange={(e) => setEditingCountry({...editingCountry, display_order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secteurs principaux (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={editingCountry.main_sectors?.join(', ') || ''}
                      onChange={(e) => setEditingCountry({...editingCountry, main_sectors: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Agriculture, Mines, Services"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingCountry.description || ''}
                      onChange={(e) => setEditingCountry({...editingCountry, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Description du pays et de son économie..."
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setEditingCountry(null)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleUpdateCountry(editingCountry.id, editingCountry)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Sauvegarder les modifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Métriques */}
        {activeTab === 'metrics' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Métriques Régionales</h2>
              <button
                onClick={() => setShowAddMetricForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Ajouter une métrique
              </button>
            </div>

            {/* Formulaire d'ajout de métrique */}
            {showAddMetricForm && (
              <div className="mb-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Nouvelle Métrique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la métrique</label>
                    <input
                      type="text"
                      value={newMetric.metric_name}
                      onChange={(e) => setNewMetric({...newMetric, metric_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
                    <input
                      type="text"
                      value={newMetric.metric_value}
                      onChange={(e) => setNewMetric({...newMetric, metric_value: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                    <input
                      type="text"
                      value={newMetric.metric_unit}
                      onChange={(e) => setNewMetric({...newMetric, metric_unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                    <select
                      value={newMetric.icon_name}
                      onChange={(e) => setNewMetric({...newMetric, icon_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon.name} value={icon.name}>{icon.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleCreateMetric}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Créer
                  </button>
                  <button
                    onClick={() => setShowAddMetricForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Liste des métriques */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrique</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {regionalMetrics.map((metric) => {
                      const IconComponent = iconOptions.find(icon => icon.name === metric.icon_name)?.component || BarChart3;
                      return (
                        <tr key={metric.id} className={`${
                          !metric.is_active ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <IconComponent className="w-5 h-5 text-amani-primary mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{metric.metric_name}</div>
                                <div className="text-sm text-gray-500">{metric.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{metric.metric_value}{metric.metric_unit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.display_order}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={async () => {
                                const newStatus = !metric.is_active;
                                try {
                                  await updateRegionalMetric(metric.id, { is_active: newStatus });
                                  showNotification('success', 
                                    `Métrique "${metric.metric_name}" ${newStatus ? 'affichée' : 'masquée'} sur la page économie !`
                                  );
                                } catch (error) {
                                  showNotification('error', 'Erreur lors du changement de visibilité');
                                }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                metric.is_active ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                              title={`${metric.is_active ? 'Masquer' : 'Afficher'} "${metric.metric_name}" sur la page économie`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  metric.is_active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingMetric(metric)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMetric(metric.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Contrôles d'Affichage */}
        {activeTab === 'display' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Contrôles d'Affichage de la Page Économie</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Contrôlez quelles sections sont visibles sur la page économie publique.
                </p>

                <div className="space-y-6">
                  {/* Contrôle de l'affichage des pays */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Affichage des Pays</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Contrôlez quels pays apparaissent dans le tableau de bord économique.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {countries.map((country) => (
                        <div key={country.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag_emoji}</span>
                            <span className="font-medium text-gray-900">{country.name}</span>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await updateCountry(country.id, { is_active: !country.is_active });
                                showNotification('success', 
                                  `${country.name} ${country.is_active ? 'masqué' : 'affiché'} avec succès !`
                                );
                              } catch (error) {
                                showNotification('error', 'Erreur lors du changement de visibilité');
                              }
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              country.is_active ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                country.is_active ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contrôle des sections de page */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sections de la Page</h3>
                    <div className="space-y-4">
                      {/* Contrôle des métriques du hero */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Métriques du Header</h3>
                      <p className="text-sm text-gray-600">
                        Affiche les indicateurs économiques en haut de la page (croissance, PIB, etc.)
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await toggleSectionVisibility('hero_metrics');
                          showNotification('success', 
                            `Section métriques ${isSectionVisible('hero_metrics') ? 'masquée' : 'affichée'} avec succès !`
                          );
                        } catch (error) {
                          showNotification('error', 'Erreur lors du changement de visibilité');
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSectionVisible('hero_metrics') ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSectionVisible('hero_metrics') ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Contrôle du tableau de bord économique */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Tableau de Bord Économique</h3>
                      <p className="text-sm text-gray-600">
                        Affiche les cartes des pays avec leurs données économiques (PIB, inflation, etc.)
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await toggleSectionVisibility('economic_dashboard');
                          showNotification('success', 
                            `Tableau de bord ${isSectionVisible('economic_dashboard') ? 'masqué' : 'affiché'} avec succès !`
                          );
                        } catch (error) {
                          showNotification('error', 'Erreur lors du changement de visibilité');
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSectionVisible('economic_dashboard') ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSectionVisible('economic_dashboard') ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Contrôle des articles récents */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Articles Économiques Récents</h3>
                      <p className="text-sm text-gray-600">
                        Affiche la grille des derniers articles économiques publiés
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await toggleSectionVisibility('recent_articles');
                          showNotification('success', 
                            `Articles récents ${isSectionVisible('recent_articles') ? 'masqués' : 'affichés'} avec succès !`
                          );
                        } catch (error) {
                          showNotification('error', 'Erreur lors du changement de visibilité');
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSectionVisible('recent_articles') ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSectionVisible('recent_articles') ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Information</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Les modifications sont appliquées immédiatement sur la page économie publique. 
                        Les sections masquées n'apparaîtront plus pour les visiteurs.
                      </p>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
