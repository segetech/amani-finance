import React, { useState } from "react";
import { useInvestmentData } from "../hooks/useInvestmentData";
import { supabase } from "../lib/supabase";
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  Building,
  BarChart3,
  Globe,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function InvestmentDataManagement() {
  const {
    categories,
    opportunities,
    metrics,
    trends,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    createMetric,
    updateMetric,
    deleteMetric,
    createTrend,
    updateTrend,
    deleteTrend
  } = useInvestmentData();

  const [activeTab, setActiveTab] = useState<'metrics' | 'opportunities' | 'trends' | 'categories'>('metrics');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    type: 'metric' | 'opportunity' | 'trend' | null;
    item: any;
    title: string;
  }>({ show: false, type: null, item: null, title: '' });

  // Form states
  const [metricForm, setMetricForm] = useState({
    metric_name: '',
    metric_value: '',
    metric_unit: '',
    change_value: '',
    change_description: '',
    description: '',
    icon_name: 'DollarSign',
    color: 'text-green-600',
    is_active: true,
    display_order: 0
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    category_name: '',
    description: '',
    risk_level: 'Modéré' as 'Faible' | 'Modéré' | 'Élevé',
    expected_return_min: 0,
    expected_return_max: 0,
    min_investment_amount: 0,
    min_investment_unit: '€',
    time_horizon_min: 0,
    time_horizon_max: 0,
    status: 'Ouvert' as 'Ouvert' | 'Bientôt' | 'Fermé',
    funded_percentage: 0,
    image_url: '',
    highlights: [] as string[],
    is_featured: false,
    is_active: true,
    display_order: 0
  });

  const [trendForm, setTrendForm] = useState({
    title: '',
    growth_percentage: '',
    description: '',
    icon_name: 'TrendingUp',
    color: 'text-green-600',
    is_active: true,
    display_order: 0
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fonction pour ouvrir le modal de suppression
  const openDeleteModal = (type: 'metric' | 'opportunity' | 'trend', item: any, title: string) => {
    setShowDeleteModal({ show: true, type, item, title });
  };

  // Fonction pour fermer le modal de suppression
  const closeDeleteModal = () => {
    setShowDeleteModal({ show: false, type: null, item: null, title: '' });
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = async () => {
    const { type, item } = showDeleteModal;
    try {
      switch (type) {
        case 'metric':
          await deleteMetric(item.id);
          showNotification('success', 'Métrique supprimée avec succès !');
          break;
        case 'opportunity':
          await deleteOpportunity(item.id);
          showNotification('success', 'Opportunité supprimée avec succès !');
          break;
        case 'trend':
          await deleteTrend(item.id);
          showNotification('success', 'Tendance supprimée avec succès !');
          break;
      }
      closeDeleteModal();
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression');
    }
  };

  // Fonction pour prévisualiser l'image avant upload
  const handleImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setOpportunityForm({ ...opportunityForm, image_url: previewUrl });
    };
    reader.readAsDataURL(file);
    
    // Lancer l'upload en arrière-plan
    handleImageUpload(file);
  };

  // Fonction pour supprimer une ancienne image Supabase
  const deleteOldSupabaseImage = async (imageUrl: string) => {
    if (imageUrl && imageUrl.includes('supabase')) {
      try {
        // Extraire le chemin du fichier de l'URL Supabase
        const urlParts = imageUrl.split('/storage/v1/object/public/images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from('images').remove([filePath]);
          console.log('Ancienne image supprimée:', filePath);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne image:', error);
      }
    }
  };

  // Fonction pour uploader une image vers Supabase Storage
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const oldImageUrl = opportunityForm.image_url;
    
    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `investment-opportunities/${fileName}`;

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Supprimer l'ancienne image si elle était sur Supabase
      if (oldImageUrl && oldImageUrl.includes('supabase') && !oldImageUrl.startsWith('data:')) {
        await deleteOldSupabaseImage(oldImageUrl);
      }

      // Mettre à jour le formulaire avec l'URL Supabase
      setOpportunityForm({ ...opportunityForm, image_url: publicUrl });
      showNotification('success', 'Image uploadée avec succès sur Supabase Storage !');
      
    } catch (error) {
      console.error('Erreur upload Supabase:', error);
      showNotification('error', `Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      // Garder l'aperçu local en cas d'erreur d'upload
    } finally {
      setUploadingImage(false);
    }
  };

  // Fonction pour ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await createCategory({
        name: newCategoryName,
        description: '',
        icon_name: 'DollarSign',
        color: '#373B3A',
        is_active: true,
        display_order: categories.length
      });
      
      setOpportunityForm({ ...opportunityForm, category_name: newCategoryName });
      setNewCategoryName('');
      setShowAddCategory(false);
      showNotification('success', 'Catégorie ajoutée avec succès !');
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'ajout de la catégorie');
    }
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
      change_value: '',
      change_description: '',
      description: '',
      icon_name: 'DollarSign',
      color: 'text-green-600',
      is_active: true,
      display_order: 0
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handlers pour les opportunités
  const handleSaveOpportunity = async () => {
    try {
      if (editingItem) {
        await updateOpportunity(editingItem.id, opportunityForm);
        showNotification('success', 'Opportunité mise à jour !');
      } else {
        await createOpportunity(opportunityForm);
        showNotification('success', 'Opportunité créée !');
      }
      resetOpportunityForm();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEditOpportunity = (opportunity: any) => {
    setEditingItem(opportunity);
    setOpportunityForm(opportunity);
    setShowAddForm(true);
  };

  const resetOpportunityForm = () => {
    setOpportunityForm({
      title: '',
      category_name: '',
      description: '',
      risk_level: 'Modéré',
      expected_return_min: 0,
      expected_return_max: 0,
      min_investment_amount: 0,
      min_investment_unit: '€',
      time_horizon_min: 0,
      time_horizon_max: 0,
      status: 'Ouvert',
      funded_percentage: 0,
      image_url: '',
      highlights: [],
      is_featured: false,
      is_active: true,
      display_order: 0
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  // Handlers pour les tendances
  const handleSaveTrend = async () => {
    try {
      if (editingItem) {
        await updateTrend(editingItem.id, trendForm);
        showNotification('success', 'Tendance mise à jour !');
      } else {
        await createTrend(trendForm);
        showNotification('success', 'Tendance créée !');
      }
      resetTrendForm();
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEditTrend = (trend: any) => {
    setEditingItem(trend);
    setTrendForm(trend);
    setShowAddForm(true);
  };

  const resetTrendForm = () => {
    setTrendForm({
      title: '',
      growth_percentage: '',
      description: '',
      icon_name: 'TrendingUp',
      color: 'text-green-600',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Données d'Investissement</h1>
          <p className="text-gray-600">Gérez les métriques, opportunités, tendances et catégories d'investissement</p>
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
              <BarChart3 className="w-5 h-5 inline-block mr-2" />
              Métriques ({metrics.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('opportunities');
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-[#373B3A] text-[#373B3A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-5 h-5 inline-block mr-2" />
              Opportunités ({opportunities.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('trends');
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trends'
                  ? 'border-[#373B3A] text-[#373B3A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline-block mr-2" />
              Tendances ({trends.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Métriques d'Investissement</h2>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.map((metric) => (
                      <tr key={metric.id} className={!metric.is_active ? 'opacity-60 bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{metric.metric_name}</div>
                          <div className="text-sm text-gray-500">{metric.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold">{metric.metric_value}{metric.metric_unit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600">{metric.change_value}</span>
                          <div className="text-sm text-gray-500">{metric.change_description}</div>
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
                            onClick={() => openDeleteModal('metric', metric, metric.metric_name)}
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

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Opportunités d'Investissement</h2>
                <button 
                  onClick={() => {
                    resetOpportunityForm();
                    setShowAddForm(true);
                  }}
                  className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle Opportunité
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{opportunity.title}</h3>
                        <p className="text-sm text-gray-500">{opportunity.category_name}</p>
                      </div>
                      <div className="flex gap-2">
                        {opportunity.is_featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Vedette
                          </span>
                        )}
                        <button 
                          onClick={() => handleEditOpportunity(opportunity)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Supprimer cette opportunité ?')) {
                              await deleteOpportunity(opportunity.id);
                              showNotification('success', 'Opportunité supprimée !');
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
                        <span className="text-sm text-gray-500">Rendement:</span>
                        <span className="font-medium text-green-600">{opportunity.expected_return_min}-{opportunity.expected_return_max}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Risque:</span>
                        <span className={`font-medium ${
                          opportunity.risk_level === 'Faible' ? 'text-green-600' :
                          opportunity.risk_level === 'Modéré' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{opportunity.risk_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Min. investissement:</span>
                        <span className="font-medium">{opportunity.min_investment_amount.toLocaleString()} {opportunity.min_investment_unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Statut:</span>
                        <span className={`font-medium ${
                          opportunity.status === 'Ouvert' ? 'text-green-600' :
                          opportunity.status === 'Bientôt' ? 'text-blue-600' : 'text-gray-600'
                        }`}>{opportunity.status}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Financement</span>
                          <span>{opportunity.funded_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#373B3A] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${opportunity.funded_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Tendances du Marché</h2>
                <button 
                  onClick={() => {
                    resetTrendForm();
                    setShowAddForm(true);
                  }}
                  className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle Tendance
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trends.map((trend) => (
                  <div key={trend.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center justify-center mb-3 w-full">
                        <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                        <span className="text-2xl font-bold text-green-600">{trend.growth_percentage}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditTrend(trend)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Supprimer cette tendance ?')) {
                              await deleteTrend(trend.id);
                              showNotification('success', 'Tendance supprimée !');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{trend.title}</h3>
                    <p className="text-sm text-gray-600">{trend.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour Opportunités */}
      {showAddForm && activeTab === 'opportunities' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier l\'Opportunité' : 'Nouvelle Opportunité'}
              </h3>
              <button onClick={resetOpportunityForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={opportunityForm.title}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="FinTech Revolution : Solutions de paiement mobile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <div className="flex gap-2">
                  <select
                    value={opportunityForm.category_name}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, category_name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center"
                    title="Ajouter une nouvelle catégorie"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showAddCategory && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Nom de la nouvelle catégorie"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-1 bg-[#373B3A] text-white rounded-md text-sm hover:bg-[#373B3A]/90"
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de risque</label>
                <select
                  value={opportunityForm.risk_level}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, risk_level: e.target.value as 'Faible' | 'Modéré' | 'Élevé' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Faible">Faible</option>
                  <option value="Modéré">Modéré</option>
                  <option value="Élevé">Élevé</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={opportunityForm.description}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Description détaillée de l'opportunité d'investissement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rendement min (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={opportunityForm.expected_return_min || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, expected_return_min: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rendement max (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={opportunityForm.expected_return_max || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, expected_return_max: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investissement minimum</label>
                <input
                  type="number"
                  value={opportunityForm.min_investment_amount || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, min_investment_amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
                <input
                  type="text"
                  value={opportunityForm.min_investment_unit}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, min_investment_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="€"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horizon min (années)</label>
                <input
                  type="number"
                  value={opportunityForm.time_horizon_min || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, time_horizon_min: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horizon max (années)</label>
                <input
                  type="number"
                  value={opportunityForm.time_horizon_max || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, time_horizon_max: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={opportunityForm.status}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, status: e.target.value as 'Ouvert' | 'Bientôt' | 'Fermé' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Ouvert">Ouvert</option>
                  <option value="Bientôt">Bientôt</option>
                  <option value="Fermé">Fermé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Financement (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={opportunityForm.funded_percentage || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, funded_percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de l'opportunité</label>
                <div className="space-y-4">
                  {/* Zone d'aperçu de l'image */}
                  {opportunityForm.image_url ? (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                        <img
                          src={opportunityForm.image_url}
                          alt="Aperçu de l'opportunité"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            console.error('Erreur de chargement d\'image:', opportunityForm.image_url);
                            showNotification('error', 'Erreur de chargement de l\'image');
                          }}
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-sm">Upload en cours...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          // Supprimer l'image de Supabase si c'est une image uploadée
                          if (opportunityForm.image_url.includes('supabase')) {
                            await deleteOldSupabaseImage(opportunityForm.image_url);
                          }
                          setOpportunityForm({ ...opportunityForm, image_url: '' });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer l'image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {!uploadingImage && opportunityForm.image_url.startsWith('data:') && (
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          📷 Aperçu local
                        </div>
                      )}
                      {!uploadingImage && opportunityForm.image_url.includes('supabase') && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          ✅ Supabase Storage
                        </div>
                      )}
                      {!uploadingImage && opportunityForm.image_url.startsWith('http') && !opportunityForm.image_url.includes('supabase') && (
                        <div className="absolute bottom-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                          🌐 URL externe
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-2">Aucune image sélectionnée</p>
                      <p className="text-sm text-gray-400">Uploadez une image ou collez une URL</p>
                    </div>
                  )}

                  {/* Contrôles d'upload */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#373B3A] text-white rounded-md hover:bg-[#373B3A]/90 cursor-pointer transition-colors min-w-fit">
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Upload en cours...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Choisir une image
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Vérifier la taille du fichier (max 10MB)
                            if (file.size > 10 * 1024 * 1024) {
                              showNotification('error', 'L\'image doit faire moins de 10MB');
                              return;
                            }
                            
                            // Vérifier le type de fichier
                            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
                            if (!allowedTypes.includes(file.type)) {
                              showNotification('error', 'Format d\'image non supporté. Utilisez JPEG, PNG, WebP ou GIF.');
                              return;
                            }
                            
                            handleImagePreview(file);
                          }
                        }}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-gray-500 whitespace-nowrap">ou</span>
                      <input
                        type="url"
                        value={opportunityForm.image_url.startsWith('data:') ? '' : opportunityForm.image_url}
                        onChange={(e) => setOpportunityForm({ ...opportunityForm, image_url: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#373B3A] focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                        disabled={uploadingImage}
                      />
                    </div>
                  </div>

                  {/* Informations sur les formats acceptés */}
                  <div className="text-xs text-gray-500">
                    <p>Formats acceptés : JPEG, PNG, WebP, GIF (max 10MB)</p>
                    <p>Recommandé : 400x250px pour un affichage optimal</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Points clés (séparés par des virgules)</label>
                <input
                  type="text"
                  value={opportunityForm.highlights.join(', ')}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, highlights: e.target.value.split(', ').filter(h => h.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Marché en croissance, Technologie éprouvée, Équipe expérimentée"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={opportunityForm.display_order || ''}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityForm.is_featured}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, is_featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">En vedette</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityForm.is_active}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Actif</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={resetOpportunityForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveOpportunity}
                className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour Tendances */}
      {showAddForm && activeTab === 'trends' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier la Tendance' : 'Nouvelle Tendance'}
              </h3>
              <button onClick={resetTrendForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  value={trendForm.title}
                  onChange={(e) => setTrendForm({ ...trendForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Intelligence Artificielle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Croissance *</label>
                <input
                  type="text"
                  value={trendForm.growth_percentage}
                  onChange={(e) => setTrendForm({ ...trendForm, growth_percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+45%"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={trendForm.description}
                  onChange={(e) => setTrendForm({ ...trendForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="L'IA transforme les industries africaines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                <select
                  value={trendForm.icon_name}
                  onChange={(e) => setTrendForm({ ...trendForm, icon_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="TrendingUp">TrendingUp</option>
                  <option value="BarChart3">BarChart3</option>
                  <option value="DollarSign">DollarSign</option>
                  <option value="Zap">Zap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={trendForm.display_order}
                  onChange={(e) => setTrendForm({ ...trendForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center col-span-2">
                <input
                  type="checkbox"
                  checked={trendForm.is_active}
                  onChange={(e) => setTrendForm({ ...trendForm, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Actif</label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={resetTrendForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTrend}
                className="bg-[#373B3A] text-white px-4 py-2 rounded-lg hover:bg-[#373B3A]/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

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
                  placeholder="Capitaux Investis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur *</label>
                <input
                  type="text"
                  value={metricForm.metric_value}
                  onChange={(e) => setMetricForm({ ...metricForm, metric_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="125"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
                <input
                  type="text"
                  value={metricForm.metric_unit}
                  onChange={(e) => setMetricForm({ ...metricForm, metric_unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="M€"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Changement</label>
                <input
                  type="text"
                  value={metricForm.change_value}
                  onChange={(e) => setMetricForm({ ...metricForm, change_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+15.3%"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description du changement</label>
                <input
                  type="text"
                  value={metricForm.change_description}
                  onChange={(e) => setMetricForm({ ...metricForm, change_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ce trimestre"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={metricForm.description}
                  onChange={(e) => setMetricForm({ ...metricForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Total des capitaux investis dans la région"
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
    </div>
  );
}
