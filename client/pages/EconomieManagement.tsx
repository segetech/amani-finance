import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  PieChart,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  TrendingUp,
  Globe,
} from 'lucide-react';

interface EconomieSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  position: number;
  isVisible: boolean;
  type: 'hero' | 'indicators' | 'analysis' | 'news' | 'reports' | 'trends';
  lastUpdate: string;
}

export default function EconomieManagement() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

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
              Vous n'avez pas les permissions nécessaires pour gérer la page Économie.
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

  // Sections de la page Économie
  const [sections, setSections] = useState<EconomieSection[]>([
    {
      id: '1',
      title: 'Économie Ouest-Africaine',
      subtitle: 'Analyses et perspectives économiques de la région',
      content: 'Suivez l\'évolution économique des pays de l\'Afrique de l\'Ouest avec nos analyses approfondies.',
      position: 1,
      isVisible: true,
      type: 'hero',
      lastUpdate: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Indicateurs Économiques',
      subtitle: 'PIB, inflation, taux de change et plus',
      content: 'Consultez les principaux indicateurs économiques de la région UEMOA en temps réel.',
      position: 2,
      isVisible: true,
      type: 'indicators',
      lastUpdate: '2024-03-15T10:30:00Z'
    },
    {
      id: '3',
      title: 'Analyses Économiques',
      subtitle: 'Études approfondies par nos experts',
      content: 'Découvrez nos analyses détaillées sur les tendances économiques et leurs impacts.',
      position: 3,
      isVisible: true,
      type: 'analysis',
      lastUpdate: '2024-03-15T11:00:00Z'
    },
    {
      id: '4',
      title: 'Actualités Économiques',
      subtitle: 'Les dernières nouvelles économiques',
      content: 'Restez informé des dernières actualités économiques qui façonnent notre région.',
      position: 4,
      isVisible: true,
      type: 'news',
      lastUpdate: '2024-03-15T09:00:00Z'
    },
    {
      id: '5',
      title: 'Rapports Économiques',
      subtitle: 'Rapports trimestriels et annuels',
      content: 'Accédez aux rapports économiques complets sur la performance régionale.',
      position: 5,
      isVisible: true,
      type: 'reports',
      lastUpdate: '2024-03-15T08:30:00Z'
    }
  ]);

  const sectionTypes = [
    { value: 'all', label: 'Toutes les sections' },
    { value: 'hero', label: 'Section Hero' },
    { value: 'indicators', label: 'Indicateurs' },
    { value: 'analysis', label: 'Analyses' },
    { value: 'news', label: 'Actualités' },
    { value: 'reports', label: 'Rapports' },
    { value: 'trends', label: 'Tendances' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-purple-100 text-purple-800';
      case 'indicators': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-green-100 text-green-800';
      case 'news': return 'bg-orange-100 text-orange-800';
      case 'reports': return 'bg-red-100 text-red-800';
      case 'trends': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      label: 'Sections actives',
      value: sections.filter(s => s.isVisible).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Indicateurs suivis',
      value: '12',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Pays couverts',
      value: '8',
      icon: Globe,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'Rapports publiés',
      value: '24',
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <DashboardLayout
      title="Gestion de la Page Économie"
      subtitle="Gérez le contenu économique et les indicateurs de la page publique"
      actions={
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('/economie', '_blank')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Voir la page
          </button>
          
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Ajouter section
          </button>
          
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 min-w-[300px] shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm placeholder-gray-500"
            />
          </div>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Actions Rapides
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left">
                <PieChart className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Mettre à jour indicateurs</h3>
                <p className="text-sm text-gray-600">PIB, inflation, emploi</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left">
                <FileText className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Nouveau rapport</h3>
                <p className="text-sm text-gray-600">Rapport économique</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left">
                <TrendingUp className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Analyse tendance</h3>
                <p className="text-sm text-gray-600">Nouvelle analyse</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                <Globe className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Données pays</h3>
                <p className="text-sm text-gray-600">Mettre à jour</p>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des sections */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Sections de la Page Économie ({sections.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section) => (
              <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        Position {section.position}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(section.type)}`}>
                        {sectionTypes.find(t => t.value === section.type)?.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        section.isVisible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {section.isVisible ? 'Visible' : 'Masqué'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {section.subtitle}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {section.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
