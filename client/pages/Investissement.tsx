import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useInvestmentData } from '../hooks/useInvestmentData';
import { Search, Filter, TrendingUp, DollarSign, BarChart3, Shield, Globe, Users, ArrowUpRight, Calendar, Eye, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Investissement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Hook pour récupérer les articles
  const { articles, loading: articlesLoading } = useArticles({ 
    status: 'published',
    limit: 50
  });

  // Hook pour récupérer les données d'investissement
  const { 
    opportunities, 
    metrics, 
    trends, 
    categories,
    loading: investmentLoading 
  } = useInvestmentData({ is_active: true });

  // Filtrer les articles liés à l'investissement
  const investmentArticles = articles?.filter(article => {
    const title = article.title.toLowerCase();
    const content = article.content?.toLowerCase() || '';
    const summary = article.summary?.toLowerCase() || '';
    
    // Mots-clés investissement
    const investmentKeywords = [
      'investissement', 'investment', 'capital', 'financement', 'funding',
      'venture capital', 'private equity', 'startup', 'levée de fonds',
      'bourse', 'stock market', 'actions', 'obligations', 'bonds',
      'portefeuille', 'portfolio', 'rendement', 'return', 'roi',
      'dividende', 'dividend', 'crypto', 'blockchain', 'bitcoin',
      'immobilier', 'real estate', 'fonds', 'fund', 'etf',
      'angel investor', 'business angel', 'crowdfunding', 'ico',
      'ipo', 'introduction en bourse', 'valorisation', 'valuation',
      'due diligence', 'risk management', 'gestion des risques'
    ];
    
    return investmentKeywords.some(keyword => 
      title.includes(keyword) || 
      content.includes(keyword) || 
      summary.includes(keyword)
    );
  }) || [];

  // Articles de fallback pour l'investissement
  const fallbackInvestmentArticles = [
    {
      id: "inv-1",
      title: "Fintech africaine : 2.5 milliards USD levés en 2024",
      summary: "Les startups fintech ouest-africaines battent des records de levées de fonds avec des investisseurs internationaux.",
      content: "Analyse des investissements dans la fintech africaine...",
      featured_image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
      featured_image_alt: "Investissement fintech Afrique",
      country: "Nigeria",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      views: 3200,
      read_time: 7,
      slug: "fintech-africaine-levees-fonds-2024",
      author: {
        id: "1",
        first_name: "Adaora",
        last_name: "Okafor",
        email: "adaora@amani.com"
      }
    },
    {
      id: "inv-2",
      title: "Énergie solaire : Les investissements privés explosent",
      summary: "Le secteur de l'énergie renouvelable attire massivement les capitaux privés avec des rendements attractifs.",
      content: "Panorama des investissements dans l'énergie solaire...",
      featured_image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
      featured_image_alt: "Investissement énergie solaire",
      country: "Maroc",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      views: 2800,
      read_time: 5,
      slug: "energie-solaire-investissements-prives",
      author: {
        id: "2",
        first_name: "Youssef",
        last_name: "Benali",
        email: "youssef@amani.com"
      }
    },
    {
      id: "inv-3",
      title: "Immobilier commercial : Opportunités d'investissement en hausse",
      summary: "Le marché immobilier commercial ouest-africain offre des perspectives de rendement intéressantes pour les investisseurs.",
      content: "Guide d'investissement immobilier commercial...",
      featured_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      featured_image_alt: "Immobilier commercial investissement",
      country: "Côte d'Ivoire",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      created_at: new Date(Date.now() - 172800000).toISOString(),
      views: 2150,
      read_time: 6,
      slug: "immobilier-commercial-investissement-afrique",
      author: {
        id: "3",
        first_name: "Aminata",
        last_name: "Koné",
        email: "aminata@amani.com"
      }
    }
  ];

  // Utiliser les vrais articles s'il y en a assez, sinon compléter avec les fallbacks
  const displayInvestmentArticles = investmentArticles.length >= 3 ? investmentArticles : [...investmentArticles, ...fallbackInvestmentArticles].slice(0, 6);

  // Convertir les métriques de la base de données en format d'affichage
  const investmentStats = metrics.map(metric => {
    // Mapper les icônes
    const iconMap: { [key: string]: any } = {
      'DollarSign': DollarSign,
      'BarChart3': BarChart3,
      'Globe': Globe,
      'Users': Users,
      'TrendingUp': TrendingUp
    };

    return {
      title: metric.metric_name,
      value: `${metric.metric_value}${metric.metric_unit || ''}`,
      change: metric.change_value || '',
      description: metric.change_description || metric.description || '',
      icon: iconMap[metric.icon_name] || DollarSign,
      color: metric.color || "text-green-600"
    };
  });

  // Convertir les catégories de la base de données
  const investmentCategories = [
    { id: 'all', name: 'Tous les secteurs' },
    ...categories.map(category => ({
      id: category.name.toLowerCase().replace(/\s+/g, '-'),
      name: category.name
    }))
  ];

  // Convertir les opportunités de la base de données en format d'affichage
  const investmentOpportunities = opportunities.map(opportunity => ({
    id: opportunity.id,
    title: opportunity.title,
    category: opportunity.category_name,
    riskLevel: opportunity.risk_level,
    expectedReturn: `${opportunity.expected_return_min}-${opportunity.expected_return_max}%`,
    minInvestment: `${opportunity.min_investment_unit}${opportunity.min_investment_amount.toLocaleString()}`,
    timeHorizon: `${opportunity.time_horizon_min}-${opportunity.time_horizon_max} ans`,
    description: opportunity.description,
    highlights: opportunity.highlights,
    status: opportunity.status,
    funded: opportunity.funded_percentage,
    image: opportunity.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
  }));

  // Convertir les tendances de la base de données
  const marketTrends = trends.map(trend => ({
    title: trend.title,
    growth: trend.growth_percentage,
    description: trend.description
  }));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Faible': return 'text-green-600 bg-green-100';
      case 'Modéré': return 'text-yellow-600 bg-yellow-100';
      case 'Élevé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert': return 'text-green-600 bg-green-100';
      case 'Bientôt': return 'text-blue-600 bg-blue-100';
      case 'Fermé': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOpportunities = investmentOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           opportunity.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                           opportunity.category.toLowerCase().includes(selectedCategory.replace('-', ' '));
    return matchesSearch && matchesCategory;
  });

  // Afficher un loader si les données sont en cours de chargement
  if (investmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#373B3A] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des opportunités d'investissement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#373B3A] to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Opportunités d'Investissement
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Découvrez les meilleures opportunités d'investissement en Afrique, 
              des projets innovants aux rendements attractifs et à l'impact positif
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-[#E5DDD5] text-[#373B3A] hover:bg-[#E5DDD2]">
                Commencer à Investir
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Performance du Marché
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentStats.length > 0 ? investmentStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">{stat.title}</p>
                  <p className="text-sm text-gray-500 mb-2">{stat.description}</p>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucune métrique disponible</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Market Trends */}
      <section className="py-16 bg-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Tendances du Marché
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketTrends.length > 0 ? marketTrends.map((trend, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-green-600">{trend.growth}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{trend.title}</h3>
                  <p className="text-sm text-gray-600">{trend.description}</p>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucune tendance disponible</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Opportunités d'Investissement
          </h2>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des opportunités d'investissement..."
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
              {investmentCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOpportunities.length > 0 ? filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary">{opportunity.category}</Badge>
                    <Badge className={getStatusColor(opportunity.status)}>
                      {opportunity.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Rendement Attendu</p>
                      <p className="font-semibold text-green-600">{opportunity.expectedReturn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Niveau de Risque</p>
                      <Badge className={getRiskColor(opportunity.riskLevel)}>
                        {opportunity.riskLevel}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Investissement Min.</p>
                      <p className="font-semibold">{opportunity.minInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Horizon</p>
                      <p className="font-semibold">{opportunity.timeHorizon}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Financement</span>
                      <span>{opportunity.funded}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#373B3A] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${opportunity.funded}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Points Clés:</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    disabled={opportunity.status === 'Fermé'}
                  >
                    {opportunity.status === 'Fermé' ? 'Complet' : 
                     opportunity.status === 'Bientôt' ? 'Être Notifié' : 'Investir Maintenant'}
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune opportunité disponible
                  </h3>
                  <p className="text-gray-600">
                    {selectedCategory === 'all' 
                      ? "Aucune opportunité d'investissement n'est actuellement disponible."
                      : `Aucune opportunité dans la catégorie "${investmentCategories.find(c => c.id === selectedCategory)?.name}".`
                    }
                  </p>
                  {selectedCategory !== 'all' && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Voir toutes les opportunités
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Avertissement sur les Risques
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Les investissements présentent des risques de perte en capital. Les performances passées 
            ne préjugent pas des performances futures. Il est recommandé de diversifier ses investissements 
            et de consulter un conseiller financier avant toute décision d'investissement.
          </p>
        </div>
      </section>

      {/* Articles d'Investissement Récents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#373B3A] flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Articles d'Investissement Récents
            </h2>
            <Link
              to="/actualites"
              className="flex items-center gap-2 text-[#373B3A] hover:text-[#373B3A]/80 font-medium"
            >
              Voir tous les articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#373B3A]"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInvestmentArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                  <Link to={`/article/${article.id}`} className="block">
                    <div className="relative">
                      <img
                        src={article.featured_image || '/api/placeholder/400/200'}
                        alt={article.featured_image_alt || article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-[#373B3A] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          💰 Investissement
                        </span>
                        <span className="bg-black/20 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                          {article.country}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-700">
                        {article.read_time || 5} min
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Link to={`/article/${article.id}`}>
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#373B3A] transition-colors text-lg leading-tight hover:text-[#373B3A]">
                        {article.title}
                      </h3>
                    </Link>
                    
                    {article.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {article.summary.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Investissement;
