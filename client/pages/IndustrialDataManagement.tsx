import React, { useState } from "react";
import { useIndustrialData } from "../hooks/useIndustrialData";
import {
  Factory,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  Building,
  Users,
  DollarSign,
  Zap
} from "lucide-react";

export default function IndustrialDataManagement() {
  const {
    sectors,
    companies,
    metrics,
    loading,
    error,
    createSector,
    updateSector,
    deleteSector,
    createCompany,
    updateCompany,
    deleteCompany,
    createMetric,
    updateMetric,
    deleteMetric
  } = useIndustrialData();

  const [activeTab, setActiveTab] = useState<'metrics' | 'sectors' | 'companies'>('metrics');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form states
  const [metricForm, setMetricForm] = useState({
    metric_name: '',
    metric_value: '',
    metric_unit: '',
    description: '',
    icon_name: 'Factory',
    color: 'text-green-600',
    change_value: '',
    change_description: '',
    is_active: true,
    display_order: 0
  });

  const [sectorForm, setSectorForm] = useState({
    name: '',
    description: '',
    icon_name: 'Factory',
    color: '#373B3A',
    production_value: 0,
    production_unit: 'M€',
    growth_rate: 0,
    employment_count: 0,
    investment_amount: 0,
    investment_unit: 'M€',
    efficiency_improvement: 0,
    is_active: true,
    display_order: 0
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    sector_name: '',
    description: '',
    country: '',
    city: '',
    founded_year: new Date().getFullYear(),
    employee_count: 0,
    revenue_amount: 0,
    revenue_unit: 'M€',
    growth_rate: 0,
    market_cap: 0,
    market_cap_unit: 'M€',
    is_featured: false,
    is_active: true,
    display_order: 0
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handlers pour les métriques
  const handleSaveMetric = async () => {
    try {
      if (editingItem) {
        await updateMetric(editingItem.id, metricForm);
        showNotification('success', 'Métrique mise à jour !');
      } else {
        await createMetric(metricForm);
        showNotification('success', 'Métrique créée !');
      }
      resetMetricForm();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEditMetric = (metric: any) => {
    setEditingItem(metric);
    setMetricForm(metric);
    setShowAddForm(true);
  };

  const resetMetricForm = () => {
    setMetricForm({
      metric_name: '',
      metric_value: '',
      metric_unit: '',
      description: '',
      icon_name: 'Factory',
      color: 'text-green-600',
      change_value: '',
      change_description: '',
      is_active: true,
      display_order: 0
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handlers pour les secteurs
  const handleSaveSector = async () => {
    try {
      if (editingItem) {
        await updateSector(editingItem.id, sectorForm);
        showNotification('success', 'Secteur mis à jour !');
      } else {
        await createSector(sectorForm);
        showNotification('success', 'Secteur créé !');
      }
      resetSectorForm();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEditSector = (sector: any) => {
    setEditingItem(sector);
    setSectorForm(sector);
    setShowAddForm(true);
  };

  const resetSectorForm = () => {
    setSectorForm({
      name: '',
      description: '',
      icon_name: 'Factory',
      color: '#373B3A',
      production_value: 0,
      production_unit: 'M€',
      growth_rate: 0,
      employment_count: 0,
      investment_amount: 0,
      investment_unit: 'M€',
      efficiency_improvement: 0,
      is_active: true,
      display_order: 0
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handlers pour les entreprises
  const handleSaveCompany = async () => {
    try {
      if (editingItem) {
        await updateCompany(editingItem.id, companyForm);
        showNotification('success', 'Entreprise mise à jour !');
      } else {
        await createCompany(companyForm);
        showNotification('success', 'Entreprise créée !');
      }
      resetCompanyForm();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEditCompany = (company: any) => {
    setEditingItem(company);
    setCompanyForm(company);
    setShowAddForm(true);
  };

  const resetCompanyForm = () => {
    setCompanyForm({
      name: '',
      sector_name: '',
      description: '',
      country: '',
      city: '',
      founded_year: new Date().getFullYear(),
      employee_count: 0,
      revenue_amount: 0,
      revenue_unit: 'M€',
      growth_rate: 0,
      market_cap: 0,
      market_cap_unit: 'M€',
      is_featured: false,
      is_active: true,
      display_order: 0
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#373B3A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Données Industrielles</h1>
          <p className="text-gray-600">Gérez les métriques, secteurs et entreprises industrielles</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('metrics');
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'metrics'
                  ? 'border-[#373B3A] text-[#373B3A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline-block mr-2" />
              Métriques ({metrics.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('sectors');
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sectors'
                  ? 'border-[#373B3A] text-[#373B3A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Factory className="w-5 h-5 inline-block mr-2" />
              Secteurs ({sectors.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('companies');
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'companies'
                  ? 'border-[#373B3A] text-[#373B3A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building className="w-5 h-5 inline-block mr-2" />
              Entreprises ({companies.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Métriques Industrielles</h2>
                <button
                  onClick={() => {
                    resetMetricForm();
                    setShowAddForm(true);
                  }}
                  className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle Métrique
                </button>
              </div>


              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métrique</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.map((metric) => (
                      <tr key={metric.id} className={!metric.is_active ? 'opacity-60 bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{metric.metric_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold">{metric.metric_value}{metric.metric_unit}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{metric.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={async () => {
                              await updateMetric(metric.id, { is_active: !metric.is_active });
                              showNotification('success', `Métrique ${!metric.is_active ? 'activée' : 'désactivée'} !`);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              metric.is_active ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              metric.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditMetric(metric)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Supprimer cette métrique ?')) {
                                await deleteMetric(metric.id);
                                showNotification('success', 'Métrique supprimée !');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sectors Tab */}
          {activeTab === 'sectors' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Secteurs Industriels</h2>
                <button 
                  onClick={() => {
                    resetSectorForm();
                    setShowAddForm(true);
                  }}
                  className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Secteur
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectors.map((sector) => (
                  <div key={sector.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg">{sector.name}</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditSector(sector)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Supprimer ce secteur ?')) {
                              await deleteSector(sector.id);
                              showNotification('success', 'Secteur supprimé !');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{sector.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Production:</span>
                        <span className="font-medium">{sector.production_value} {sector.production_unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Croissance:</span>
                        <span className="font-medium text-green-600">+{sector.growth_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Emplois:</span>
                        <span className="font-medium">{sector.employment_count?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Entreprises Industrielles</h2>
                <button 
                  onClick={() => {
                    resetCompanyForm();
                    setShowAddForm(true);
                  }}
                  className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle Entreprise
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{company.name}</h3>
                        <p className="text-sm text-gray-500">{company.sector_name}</p>
                      </div>
                      <div className="flex gap-2">
                        {company.is_featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Vedette
                          </span>
                        )}
                        <button 
                          onClick={() => handleEditCompany(company)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Supprimer cette entreprise ?')) {
                              await deleteCompany(company.id);
                              showNotification('success', 'Entreprise supprimée !');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Pays:</span>
                        <span className="font-medium">{company.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Employés:</span>
                        <span className="font-medium">{company.employee_count?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Croissance:</span>
                        <span className="font-medium text-green-600">+{company.growth_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Chiffre d'affaires:</span>
                        <span className="font-medium">{company.revenue_amount} {company.revenue_unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour Métriques */}
      {showAddForm && activeTab === 'metrics' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier la Métrique' : 'Nouvelle Métrique'}
              </h3>
              <button onClick={resetMetricForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={metricForm.metric_name}
                  onChange={(e) => setMetricForm({ ...metricForm, metric_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Production Industrielle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur *</label>
                <input
                  type="text"
                  value={metricForm.metric_value}
                  onChange={(e) => setMetricForm({ ...metricForm, metric_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+12.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
                <input
                  type="text"
                  value={metricForm.metric_unit}
                  onChange={(e) => setMetricForm({ ...metricForm, metric_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                <select
                  value={metricForm.icon_name}
                  onChange={(e) => setMetricForm({ ...metricForm, icon_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Factory">Factory</option>
                  <option value="Users">Users</option>
                  <option value="DollarSign">DollarSign</option>
                  <option value="Zap">Zap</option>
                  <option value="TrendingUp">TrendingUp</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={metricForm.description}
                  onChange={(e) => setMetricForm({ ...metricForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Croissance annuelle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={metricForm.display_order}
                  onChange={(e) => setMetricForm({ ...metricForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={metricForm.is_active}
                  onChange={(e) => setMetricForm({ ...metricForm, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Actif</label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={resetMetricForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveMetric}
                className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour Secteurs */}
      {showAddForm && activeTab === 'sectors' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier le Secteur' : 'Nouveau Secteur'}
              </h3>
              <button onClick={resetSectorForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={sectorForm.name}
                  onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Manufacture"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                <select
                  value={sectorForm.icon_name}
                  onChange={(e) => setSectorForm({ ...sectorForm, icon_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Factory">Factory</option>
                  <option value="Zap">Zap</option>
                  <option value="Building">Building</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={sectorForm.description}
                  onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Description du secteur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Production</label>
                <input
                  type="number"
                  value={sectorForm.production_value}
                  onChange={(e) => setSectorForm({ ...sectorForm, production_value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unité Production</label>
                <input
                  type="text"
                  value={sectorForm.production_unit}
                  onChange={(e) => setSectorForm({ ...sectorForm, production_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="M€"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taux de croissance (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sectorForm.growth_rate}
                  onChange={(e) => setSectorForm({ ...sectorForm, growth_rate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'emplois</label>
                <input
                  type="number"
                  value={sectorForm.employment_count}
                  onChange={(e) => setSectorForm({ ...sectorForm, employment_count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={sectorForm.display_order}
                  onChange={(e) => setSectorForm({ ...sectorForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={sectorForm.is_active}
                  onChange={(e) => setSectorForm({ ...sectorForm, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Actif</label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={resetSectorForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveSector}
                className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour Entreprises */}
      {showAddForm && activeTab === 'companies' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier l\'Entreprise' : 'Nouvelle Entreprise'}
              </h3>
              <button onClick={resetCompanyForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
                <input
                  type="text"
                  value={companyForm.sector_name}
                  onChange={(e) => setCompanyForm({ ...companyForm, sector_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Manufacture"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  value={companyForm.country}
                  onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Côte d'Ivoire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Abidjan"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Description de l'entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Année de fondation</label>
                <input
                  type="number"
                  value={companyForm.founded_year}
                  onChange={(e) => setCompanyForm({ ...companyForm, founded_year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'employés</label>
                <input
                  type="number"
                  value={companyForm.employee_count}
                  onChange={(e) => setCompanyForm({ ...companyForm, employee_count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chiffre d'affaires</label>
                <input
                  type="number"
                  step="0.1"
                  value={companyForm.revenue_amount}
                  onChange={(e) => setCompanyForm({ ...companyForm, revenue_amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unité CA</label>
                <input
                  type="text"
                  value={companyForm.revenue_unit}
                  onChange={(e) => setCompanyForm({ ...companyForm, revenue_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="M€"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taux de croissance (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={companyForm.growth_rate}
                  onChange={(e) => setCompanyForm({ ...companyForm, growth_rate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={companyForm.display_order}
                  onChange={(e) => setCompanyForm({ ...companyForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={companyForm.is_featured}
                  onChange={(e) => setCompanyForm({ ...companyForm, is_featured: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">En vedette</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={companyForm.is_active}
                  onChange={(e) => setCompanyForm({ ...companyForm, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Actif</label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={resetCompanyForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCompany}
                className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}