import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, TrendingUp, BarChart3, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const MarcheContentManager = () => {
  const [selectedTab, setSelectedTab] = useState('market-data');

  const marketData = [
    {
      id: 1,
      symbol: 'BOAS',
      name: 'Bank of Africa Senegal',
      price: '2,450',
      change: '+2.5%',
      volume: '15,230',
      lastUpdate: '2024-03-15 16:30'
    },
    {
      id: 2,
      symbol: 'SONATEL',
      name: 'Sonatel',
      price: '12,800',
      change: '+1.8%',
      volume: '8,456',
      lastUpdate: '2024-03-15 16:30'
    },
    {
      id: 3,
      symbol: 'CFAO',
      name: 'CFAO Motors',
      price: '5,670',
      change: '-0.5%',
      volume: '3,210',
      lastUpdate: '2024-03-15 16:30'
    }
  ];

  const marketNews = [
    {
      id: 1,
      title: 'La BRVM enregistre une hausse de 3.2% ce trimestre',
      excerpt: 'Performance positive des principales valeurs boursières...',
      status: 'Publié',
      date: '2024-03-15',
      author: 'Dr. Amina Kone'
    },
    {
      id: 2,
      title: 'Analyse sectorielle: Télécommunications en Afrique de l\'Ouest',
      excerpt: 'Le secteur des télécoms maintient sa dynamique...',
      status: 'Brouillon',
      date: '2024-03-14',
      author: 'Jean-Baptiste Ouédraogo'
    }
  ];

  const economicIndicators = [
    {
      id: 1,
      name: 'Inflation',
      value: '2.3%',
      change: '-0.2%',
      country: 'Côte d\'Ivoire',
      lastUpdate: '2024-03-01'
    },
    {
      id: 2,
      name: 'PIB Growth',
      value: '6.8%',
      change: '+0.5%',
      country: 'Sénégal',
      lastUpdate: '2024-03-01'
    },
    {
      id: 3,
      name: 'Taux de change',
      value: '655.957',
      change: '+0.1%',
      country: 'Zone CFA',
      lastUpdate: '2024-03-15'
    }
  ];

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Contenu - Marché</h1>
            <p className="text-gray-600 mt-2">Gérez les données de marché, actualités et indicateurs économiques</p>
          </div>
          <Button className="bg-[#373B3A] hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Contenu
          </Button>
        </div>

        {/* Tab Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                onClick={() => setSelectedTab('market-data')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'market-data'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Données de Marché
              </button>
              <button
                onClick={() => setSelectedTab('news')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'news'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Actualités Financières
              </button>
              <button
                onClick={() => setSelectedTab('indicators')}
                className={`px-6 py-4 font-medium text-sm ${
                  selectedTab === 'indicators'
                    ? 'border-b-2 border-[#373B3A] text-[#373B3A]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Indicateurs Économiques
              </button>
            </div>
          </CardContent>
        </Card>

        {selectedTab === 'market-data' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Mettre à jour les prix</span>
                  </div>
                  <p className="text-sm text-gray-600">Actualiser les données boursières</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">Nouvelle action</span>
                  </div>
                  <p className="text-sm text-gray-600">Ajouter une nouvelle valeur</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Import données</span>
                  </div>
                  <p className="text-sm text-gray-600">Importer depuis fichier CSV</p>
                </div>
              </Button>
            </div>

            {/* Market Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Valeurs Boursières</CardTitle>
                <CardDescription>Gérez les données des actions cotées en bourse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((stock) => (
                    <div key={stock.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#373B3A] rounded-lg flex items-center justify-center text-white font-bold">
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                          <p className="text-gray-600">{stock.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-semibold">{stock.price} XOF</p>
                          <p className={getChangeColor(stock.change)}>{stock.change}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Volume</p>
                          <p className="font-medium">{stock.volume}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Dernière mise à jour</p>
                          <p className="text-sm">{stock.lastUpdate}</p>
                        </div>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'news' && (
          <div className="space-y-6">
            {/* News Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Actualités Financières</CardTitle>
                    <CardDescription>Gérez les articles et actualités du marché</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Article
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketNews.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                        <p className="text-gray-600 mb-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Par {article.author}</span>
                          <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={article.status === 'Publié' ? 'default' : 'secondary'}>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'indicators' && (
          <div className="space-y-6">
            {/* Economic Indicators */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Indicateurs Économiques</CardTitle>
                    <CardDescription>Gérez les indicateurs macroéconomiques</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Indicateur
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {economicIndicators.map((indicator) => (
                    <div key={indicator.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{indicator.name}</h3>
                          <p className="text-gray-600">{indicator.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-semibold text-lg">{indicator.value}</p>
                          <p className={getChangeColor(indicator.change)}>{indicator.change}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Dernière mise à jour</p>
                          <p className="text-sm">{indicator.lastUpdate}</p>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Modal Placeholder */}
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Formulaires de Gestion</h3>
            <p className="text-gray-600 mb-4">
              Les formulaires d'ajout et d'édition apparaîtront ici selon vos actions
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">Gérer Formulaires</Button>
              <Button variant="outline">Import/Export</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarcheContentManager;
