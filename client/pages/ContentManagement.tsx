import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Image, 
  Video, 
  BarChart3,
  Search,
  Filter,
  TrendingUp,
  Mic,
  Settings,
  ExternalLink,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const ContentManagement = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Vérification des permissions
  if (!user || !hasPermission('create_articles')) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Permissions insuffisantes"
      >
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour gérer le contenu.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const contentSections = [
    { id: 'all', name: 'Tout le contenu', icon: FileText, color: 'text-gray-600', count: 24 },
    { id: 'economie', name: 'Économie', icon: BarChart3, color: 'text-green-600', count: 8 },
    { id: 'marche', name: 'Marchés', icon: TrendingUp, color: 'text-blue-600', count: 6 },
    { id: 'industrie', name: 'Industrie', icon: Settings, color: 'text-purple-600', count: 4 },
    { id: 'tech', name: 'Technologie', icon: FileText, color: 'text-indigo-600', count: 3 },
    { id: 'podcast', name: 'Podcasts', icon: Mic, color: 'text-pink-600', count: 3 }
  ];

  const contentItems = [
    {
      id: 1,
      title: "Analyse du marché boursier africain Q1 2024",
      section: "Marchés",
      type: "Article",
      status: "Publié",
      author: "Dr. Amina Kone",
      date: "2024-03-15",
      views: "5.2K",
      featured: true,
      editPath: "/dashboard/articles/1/edit"
    },
    {
      id: 2,
      title: "L'impact de l'IA sur l'économie africaine", 
      section: "Technologie",
      type: "Article",
      status: "Brouillon",
      author: "Prof. Jean-Baptiste",
      date: "2024-03-14",
      views: "0",
      featured: false,
      editPath: "/dashboard/articles/2/edit"
    },
    {
      id: 3,
      title: "Podcast: L'avenir de la fintech en Afrique",
      section: "Podcasts",
      type: "Podcast",
      status: "Publié",
      author: "Sarah Diallo",
      date: "2024-03-13",
      views: "3.1K",
      featured: true,
      editPath: "/dashboard/podcasts/3/edit"
    },
    {
      id: 4,
      title: "Opportunités d'investissement dans l'agriculture",
      section: "Économie",
      type: "Article",
      status: "En révision",
      author: "Mohamed El Fassi",
      date: "2024-03-12",
      views: "1.8K",
      featured: false,
      editPath: "/dashboard/articles/4/edit"
    },
    {
      id: 5,
      title: "Indice économique Mali - Mars 2024",
      section: "Économie",
      type: "Indice",
      status: "Publié",
      author: "Fatou Diop",
      date: "2024-03-11",
      views: "2.4K",
      featured: false,
      editPath: "/dashboard/indices/5/edit"
    }
  ];

  const contentStats = [
    {
      title: "Articles Publiés",
      value: "18",
      change: "+3 ce mois",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Podcasts",
      value: "3",
      change: "+1 ce mois",
      icon: Mic,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Vues Totales",
      value: "12.5K",
      change: "+15% ce mois",
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "En Attente",
      value: "3",
      change: "À réviser",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publié': return 'bg-green-100 text-green-800';
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      case 'En révision': return 'bg-yellow-100 text-yellow-800';
      case 'Archivé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Article': return FileText;
      case 'Podcast': return Mic;
      case 'Indice': return BarChart3;
      case 'Image': return Image;
      default: return FileText;
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || item.section.toLowerCase() === selectedSection;
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesSection && matchesStatus && matchesType;
  });

  const handleCreateNew = (type: string) => {
    switch (type) {
      case 'article':
        navigate('/dashboard/articles/new');
        break;
      case 'podcast':
        navigate('/dashboard/podcasts/new');
        break;
      case 'indice':
        navigate('/dashboard/indices/new');
        break;
      default:
        warning('Non implémenté', `Création de ${type} bientôt disponible`);
    }
  };

  const handleEdit = (item: any) => {
    navigate(item.editPath);
  };

  const handleDelete = (item: any) => {
    warning('Suppression', `${item.type} "${item.title}" supprimé`);
  };

  const handleView = (item: any) => {
    success('Aperçu', `Affichage de "${item.title}"`);
  };

  return (
    <DashboardLayout
      title="Gestion de Contenu"
      subtitle="Créez, modifiez et gérez tout votre contenu depuis un seul endroit"
      actions={
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleCreateNew('article')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
          <Button 
            onClick={() => handleCreateNew('podcast')}
            variant="outline"
          >
            <Mic className="h-4 w-4 mr-2" />
            Nouveau Podcast
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sections de contenu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Sections de Contenu
            </CardTitle>
            <CardDescription>Filtrez par catégorie pour voir le contenu spécifique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {contentSections.map((section) => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSection(section.id)}
                  className="flex items-center gap-2 h-10"
                >
                  <section.icon className={`h-4 w-4 ${selectedSection === section.id ? 'text-white' : section.color}`} />
                  {section.name}
                  <Badge variant="secondary" className="ml-1">
                    {section.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par titre, auteur, contenu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="publié">Publié</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="en révision">En révision</option>
                </select>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="article">Article</option>
                  <option value="podcast">Podcast</option>
                  <option value="indice">Indice</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste du contenu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contenu ({filteredContent.length})</span>
              {filteredContent.length > 0 && (
                <Badge variant="outline">
                  {filteredContent.filter(item => item.status === 'Publié').length} publiés
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {item.title}
                          </h3>
                          {item.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {item.section}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views} vues
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredContent.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contenu trouvé</h3>
                  <p className="text-gray-600 mb-4">Essayez de modifier vos filtres ou créez du nouveau contenu.</p>
                  <Button onClick={() => handleCreateNew('article')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer du contenu
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Créez rapidement du nouveau contenu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleCreateNew('article')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Nouvel Article</span>
                  </div>
                  <p className="text-sm text-gray-600">Créer un article avec résumé obligatoire</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleCreateNew('podcast')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Nouveau Podcast</span>
                  </div>
                  <p className="text-sm text-gray-600">Ajouter un podcast avec liens externes</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 hover:bg-green-50 hover:border-green-300"
                onClick={() => handleCreateNew('indice')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Nouvel Indice</span>
                  </div>
                  <p className="text-sm text-gray-600">Créer un indice économique</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
