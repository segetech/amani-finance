import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  FileText,
  Mic,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Calendar,
  Plus,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Star,
  Globe,
  Target,
  Zap,
} from "lucide-react";

export default function DashboardMain() {
  const { user, hasPermission } = useAuth();

  // Mock data - in real app this would come from API
  const stats = {
    articles: { total: 156, thisMonth: 23, growth: 12.5 },
    podcasts: { total: 48, thisMonth: 4, growth: 8.3 },
    indices: { total: 87, thisMonth: 12, growth: 15.2 },
    users: { total: 25847, thisMonth: 1247, growth: 5.1 },
    views: { total: 189456, thisWeek: 23456, growth: 18.7 },
    reports: { pending: 12, resolved: 145, total: 157 },
  };

  const recentActivity = [
    {
      id: 1,
      type: "article",
      title: "Nouvel article publié",
      description: "Évolution du FCFA face à l'Euro en 2024",
      time: "Il y a 2 heures",
      user: "Fatou Diallo",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "indice",
      title: "Indice mis à jour",
      description: "Taux directeur BCEAO - 3.5%",
      time: "Il y a 4 heures",
      user: "Ibrahim Touré",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "moderation",
      title: "Commentaire modéré",
      description: "Signalement traité - contenu inapproprié",
      time: "Il y a 6 heures",
      user: "Aïcha Koné",
      icon: Shield,
      color: "text-amber-600",
    },
    {
      id: 4,
      type: "user",
      title: "Nouvel utilisateur",
      description: "Inscription d'un analyste - INSTAT",
      time: "Il y a 8 heures",
      user: "Système",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      label: "Nouvel article",
      path: "/dashboard/articles/new",
      icon: FileText,
      permission: "create_articles",
      color: "bg-blue-500",
    },
    {
      label: "Nouveau podcast",
      path: "/dashboard/podcasts/new", 
      icon: Mic,
      permission: "create_podcasts",
      color: "bg-purple-500",
    },
    {
      label: "Nouvel indice",
      path: "/dashboard/indices/new",
      icon: BarChart3,
      permission: "create_indices",
      color: "bg-green-500",
    },
    {
      label: "Nouvel utilisateur",
      path: "/dashboard/users/new",
      icon: Users,
      permission: "create_users",
      color: "bg-amber-500",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 17) return "Bon après-midi";
    return "Bonsoir";
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    change: number,
    icon: React.ComponentType<{ className?: string }>,
    permission?: string
  ) => {
    if (permission && !hasPermission(permission)) return null;

    const isPositive = change >= 0;
    const Icon = icon;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-amani-secondary/20 rounded-lg">
            <Icon className="w-6 h-6 text-amani-primary" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amani-primary mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      title={`${getGreeting()}, ${user?.firstName}!`}
      subtitle={`Voici un aperçu de vos activités sur la plateforme Amani`}
      actions={
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Welcome Message & User Roles */}
        <div className="bg-gradient-to-r from-amani-primary to-amani-primary/80 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Tableau de bord - {user?.organization}
              </h2>
              <p className="text-white/90 mb-4">
                Gérez votre contenu et suivez les performances de la plateforme
              </p>
              {user?.roles && user.roles.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-white/80">Vos rôles:</span>
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Activity className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderStatCard(
            "Articles totaux",
            stats.articles.total,
            stats.articles.growth,
            FileText,
            "view_analytics"
          )}
          {renderStatCard(
            "Podcasts",
            stats.podcasts.total,
            stats.podcasts.growth,
            Mic,
            "view_analytics"
          )}
          {renderStatCard(
            "Indices économiques",
            stats.indices.total,
            stats.indices.growth,
            BarChart3,
            "view_indices"
          )}
          {renderStatCard(
            "Utilisateurs actifs",
            stats.users.total,
            stats.users.growth,
            Users,
            "view_user_activity"
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
          <h3 className="text-xl font-semibold text-amani-primary mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Actions rapides
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              if (action.permission && !hasPermission(action.permission)) {
                return null;
              }
              
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 hover:border-amani-primary hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-amani-primary">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-amani-primary flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activité récente
                </h3>
                <Link
                  to="/dashboard/activity"
                  className="text-amani-primary hover:underline text-sm"
                >
                  Voir tout →
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {activity.title}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {activity.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>Par {activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            {hasPermission("view_analytics") && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-amani-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vues cette semaine</span>
                    <span className="font-bold text-amani-primary">
                      {stats.views.thisWeek.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amani-primary h-2 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">+{stats.views.growth}%</span>
                    <span className="text-gray-500">vs semaine dernière</span>
                  </div>
                </div>
              </div>
            )}

            {/* Moderation Tasks */}
            {hasPermission("moderate_comments") && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-amani-primary mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Modération
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium">En attente</span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {stats.reports.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Traités</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {stats.reports.resolved}
                    </span>
                  </div>
                  <Link
                    to="/dashboard/moderation"
                    className="block w-full text-center py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors text-sm"
                  >
                    Aller à la modération
                  </Link>
                </div>
              </div>
            )}

            {/* Personal Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-amani-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Mes statistiques
              </h3>
              <div className="space-y-3">
                {hasPermission("create_articles") && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Articles créés</span>
                    <span className="font-bold text-amani-primary">23</span>
                  </div>
                )}
                {hasPermission("create_podcasts") && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Podcasts publiés</span>
                    <span className="font-bold text-amani-primary">4</span>
                  </div>
                )}
                {hasPermission("create_indices") && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Indices mis à jour</span>
                    <span className="font-bold text-amani-primary">12</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-gray-600">Dernière connexion</span>
                  <span className="text-sm text-gray-500">{user?.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
