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
  Save,
  Upload,
  BarChart3,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
} from 'lucide-react';

interface MarcheSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  position: number;
  isVisible: boolean;
  type: 'hero' | 'indices' | 'actions' | 'analysis' | 'news';
  lastUpdate: string;
}

export default function MarcheManagement() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingSection, setEditingSection] = useState<MarcheSection | null>(null);

  // Vérification des permissions
  if (!user || !hasPermission('create_indices')) {
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
              Vous n'avez pas les permissions nécessaires pour gérer la page Marché.
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

  // Sections de la page Marché
  const [sections, setSections] = useState<MarcheSection[]>([
    {
      id: '1',
      title: 'Marchés Financiers Africains',
      subtitle: 'Suivez l\'évolution des principaux marchés de la région',
      content: 'Découvrez les dernières tendances des marchés financiers ouest-africains avec nos analyses en temps réel.',
      position: 1,
      isVisible: true,
      type: 'hero',
      lastUpdate: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Indices Principaux',
      subtitle: 'BRVM 10, BRVM Composite et autres indices',
      content: 'Suivez en temps réel les principaux indices boursiers de la région UEMOA.',
      position: 2,
      isVisible: true,
      type: 'indices',
      lastUpdate: '2024-03-15T10:30:00Z'
    },
    {
      id: '3',
      title: 'Actions Vedettes',
      subtitle: 'Les actions les plus performantes',
      content: 'Découvrez les actions qui font l\'actualité avec leurs variations en temps réel.',
      position: 3,
      isVisible: true,
      type: 'actions',
      lastUpdate: '2024-03-15T11:00:00Z'
    },
    {
      id: '4',
      title: 'Analyses Marché',
      subtitle: 'Perspectives et recommandations',
      content: 'Nos experts analysent les tendances et vous donnent leurs recommandations d\'investissement.',
      position: 4,
      isVisible: true,
      type: 'analysis',
      lastUpdate: '2024-03-15T09:00:00Z'
    },
    {
      id: '5',
      title: 'Actualités Marché',
      subtitle: 'Les dernières nouvelles financières',
      content: 'Restez informé des dernières actualités qui impactent les marchés africains.',
      position: 5,
      isVisible: true,
      type: 'news',
      lastUpdate: '2024-03-15T08:30:00Z'
    }
  ]);

  const sectionTypes = [
    { value: 'all', label: 'Toutes les sections' },
    { value: 'hero', label: 'Section Hero' },
    { value: 'indices', label: 'Indices' },
    { value: 'actions', label: 'Actions' },
    { value: 'analysis', label: 'Analyses' },
    { value: 'news', label: 'Actualités' }
  ];

  const filteredSections = sections.filter(section => {
    const matchesSearch = 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || section.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSave = (section: MarcheSection) => {
    if (editingSection) {
      setSections(prev => prev.map(s => s.id === section.id ? section : s));
      success('Mis à jour', `Section "${section.title}" mise à jour`);
    } else {
      const newSection = { ...section, id: Date.now().toString(), lastUpdate: new Date().toISOString() };
      setSections(prev => [...prev, newSection]);
      success('Ajouté', `Section "${section.title}" ajoutée`);
    }
    setEditingSection(null);
  };

  const handleDelete = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section && confirm(`Êtes-vous sûr de vouloir supprimer "${section.title}" ?`)) {
      setSections(prev => prev.filter(s => s.id !== id));
      warning('Supprimé', `Section "${section.title}" supprimée`);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    ));
    const section = sections.find(s => s.id === id);
    if (section) {
      success('Visibilité', `Section "${section.title}" ${section.isVisible ? 'masquée' : 'affichée'}`);
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = sectionTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-purple-100 text-purple-800';
      case 'indices': return 'bg-blue-100 text-blue-800';
      case 'actions': return 'bg-green-100 text-green-800';
      case 'analysis': return 'bg-orange-100 text-orange-800';
      case 'news': return 'bg-red-100 text-red-800';
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
      label: 'Sections masquées',
      value: sections.filter(s => !s.isVisible).length.toString(),
      icon: Eye,
      color: 'text-gray-600',
      bg: 'bg-gray-100'
    },
    {
      label: 'Total sections',
      value: sections.length.toString(),
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Dernière MAJ',
      value: 'Aujourd\'hui',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <DashboardLayout
      title="Gestion de la Page Marché"
      subtitle="Gérez le contenu et l'organisation de la page publique Marché"
      actions={
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('/marche', '_blank')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Voir la page
          </button>
          
          <button
            onClick={() => setEditingSection({ 
              id: '', title: '', subtitle: '', content: '', position: sections.length + 1, 
              isVisible: true, type: 'hero', lastUpdate: ''
            })}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-medium"
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
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
          >
            {sectionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
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

        {/* Liste des sections */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Sections de la Page Marché ({filteredSections.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSections
              .sort((a, b) => a.position - b.position)
              .map((section) => (
                <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                          Position {section.position}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(section.type)}`}>
                          {getTypeLabel(section.type)}
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
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {section.content}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        Dernière modification : {new Date(section.lastUpdate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleVisibility(section.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          section.isVisible
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={section.isVisible ? 'Masquer' : 'Afficher'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingSection(section)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {filteredSections.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune section trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  Aucune section ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={() => setEditingSection({ 
                    id: '', title: '', subtitle: '', content: '', position: sections.length + 1, 
                    isVisible: true, type: 'hero', lastUpdate: ''
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter la première section
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
