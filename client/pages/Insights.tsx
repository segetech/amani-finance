import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Eye, Calendar, User, Clock, BarChart3, Brain, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Insights = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const insightCategories = [
    { id: 'all', name: 'Toutes les analyses' },
    { id: 'economic', name: 'Analyse Économique' },
    { id: 'market', name: 'Tendances Marché' },
    { id: 'technology', name: 'Innovation Tech' },
    { id: 'policy', name: 'Politiques Publiques' },
    { id: 'social', name: 'Impact Social' }
  ];

  const featuredInsights = [
    {
      id: 1,
      title: "L'Avenir de l'Économie Numérique en Afrique : Analyse Prospective 2024-2030",
      category: "Analyse Économique",
      author: "Dr. Amina Kone",
      readTime: "12 min",
      views: "5.2K",
      date: "2024-03-15",
      image: "/api/placeholder/600/300",
      summary: "Une analyse approfondie des tendances qui façonneront l'économie numérique africaine au cours des six prochaines années, avec des prévisions basées sur les données actuelles.",
      tags: ["Économie Numérique", "Prévisions", "Technologie", "Croissance"],
      featured: true,
      complexity: "Expert"
    },
    {
      id: 2,
      title: "Impact de l'Intelligence Artificielle sur l'Emploi en Afrique Subsaharienne",
      category: "Innovation Tech",
      author: "Prof. Jean-Baptiste Ouédraogo",
      readTime: "8 min",
      views: "3.8K",
      date: "2024-03-14",
      image: "/api/placeholder/600/300",
      summary: "Étude sur les transformations du marché de l'emploi avec l'arrivée de l'IA et les stratégies d'adaptation nécessaires pour les travailleurs africains.",
      tags: ["Intelligence Artificielle", "Emploi", "Formation", "Adaptation"],
      featured: false,
      complexity: "Intermédiaire"
    },
    {
      id: 3,
      title: "Les Cryptomonnaies et leur Adoption en Afrique : Opportunités et Défis",
      category: "Tendances Marché",
      author: "Sarah Diallo",
      readTime: "10 min",
      views: "4.1K",
      date: "2024-03-13",
      image: "/api/placeholder/600/300",
      summary: "Analyse du phénomène croissant d'adoption des cryptomonnaies sur le continent africain, ses avantages pour l'inclusion financière et les risques associés.",
      tags: ["Cryptomonnaies", "Finance", "Innovation", "Inclusion"],
      featured: true,
      complexity: "Intermédiaire"
    }
  ];

  const quickInsights = [
    {
      title: "Croissance du E-commerce",
      value: "+67%",
      description: "Augmentation des ventes en ligne",
      trend: "up"
    },
    {
      title: "Adoption Mobile Banking",
      value: "78%",
      description: "Population utilisant les services mobiles",
      trend: "up"
    },
    {
      title: "Investissements Tech",
      value: "$2.4B",
      description: "Capital investi dans la tech africaine",
      trend: "up"
    },
    {
      title: "Création d'Entreprises",
      value: "+45%",
      description: "Nouvelles startups créées",
      trend: "up"
    }
  ];

  const analyticalReports = [
    {
      id: 1,
      title: "Rapport Trimestriel : État de l'Économie Africaine Q1 2024",
      type: "Rapport Économique",
      pages: 45,
      downloadCount: "1.2K",
      date: "2024-03-01",
      description: "Analyse complète des performances économiques du continent au premier trimestre 2024.",
      preview: "Ce rapport examine les principales tendances économiques observées au premier trimestre 2024..."
    },
    {
      id: 2,
      title: "Étude Sectorielle : Transformation Digitale des PME Africaines",
      type: "Étude Sectorielle",
      pages: 62,
      downloadCount: "856",
      date: "2024-02-28",
      description: "Recherche approfondie sur l'adoption du numérique par les petites et moyennes entreprises.",
      preview: "La transformation digitale représente un enjeu majeur pour les PME africaines..."
    },
    {
      id: 3,
      title: "Livre Blanc : Fintech et Inclusion Financière en Afrique",
      type: "Livre Blanc",
      pages: 38,
      downloadCount: "2.1K",
      date: "2024-02-25",
      description: "Guide complet sur le rôle des fintechs dans l'amélioration de l'inclusion financière.",
      preview: "Les technologies financières révolutionnent l'accès aux services bancaires..."
    }
  ];

  const expertAuthors = [
    {
      name: "Dr. Amina Kone",
      title: "Économiste Senior",
      speciality: "Économie Numérique",
      articles: 24,
      followers: "12.5K"
    },
    {
      name: "Prof. Jean-Baptiste Ouédraogo",
      title: "Professeur en Innovation",
      speciality: "Intelligence Artificielle",
      articles: 18,
      followers: "8.9K"
    },
    {
      name: "Sarah Diallo",
      title: "Analyste Financière",
      speciality: "Marchés Financiers",
      articles: 31,
      followers: "15.2K"
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Débutant': return 'text-green-600 bg-green-100';
      case 'Intermédiaire': return 'text-yellow-600 bg-yellow-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredInsights = featuredInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || insight.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#373B3A] to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Brain className="h-16 w-16 text-[#E5DDD5]" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Insights & Analyses
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Accédez aux analyses approfondies, études prospectives et insights stratégiques 
              pour comprendre les enjeux économiques et sociaux de l'Afrique moderne
            </p>
          </div>
        </div>
      </section>

      {/* Quick Insights Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Aperçus Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickInsights.map((insight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <BarChart3 className="h-12 w-12 text-[#373B3A]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{insight.value}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">{insight.title}</p>
                  <p className="text-sm text-gray-500">{insight.description}</p>
                  <div className="mt-3 flex justify-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Authors */}
      <section className="py-16 bg-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Nos Experts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertAuthors.map((author, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-[#373B3A] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h3>
                  <p className="text-gray-600 mb-2">{author.title}</p>
                  <Badge variant="secondary" className="mb-3">{author.speciality}</Badge>
                  <div className="flex justify-center gap-6 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold">{author.articles}</p>
                      <p>Articles</p>
                    </div>
                    <div>
                      <p className="font-semibold">{author.followers}</p>
                      <p>Followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Analyses Approfondies
          </h2>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des analyses et insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#373B3A] focus:border-transparent"
            >
              {insightCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className={`hover:shadow-lg transition-shadow ${insight.featured ? 'ring-2 ring-[#373B3A]' : ''}`}>
                <div className="relative">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {insight.featured && (
                    <Badge className="absolute top-3 left-3 bg-[#373B3A] text-white">
                      En Vedette
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary">{insight.category}</Badge>
                    <Badge className={getComplexityColor(insight.complexity)}>
                      {insight.complexity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{insight.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {insight.summary}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {insight.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {insight.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {insight.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {insight.views}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(insight.date).toLocaleDateString('fr-FR')}
                    </span>
                    <Button size="sm">
                      Lire l'Analyse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analytical Reports */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Rapports et Études
          </h2>
          <div className="space-y-6">
            {analyticalReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Lightbulb className="h-6 w-6 text-[#373B3A]" />
                        <Badge variant="secondary">{report.type}</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      <p className="text-sm text-gray-500 italic mb-4">"{report.preview}"</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>{report.pages} pages</span>
                        <span>{report.downloadCount} téléchargements</span>
                        <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Button>
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
