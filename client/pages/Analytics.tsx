import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Users,
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  Activity,
  Globe,
  PieChart,
} from "lucide-react";

export default function Analytics() {
  const { user, hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState("7");
  const [metric, setMetric] = useState("all");

  // Check permissions
  if (!user || !hasPermission("view_analytics")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder aux
            analyses.
          </p>
          <Link
            to="/dashboard"
            className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Pages vues",
      value: "128,453",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
    },
    {
      label: "Utilisateurs actifs",
      value: "3,247",
      change: "+8.2%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Articles lus",
      value: "15,678",
      change: "+23.1%",
      trend: "up",
      icon: FileText,
    },
    {
      label: "Taux d'engagement",
      value: "64.2%",
      change: "-2.4%",
      trend: "down",
      icon: Activity,
    },
  ];

  const topArticles = [
    {
      title: "Évolution du FCFA face à l'Euro en 2024",
      views: "8,342",
      engagement: "87%",
      category: "Marché",
    },
    {
      title: "Perspectives économiques du Mali",
      views: "6,891",
      engagement: "92%",
      category: "Économie",
    },
    {
      title: "Investissements miniers au Burkina Faso",
      views: "5,432",
      engagement: "78%",
      category: "Industrie",
    },
    {
      title: "BCEAO : Nouvelles directives bancaires",
      views: "4,876",
      engagement: "85%",
      category: "Marché",
    },
    {
      title: "Tech startup au Sahel : opportunités",
      views: "4,234",
      engagement: "74%",
      category: "Tech",
    },
  ];

  const countryData = [
    { country: "Mali", visits: "8,342", percentage: "32%" },
    { country: "Burkina Faso", visits: "5,891", percentage: "23%" },
    { country: "Niger", visits: "4,532", percentage: "18%" },
    { country: "Tchad", visits: "3,876", percentage: "15%" },
    { country: "Mauritanie", visits: "3,124", percentage: "12%" },
  ];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-amani-primary mb-2">
                Analytics & Statistiques
              </h1>
              <p className="text-gray-600">
                Analysez les performances de votre contenu et l'engagement des
                utilisateurs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  <option value="7">7 derniers jours</option>
                  <option value="30">30 derniers jours</option>
                  <option value="90">90 derniers jours</option>
                  <option value="365">1 an</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amani-secondary/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-amani-primary" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-amani-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-amani-primary">
                  Évolution du trafic
                </h2>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amani-primary" />
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    <option value="all">Toutes les métriques</option>
                    <option value="views">Pages vues</option>
                    <option value="users">Utilisateurs</option>
                    <option value="engagement">Engagement</option>
                  </select>
                </div>
              </div>
              {/* Chart would go here - using placeholder for now */}
              <div className="h-64 bg-gradient-to-br from-amani-secondary/10 to-amani-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-amani-primary mx-auto mb-3" />
                  <p className="text-gray-600">Graphique interactif</p>
                  <p className="text-sm text-gray-500">
                    Visualisation des données en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Country Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Répartition par pays
              </h2>
            </div>
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {country.country}
                      </span>
                      <span className="text-sm text-gray-500">
                        {country.percentage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amani-primary h-2 rounded-full"
                        style={{ width: country.percentage }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {country.visits} visites
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amani-primary" />
                <h2 className="text-xl font-semibold text-amani-primary">
                  Articles les plus populaires
                </h2>
              </div>
              <Link
                to="/dashboard/articles"
                className="text-amani-primary hover:text-amani-primary/80 text-sm font-medium"
              >
                Voir tous les articles →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Article
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Catégorie
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Vues
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topArticles.map((article, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {article.title}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amani-secondary/20 text-amani-primary rounded-full text-xs">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {article.views}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: article.engagement }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {article.engagement}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Activité en temps réel
              </h2>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amani-primary mb-2">
                  47
                </div>
                <div className="text-sm text-gray-600">
                  Utilisateurs connectés maintenant
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amani-primary mb-2">
                  12
                </div>
                <div className="text-sm text-gray-600">
                  Articles lus cette heure
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amani-primary mb-2">
                  3
                </div>
                <div className="text-sm text-gray-600">
                  Nouveaux abonnements
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
