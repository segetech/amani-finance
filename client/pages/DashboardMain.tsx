import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useStockIndices } from "../hooks/useStockIndices";
import { useCurrencies } from "../hooks/useCurrencies";
import { useArticles } from "../hooks/useArticles";
import {
  FileText,
  Mic,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Zap,
  DollarSign,
  LineChart,
  ArrowRight,
} from "lucide-react";

export default function DashboardMain() {
  const { user, hasPermission } = useAuth();
  
  // Hooks pour les données en temps réel
  const { indices } = useStockIndices();
  const { currencies, getMajorCurrencies, getCurrencyStats } = useCurrencies();
  const { articles } = useArticles({ status: 'published', limit: 5 });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Statistiques en temps réel
  const stats = useMemo(() => {
    const majorCurrencies = getMajorCurrencies();
    const currencyStats = getCurrencyStats();
    
    return {
      indices: {
        total: indices.length,
        gainers: indices.filter(i => (i.change_percent || 0) > 0).length,
        losers: indices.filter(i => (i.change_percent || 0) < 0).length,
      },
      currencies: {
        total: currencies.length,
        major: majorCurrencies.length,
        gainers: currencyStats.gainers,
        losers: currencyStats.losers,
      },
      articles: {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
      }
    };
  }, [indices, currencies, articles, getMajorCurrencies, getCurrencyStats]);

  // Actions rapides disponibles selon les permissions
  const quickActions = [
    {
      title: "Nouvel Article",
      description: "Créer un nouvel article",
      icon: FileText,
      color: "bg-blue-500",
      link: "/dashboard/articles/new",
      permission: "create_articles"
    },
    {
      title: "Nouveau Podcast",
      description: "Enregistrer un podcast",
      icon: Mic,
      color: "bg-purple-500",
      link: "/dashboard/podcasts/new",
      permission: "create_podcasts"
    },
    {
      title: "Gérer Indices",
      description: "Indices boursiers",
      icon: LineChart,
      color: "bg-green-500",
      link: "/dashboard/indices-management",
      permission: "manage_indices"
    },
    {
      title: "Gérer Devises",
      description: "Taux de change",
      icon: DollarSign,
      color: "bg-yellow-500",
      link: "/dashboard/currency-manager",
      permission: "manage_currencies"
    },
    {
      title: "Analytics",
      description: "Tableaux de bord",
      icon: BarChart3,
      color: "bg-indigo-500",
      link: "/dashboard/analytics",
      permission: "view_analytics"
    },
    {
      title: "Utilisateurs",
      description: "Gestion des utilisateurs",
      icon: Users,
      color: "bg-red-500",
      link: "/dashboard/users",
      permission: "manage_users"
    }
  ].filter(action => !action.permission || hasPermission(action.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête dynamique */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour, {user?.firstName} ! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentTime.toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">Statut</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">En ligne</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistiques en temps réel */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Aperçu en Temps Réel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Articles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.articles.total}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.articles.published} publiés
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Indices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Indices</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.indices.total}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600">↗ {stats.indices.gainers}</span>
                    <span className="text-xs text-red-600">↘ {stats.indices.losers}</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <LineChart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Devises */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Devises</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.currencies.total}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600">↗ {stats.currencies.gainers}</span>
                    <span className="text-xs text-red-600">↘ {stats.currencies.losers}</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Statut système */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Système</p>
                  <p className="text-2xl font-bold text-green-600">OK</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tous services actifs
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Données financières en direct */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Indices récents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Indices Récents</h3>
              <Link 
                to="/dashboard/indices-management"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {indices.slice(0, 5).map((index) => (
                <div key={index.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{index.name}</p>
                    <p className="text-sm text-gray-600">{index.market}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{index.current_value}</p>
                    <div className={`text-sm flex items-center gap-1 ${
                      (index.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(index.change_percent || 0) >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {(index.change_percent || 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devises majeures */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Devises Majeures</h3>
              <Link 
                to="/dashboard/currency-manager"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {getMajorCurrencies().slice(0, 5).map((currency) => (
                <div key={currency.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{currency.flag_emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900">{currency.code}</p>
                      <p className="text-sm text-gray-600">{currency.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {currency.current_rate.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                    </p>
                    <div className={`text-sm flex items-center gap-1 ${
                      (currency.change_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(currency.change_percent || 0) >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {(currency.change_percent || 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles récents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Articles Récents</h3>
            <Link 
              to="/dashboard/articles"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.slice(0, 6).map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.summary || 'Aucun résumé disponible'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
