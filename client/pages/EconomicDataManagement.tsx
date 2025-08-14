import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Save,
  BarChart3,
  PieChart,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Percent,
  Users,
  Building,
} from 'lucide-react';

interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  country: string;
  category: 'inflation' | 'gdp' | 'unemployment' | 'trade' | 'monetary' | 'fiscal';
  frequency: 'monthly' | 'quarterly' | 'yearly';
  lastUpdate: string;
  source: string;
  status: 'active' | 'archived';
}

export default function EconomicDataManagement() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<EconomicIndicator | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // Vérification des permissions
  if (!user || !hasPermission('create_economic_reports')) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Permissions insuffisantes"
      >
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour gérer les données économiques.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Données de démo
  const [economicData, setEconomicData] = useState<EconomicIndicator[]>([
    {
      id: '1',
      name: 'Taux d\'inflation',
      value: 3.2,
      unit: '%',
      change: 0.3,
      changePercent: 10.34,
      country: 'Mali',
      category: 'inflation',
      frequency: 'monthly',
      lastUpdate: '2024-03-15T10:00:00Z',
      source: 'INSTAT Mali',
      status: 'active'
    },
    {
      id: '2',
      name: 'PIB (croissance)',
      value: 5.8,
      unit: '%',
      change: 0.2,
      changePercent: 3.57,
      country: 'Mali',
      category: 'gdp',
      frequency: 'quarterly',
      lastUpdate: '2024-03-10T08:00:00Z',
      source: 'BCEAO',
      status: 'active'
    },
    {
      id: '3',
      name: 'Taux de chômage',
      value: 12.5,
      unit: '%',
      change: -0.8,
      changePercent: -6.02,
      country: 'Burkina Faso',
      category: 'unemployment',
      frequency: 'quarterly',
      lastUpdate: '2024-03-12T12:00:00Z',
      source: 'INSD Burkina',
      status: 'active'
    },
    {
      id: '4',
      name: 'Balance commerciale',
      value: -250.5,
      unit: 'M USD',
      change: -45.2,
      changePercent: -22.02,
      country: 'Niger',
      category: 'trade',
      frequency: 'monthly',
      lastUpdate: '2024-03-14T14:30:00Z',
      source: 'Ministère Commerce Niger',
      status: 'active'
    },
    {
      id: '5',
      name: 'Taux directeur BCEAO',
      value: 2.5,
      unit: '%',
      change: 0.0,
      changePercent: 0.0,
      country: 'UEMOA',
      category: 'monetary',
      frequency: 'monthly',
      lastUpdate: '2024-03-01T16:00:00Z',
      source: 'BCEAO',
      status: 'active'
    }
  ]);

  const categories = [
    { value: 'all', label: 'Toutes catégories' },
    { value: 'inflation', label: 'Inflation' },
    { value: 'gdp', label: 'PIB & Croissance' },
    { value: 'unemployment', label: 'Emploi' },
    { value: 'trade', label: 'Commerce' },
    { value: 'monetary', label: 'Politique monétaire' },
    { value: 'fiscal', label: 'Politique fiscale' }
  ];

  const countries = [
    { value: 'all', label: 'Tous les pays' },
    { value: 'Mali', label: 'Mali' },
    { value: 'Burkina Faso', label: 'Burkina Faso' },
    { value: 'Niger', label: 'Niger' },
    { value: 'Sénégal', label: 'Sénégal' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire' },
    { value: 'UEMOA', label: 'UEMOA' }
  ];

  const filteredData = economicData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesCountry = countryFilter === 'all' || item.country === countryFilter;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const handleSave = (item: EconomicIndicator) => {
    if (editingItem) {
      setEconomicData(prev => prev.map(d => d.id === item.id ? item : d));
      success('Mis à jour', `${item.name} mis à jour avec succès`);
    } else {
      const newItem = { ...item, id: Date.now().toString(), lastUpdate: new Date().toISOString() };
      setEconomicData(prev => [...prev, newItem]);
      success('Ajouté', `${item.name} ajouté avec succès`);
    }
    setEditingItem(null);
    setShowNewForm(false);
  };

  const handleDelete = (id: string) => {
    const item = economicData.find(d => d.id === id);
    if (item && confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      setEconomicData(prev => prev.filter(d => d.id !== id));
      warning('Supprimé', `${item.name} supprimé`);
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return BarChart3;
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inflation': return Percent;
      case 'gdp': return TrendingUp;
      case 'unemployment': return Users;
      case 'trade': return Globe;
      case 'monetary': return DollarSign;
      case 'fiscal': return Building;
      default: return BarChart3;
    }
  };

  const stats = [
    {
      label: 'Indicateurs actifs',
      value: economicData.filter(d => d.status === 'active').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'En amélioration',
      value: economicData.filter(d => d.change > 0).length.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'En dégradation',
      value: economicData.filter(d => d.change < 0).length.toString(),
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      label: 'Pays couverts',
      value: new Set(economicData.map(d => d.country)).size.toString(),
      icon: Globe,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <DashboardLayout
      title="Gestion des Données Économiques"
      subtitle="Gérez les indicateurs économiques et statistiques"
      actions={
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Ajouter indicateur
          </button>
          
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 min-w-[300px] shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un indicateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm placeholder-gray-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            {countries.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Liste des indicateurs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Indicateurs Économiques ({filteredData.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredData.map((item) => {
              const ChangeIcon = getChangeIcon(item.change);
              const CategoryIcon = getCategoryIcon(item.category);
              
              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <CategoryIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {getCategoryLabel(item.category)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {item.country}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xl text-gray-900">
                              {item.value}{item.unit}
                            </span>
                            <div className={`flex items-center gap-1 ${getChangeColor(item.change)}`}>
                              <ChangeIcon className="w-4 h-4" />
                              {item.change > 0 ? '+' : ''}{item.change}{item.unit}
                              <span className="text-xs">
                                ({item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                          
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.lastUpdate).toLocaleDateString('fr-FR')}
                          </span>
                          
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {item.source}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun indicateur trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Aucun indicateur ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter le premier indicateur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
