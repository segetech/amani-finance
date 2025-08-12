import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Globe, FileText, Users, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const EconomieContentManager = () => {
  const [selectedTab, setSelectedTab] = useState('articles');

  const economicArticles = [
    {
      id: 1,
      title: 'Impact de la digitalisation sur l\'économie africaine',
      country: 'Afrique',
      category: 'Transformation Digitale',
      status: 'Publié',
      author: 'Dr. Amina Kone',
      date: '2024-03-15',
      views: '2.1K',
      featured: true
    },
    {
      id: 2,
      title: 'Politique monétaire de la BCEAO : Nouvelles orientations',
      country: 'Zone UEMOA',
      category: 'Politique Monétaire',
      status: 'En révision',
      author: 'Jean-Baptiste Ouédraogo',
      date: '2024-03-14',
      views: '856',
      featured: false
    },
    {
      id: 3,
      title: 'Le secteur agricole ivoirien face aux défis climatiques',
      country: 'Côte d\'Ivoire',
      category: 'Agriculture',
      status: 'Brouillon',
      author: 'Sarah Diallo',
      date: '2024-03-13',
      views: '0',
      featured: false
    }
  ];

  const countryProfiles = [
    {
      id: 1,
      country: 'Côte d\'Ivoire',
      gdp: '70.99B USD',
      growth: '+6.2%',
      population: '28.16M',
      currency: 'Franc CFA',
      lastUpdate: '2024-03-01'
    },
    {
      id: 2,
      country: 'Sénégal',
      gdp: '27.68B USD',
      growth: '+5.8%',
      population: '17.74M',
      currency: 'Franc CFA',
      lastUpdate: '2024-03-01'
    },
    {
      id: 3,
      country: 'Ghana',
      gdp: '75.49B USD',
      growth: '+3.1%',
      population: '32.83M',
      currency: 'Cedi',
      lastUpdate: '2024-03-01'
    }
  ];

  const economicSectors = [
    {
      id: 1,
      name: 'Agriculture',
      contribution: '23%',
      growth: '+4.2%',
      articles: 15,
      trending: true
    },
    {
      id: 2,
      name: 'Services',
      contribution: '52%',
      growth: '+7.1%',
      articles: 28,
      trending: true
    },
    {
      id: 3,
      name: 'Industrie',
      contribution: '25%',
      growth: '+3.8%',
      articles: 12,
      trending: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publié': return 'text-green-600 bg-green-100';
      case 'En révision': return 'text-yellow-600 bg-yellow-100';
      case 'Brouillon': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Contenu - Économie</h1>
            <p className="text-gray-600 mt-2">Gérez les articles économiques, profils pays et analyses sectorielles</p>
          </div>
          <Button className="bg-[#373B3A] hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contenu
          </Button>
        </div>

        {/* Tab Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                onClick={() => setSelectedTab('articles')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'articles'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Articles Économiques
              </button>
              <button
                onClick={() => setSelectedTab('countries')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'countries'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profils Pays
              </button>
              <button
                onClick={() => setSelectedTab('sectors')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'sectors'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Secteurs Économiques
              </button>
            </div>
          </CardContent>
        </Card>

        {selectedTab === 'articles' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold">{economicArticles.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En Vedette</p>
                      <p className="text-2xl font-bold">
                        {economicArticles.filter(a => a.featured).length}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Publiés</p>
                      <p className="text-2xl font-bold">
                        {economicArticles.filter(a => a.status === 'Publié').length}
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En Attente</p>
                      <p className="text-2xl font-bold">
                        {economicArticles.filter(a => a.status !== 'Publié').length}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Articles List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Articles Économiques</CardTitle>
                    <CardDescription>Gérez tous les articles économiques par pays et secteur</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Rechercher..." className="w-64" />
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel Article
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {economicArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{article.title}</h3>
                            {article.featured && (
                              <Badge variant="secondary">En vedette</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {article.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {article.author}
                            </span>
                            <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} vues
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'countries' && (
          <div className="space-y-6">
            {/* Country Profiles */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profils Économiques par Pays</CardTitle>
                    <CardDescription>Gérez les données économiques des pays africains</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Pays
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {countryProfiles.map((country) => (
                    <Card key={country.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Globe className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{country.country}</CardTitle>
                              <p className="text-sm text-gray-600">Dernière mise à jour: {country.lastUpdate}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">PIB</p>
                            <p className="font-semibold">{country.gdp}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Croissance</p>
                            <p className="font-semibold text-green-600">{country.growth}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Population</p>
                            <p className="font-semibold">{country.population}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monnaie</p>
                            <p className="font-semibold">{country.currency}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'sectors' && (
          <div className="space-y-6">
            {/* Economic Sectors */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Secteurs Économiques</CardTitle>
                    <CardDescription>Gérez les analyses sectorielles et leur contribution au PIB</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Secteur
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {economicSectors.map((sector) => (
                    <div key={sector.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                              {sector.trending && (
                                <Badge variant="secondary">Tendance</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{sector.articles} articles publiés</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Contribution PIB</p>
                            <p className="font-semibold text-lg">{sector.contribution}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Croissance</p>
                            <p className="font-semibold text-green-600">{sector.growth}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EconomieContentManager;
