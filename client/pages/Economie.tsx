import { useState } from "react";
import { Link } from "react-router-dom";
import ArticleReader from "../components/ArticleReader";
import { useEconomicData } from "../hooks/useEconomicData";
import { useArticles } from "../hooks/useArticles";
import { usePageSectionControls } from "../hooks/usePageSectionControls";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Globe,
  ArrowRight,
  Calendar,
  Eye,
  Filter,
  Search,
  BookOpen,
  Users,
  Building,
  Target,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

export default function Economie() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Hooks pour les données dynamiques
  const { countries: economicCountries, regionalMetrics, loading: economicLoading } = useEconomicData();
  const { articles, loading: articlesLoading } = useArticles({ 
    status: 'published',
    limit: 50 // Plus d'articles pour avoir plus de choix après filtrage
  });

  // Hook pour les contrôles d'affichage
  const { isSectionVisible } = usePageSectionControls({ page_name: 'economie' });

  // Filtrer les articles liés à l'économie (comme dans Marche.tsx)
  const economicArticles = articles?.filter(article => {
    const title = article.title.toLowerCase();
    const content = article.content?.toLowerCase() || '';
    const summary = article.summary?.toLowerCase() || '';
    
    // Mots-clés économiques (comme les mots-clés marché dans Marche.tsx)
    const economicKeywords = [
      'économie', 'economic', 'pib', 'gdp', 'croissance', 'growth',
      'inflation', 'deflation', 'monétaire', 'monetary', 'fiscal',
      'budget', 'dette', 'debt', 'investissement', 'investment',
      'développement', 'development', 'secteur', 'sector',
      'agriculture', 'industrie', 'industry', 'commerce', 'trade',
      'export', 'import', 'balance', 'uemoa', 'cedeao', 'ecowas',
      'banque centrale', 'central bank', 'politique économique',
      'réforme', 'reform', 'privatisation', 'emploi', 'unemployment',
      'chômage', 'productivité', 'productivity', 'compétitivité'
    ];
    
    return economicKeywords.some(keyword => 
      title.includes(keyword) || 
      content.includes(keyword) || 
      summary.includes(keyword)
    );
  }) || [];

  // Articles de fallback si pas assez d'articles économiques trouvés
  const fallbackEconomicArticles = [
    {
      id: "eco-1",
      title: "Croissance économique : L'UEMOA affiche des performances solides",
      summary: "La zone UEMOA enregistre une croissance de 5.2% en 2024, tirée par les secteurs agricole et minier.",
      content: "Analyse détaillée de la croissance économique dans la zone UEMOA...",
      featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
      featured_image_alt: "Graphique de croissance économique UEMOA",
      country: "UEMOA",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      views: 1250,
      read_time: 4,
      slug: "croissance-uemoa-2024",
      author: {
        id: "1",
        first_name: "Amadou",
        last_name: "Diallo",
        email: "amadou@amani.com"
      }
    },
    {
      id: "eco-2", 
      title: "Inflation en Afrique de l'Ouest : Analyse des tendances récentes",
      summary: "L'inflation reste maîtrisée dans la zone UEMOA avec un taux moyen de 2.1% sur l'année.",
      content: "Étude approfondie des facteurs d'inflation en Afrique de l'Ouest...",
      featured_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
      featured_image_alt: "Analyse de l'inflation en Afrique de l'Ouest",
      country: "Sahel",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      views: 890,
      read_time: 3,
      slug: "inflation-afrique-ouest-2024",
      author: {
        id: "2",
        first_name: "Fatou",
        last_name: "Sow",
        email: "fatou@amani.com"
      }
    },
    {
      id: "eco-3",
      title: "Secteur minier : Les investissements atteignent des records",
      summary: "Le secteur minier ouest-africain attire 12 milliards USD d'investissements en 2024.",
      content: "Panorama des investissements dans le secteur minier...",
      featured_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      featured_image_alt: "Secteur minier en Afrique de l'Ouest",
      country: "Mali",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      created_at: new Date(Date.now() - 172800000).toISOString(),
      views: 2100,
      read_time: 6,
      slug: "secteur-minier-investissements-2024",
      author: {
        id: "3",
        first_name: "Ibrahim",
        last_name: "Traoré",
        email: "ibrahim@amani.com"
      }
    }
  ];

  // Utiliser les vrais articles s'il y en a assez, sinon compléter avec les fallbacks
  const displayEconomicArticles = economicArticles.length >= 3 ? economicArticles : [...economicArticles, ...fallbackEconomicArticles].slice(0, 6);

  const categories = ["all", "Macroéconomie", "Secteur minier", "Agriculture", "Commerce", "Finance"];
  const countryOptions = ["all", ...economicCountries.map(c => c.name), "UEMOA", "Sahel"];

  const filteredArticles = displayEconomicArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all"; // Simplifié pour l'instant
    const matchesCountry = selectedCountry === "all"; // Pour l'instant, on ne filtre pas par pays pour les articles
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const featuredArticle = displayEconomicArticles[0];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amani-primary to-amani-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              📊 Économie Sahélienne
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Analyses, perspectives et données économiques de la région
            </p>
            {isSectionVisible('hero_metrics') && (
              <div className="flex items-center justify-center gap-8 text-lg">
                {regionalMetrics.map((metric) => {
                  // Mapping des icônes
                  const IconComponent = metric.icon_name === 'TrendingUp' ? TrendingUp :
                                      metric.icon_name === 'DollarSign' ? DollarSign :
                                      metric.icon_name === 'Users' ? Users :
                                      metric.icon_name === 'Activity' ? Activity :
                                      metric.icon_name === 'Building' ? Building :
                                      BarChart3; // Icône par défaut

                  return (
                    <div key={metric.id} className="flex items-center gap-2">
                      <IconComponent className="w-6 h-6" />
                      <span>{metric.metric_name}: {metric.metric_value}{metric.metric_unit}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Economic Dashboard */}
      {isSectionVisible('economic_dashboard') && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Tableau de bord économique
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {economicCountries.filter(country => country.is_active).map((country) => (
              <div key={country.id} className="bg-white rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-amani-primary flex items-center gap-2">
                    <span className="text-2xl">{country.flag_emoji}</span>
                    {country.name}
                  </h3>
                  <div className="text-sm text-gray-500">{country.population}</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance PIB</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{country.gdp_growth_rate}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inflation</span>
                    <span className="font-semibold text-blue-600">{country.inflation_rate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PIB/habitant</span>
                    <span className="font-semibold text-amani-primary">{country.gdp_per_capita} USD</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Secteurs clés:</div>
                    <div className="flex flex-wrap gap-1">
                      {country.main_sectors.map((sector, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amani-secondary/20 text-amani-primary rounded-full text-xs">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
      {/* Articles Économiques Récents */}
      {isSectionVisible('recent_articles') && (
        <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Articles Économiques Récents
            </h2>
            <Link
              to="/actualites"
              className="flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 font-medium"
            >
              Voir tous les articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amani-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayEconomicArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                  <Link to={`/article/${article.id}`} className="block">
                    <div className="relative">
                      <img
                        src={article.featured_image || '/api/placeholder/400/200'}
                        alt={article.featured_image_alt || article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          📊 Économie
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
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amani-primary transition-colors text-lg leading-tight hover:text-amani-primary">
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
      )}
    </div>
  );
}
