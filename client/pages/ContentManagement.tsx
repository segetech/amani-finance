import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, FileText, Image, Video, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const ContentManagement = () => {
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const contentSections = [
    { id: 'all', name: 'Tout le contenu', icon: FileText, color: 'text-gray-600' },
    { id: 'marche', name: 'Marché', icon: BarChart3, color: 'text-blue-600' },
    { id: 'economie', name: 'Économie', icon: FileText, color: 'text-green-600' },
    { id: 'industrie', name: 'Industrie', icon: FileText, color: 'text-purple-600' },
    { id: 'investissement', name: 'Investissement', icon: FileText, color: 'text-orange-600' },
    { id: 'insights', name: 'Insights', icon: FileText, color: 'text-red-600' },
    { id: 'tech', name: 'Tech', icon: FileText, color: 'text-indigo-600' },
    { id: 'podcast', name: 'Podcast', icon: Video, color: 'text-pink-600' }
  ];

  const contentItems = [
    {
      id: 1,
      title: "Analyse du marché boursier africain Q1 2024",
      section: "Marché",
      type: "Article",
      status: "Publié",
      author: "Dr. Amina Kone",
      date: "2024-03-15",
      views: "5.2K",
      featured: true
    },
    {
      id: 2,
      title: "L'impact de l'IA sur l'économie africaine",
      section: "Tech",
      type: "Article",
      status: "Brouillon",
      author: "Prof. Jean-Baptiste",
      date: "2024-03-14",
      views: "0",
      featured: false
    },
    {
      id: 3,
      title: "Podcast: L'avenir de la fintech en Afrique",
      section: "Podcast",
      type: "Audio",
      status: "Publié",
      author: "Sarah Diallo",
      date: "2024-03-13",
      views: "3.1K",
      featured: true
    },
    {
      id: 4,
      title: "Opportunités d'investissement dans l'agriculture",
      section: "Investissement",
      type: "Article",
      status: "En révision",
      author: "Mohamed El Fassi",
      date: "2024-03-12",
      views: "1.8K",
      featured: false
    },
    {
      id: 5,
      title: "Transformation digitale de l'industrie minière",
      section: "Industrie",
      type: "Rapport",
      status: "Publié",
      author: "Fatou Diop",
      date: "2024-03-11",
      views: "2.4K",
      featured: false
    }
  ];

  const contentStats = [
    {
      title: "Articles Publiés",
      value: "247",
      change: "+23 ce mois",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Podcasts",
      value: "89",
      change: "+8 ce mois",
      icon: Video,
      color: "text-purple-600"
    },
    {
      title: "Vues Totales",
      value: "125K",
      change: "+15% ce mois",
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Contenus en Attente",
      value: "12",
      change: "À réviser",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publié': return 'text-green-600 bg-green-100';
      case 'Brouillon': return 'text-gray-600 bg-gray-100';
      case 'En révision': return 'text-yellow-600 bg-yellow-100';
      case 'Archivé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Article': return FileText;
      case 'Audio': return Video;
      case 'Rapport': return BarChart3;
      case 'Image': return Image;
      default: return FileText;
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || item.section.toLowerCase() === selectedSection;
    return matchesSearch && matchesSection;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Contenu</h1>
            <p className="text-gray-600 mt-2">Gérez tout le contenu de votre plateforme</p>
          </div>
          <Button className="bg-[#373B3A] hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contenu
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Sections de Contenu</CardTitle>
            <CardDescription>Sélectionnez une section pour filtrer le contenu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contentSections.map((section) => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSection(section.id)}
                  className="flex items-center gap-2"
                >
                  <section.icon className={`h-4 w-4 ${section.color}`} />
                  {section.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher du contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#373B3A] focus:border-transparent">
                  <option value="">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="review">En révision</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#373B3A] focus:border-transparent">
                  <option value="">Tous les types</option>
                  <option value="article">Article</option>
                  <option value="podcast">Podcast</option>
                  <option value="report">Rapport</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu ({filteredContent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      <TypeIcon className="h-6 w-6 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.featured && (
                            <Badge variant="secondary" className="text-xs">
                              En vedette
                            </Badge>
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Nouvel Article</span>
                  </div>
                  <p className="text-sm text-gray-600">Créer un nouvel article</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-5 w-5" />
                    <span className="font-medium">Nouveau Podcast</span>
                  </div>
                  <p className="text-sm text-gray-600">Ajouter un épisode podcast</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">Nouveau Rapport</span>
                  </div>
                  <p className="text-sm text-gray-600">Publier un rapport d'analyse</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-5 w-5" />
                    <span className="font-medium">Gestion Médias</span>
                  </div>
                  <p className="text-sm text-gray-600">Gérer images et vidéos</p>
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
