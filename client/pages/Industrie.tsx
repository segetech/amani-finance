import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useIndustrialData } from '../hooks/useIndustrialData';
import { Factory, Zap, Users, DollarSign, Calendar, Eye, ArrowRight, BookOpen, TrendingUp, Building } from 'lucide-react';

const Industrie = () => {
  // Hook pour récupérer les données industrielles
  const { metrics, companies, loading: industrialLoading } = useIndustrialData({ is_active: true });
  
  // Hook pour récupérer les articles
  const { articles, loading: articlesLoading } = useArticles({ 
    status: 'published',
    limit: 50
  });

  // Filtrer les articles liés à l'industrie
  const industrialArticles = articles?.filter(article => {
    const title = article.title.toLowerCase();
    const content = article.content?.toLowerCase() || '';
    const summary = article.summary?.toLowerCase() || '';
    
    const industrialKeywords = [
      'industrie', 'industrial', 'manufacture', 'manufacturing', 'production',
      'usine', 'factory', 'automation', 'robotique', 'robotics',
      'énergie', 'energy', 'automobile', 'automotive', 'aérospatiale', 'aerospace',
      'pharmaceutique', 'pharma', 'chimie', 'chemical', 'métallurgie', 'metallurgy',
      'textile', 'agroalimentaire', 'food processing', 'innovation industrielle',
      'industrie 4.0', 'smart factory', 'iot industriel', 'supply chain'
    ];
    
    return industrialKeywords.some(keyword => 
      title.includes(keyword) || 
      content.includes(keyword) || 
      summary.includes(keyword)
    );
  }) || [];

  // Articles de fallback
  const fallbackIndustrialArticles = [
    {
      id: "ind-1",
      title: "Industrie 4.0 : La révolution numérique des usines ouest-africaines",
      summary: "Les entreprises industrielles adoptent massivement l'IoT et l'automatisation pour optimiser leur production.",
      featured_image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400",
      country: "Côte d'Ivoire",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      views: 1850,
      read_time: 5,
      author: { id: "1", first_name: "Koffi", last_name: "Asante", email: "koffi@amani.com" }
    },
    {
      id: "ind-2",
      title: "Secteur automobile : Les investissements atteignent 8 milliards USD",
      summary: "L'industrie automobile ouest-africaine connaît un boom sans précédent avec l'arrivée de nouveaux constructeurs.",
      featured_image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
      country: "Ghana",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      views: 2340,
      read_time: 6,
      author: { id: "2", first_name: "Ama", last_name: "Osei", email: "ama@amani.com" }
    },
    {
      id: "ind-3",
      title: "Énergie renouvelable : L'industrie solaire en pleine expansion",
      summary: "Les capacités de production d'énergie solaire industrielle ont triplé en 2024 dans la région.",
      featured_image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
      country: "Sénégal",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      created_at: new Date(Date.now() - 172800000).toISOString(),
      views: 1920,
      read_time: 4,
      author: { id: "3", first_name: "Moussa", last_name: "Diop", email: "moussa@amani.com" }
    }
  ];

  const displayIndustrialArticles = industrialArticles.length >= 3 ? industrialArticles : [...industrialArticles, ...fallbackIndustrialArticles].slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#373B3A] to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              🏭 Industrie & Innovation
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Découvrez les dernières tendances industrielles, les innovations technologiques 
              et les opportunités de croissance qui façonnent l'avenir économique de l'Afrique
            </p>
          </div>
        </div>
      </section>

      {/* Industrial Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Indicateurs Industriels
          </h2>
          
          {industrialLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#373B3A]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric) => {
                const IconComponent = metric.icon_name === 'Factory' ? Factory :
                                   metric.icon_name === 'Users' ? Users :
                                   metric.icon_name === 'DollarSign' ? DollarSign :
                                   metric.icon_name === 'Zap' ? Zap :
                                   Factory;
                
                return (
                  <div key={metric.id} className="text-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex justify-center mb-4">
                      <IconComponent className={`h-12 w-12 ${metric.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{metric.metric_value}{metric.metric_unit}</h3>
                    <p className="text-lg font-semibold text-gray-700 mb-1">{metric.metric_name}</p>
                    <p className="text-sm text-gray-500">{metric.description}</p>
                    {metric.change_value && (
                      <p className="text-sm text-green-600 mt-2">{metric.change_value} {metric.change_description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Entreprises en Vedette
          </h2>
          
          {industrialLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#373B3A]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companies.filter(company => company.is_featured).map((company) => (
                <div key={company.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                  <p className="text-gray-600 mb-3">{company.sector_name}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Croissance</p>
                      <p className="font-semibold text-green-600">+{company.growth_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employés</p>
                      <p className="font-semibold">{company.employee_count?.toLocaleString()}</p>
                    </div>
                  </div>
                  {company.country && (
                    <p className="text-xs text-gray-400 mt-2">{company.country}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles Industriels Récents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#373B3A] flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Articles Industriels Récents
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
              {displayIndustrialArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                  <Link to={`/article/${article.id}`} className="block">
                    <div className="relative">
                      <img
                        src={article.featured_image || '/api/placeholder/400/200'}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-[#373B3A] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          🏭 Industrie
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

export default Industrie;
