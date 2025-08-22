import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Activity,
  Users,
  Eye,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  FileText,
  Mic,
  BarChart3,
  MessageSquare,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Heart,
  Share2,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  User,
  Building,
} from "lucide-react";

export default function UserActivity() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Check permissions
  if (!user || !hasPermission("view_user_activity")) {
    return (
      <>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour voir l'activité des
            utilisateurs.
          </p>
        </div>
      </>
    );
  }

  // Mock data - in real app would come from API
  const activities = [
    {
      id: "1",
      userId: "user-123",
      userName: "Fatou Diallo",
      userEmail: "fatou@example.com",
      userRole: "editeur",
      action: "login",
      actionLabel: "Connexion",
      description: "Connexion depuis Bamako, Mali",
      timestamp: "2024-01-15T14:30:00Z",
      ipAddress: "197.149.89.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      device: "desktop",
      location: "Bamako, Mali",
      status: "success",
      details: {
        sessionDuration: "2h 45m",
        pagesVisited: 12,
      },
    },
    {
      id: "2",
      userId: "user-456",
      userName: "Ibrahim Touré",
      userEmail: "ibrahim@example.com",
      userRole: "analyste",
      action: "create_article",
      actionLabel: "Article créé",
      description: "Création de l'article 'Évolution du FCFA'",
      timestamp: "2024-01-15T13:15:00Z",
      ipAddress: "197.149.89.15",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      device: "desktop",
      location: "Ouagadougou, Burkina Faso",
      status: "success",
      details: {
        articleId: "article-789",
        category: "Économie",
        wordCount: 1250,
      },
    },
    {
      id: "3",
      userId: "user-789",
      userName: "Aïcha Koné",
      userEmail: "aicha@example.com",
      userRole: "moderateur",
      action: "moderate_comment",
      actionLabel: "Commentaire modéré",
      description: "Modération d'un commentaire inapproprié",
      timestamp: "2024-01-15T12:45:00Z",
      ipAddress: "197.149.89.25",
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
      device: "tablet",
      location: "Niamey, Niger",
      status: "success",
      details: {
        commentId: "comment-456",
        action: "hidden",
        reason: "Contenu inapproprié",
      },
    },
    {
      id: "4",
      userId: "user-321",
      userName: "Moussa Traoré",
      userEmail: "moussa@example.com",
      userRole: "abonne",
      action: "download_report",
      actionLabel: "Rapport téléchargé",
      description: "Téléchargement du rapport économique mensuel",
      timestamp: "2024-01-15T11:20:00Z",
      ipAddress: "197.149.89.30",
      userAgent:
        "Mozilla/5.0 (Android 12; Mobile; rv:108.0) Gecko/108.0 Firefox/108.0",
      device: "mobile",
      location: "Bamako, Mali",
      status: "success",
      details: {
        reportId: "report-202401",
        format: "PDF",
        size: "2.3 MB",
      },
    },
    {
      id: "5",
      userId: "user-654",
      userName: "Salif Keita",
      userEmail: "salif@example.com",
      userRole: "editeur",
      action: "failed_login",
      actionLabel: "Échec de connexion",
      description: "Tentative de connexion échouée - mot de passe incorrect",
      timestamp: "2024-01-15T10:05:00Z",
      ipAddress: "41.189.178.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      device: "desktop",
      location: "Abidjan, Côte d'Ivoire",
      status: "failed",
      details: {
        attempts: 3,
        lastSuccessfulLogin: "2024-01-14T08:30:00Z",
      },
    },
  ];

  const stats = {
    totalUsers: 25847,
    activeToday: 1247,
    totalSessions: 3456,
    averageSessionTime: "24m",
    topActions: {
      login: 890,
      view_article: 567,
      download_report: 234,
      create_content: 123,
    },
    deviceBreakdown: {
      desktop: 65,
      mobile: 28,
      tablet: 7,
    },
  };

  const actionTypes = [
    {
      value: "login",
      label: "Connexion",
      icon: LogIn,
      color: "text-green-600",
    },
    {
      value: "logout",
      label: "Déconnexion",
      icon: LogOut,
      color: "text-blue-600",
    },
    {
      value: "create_article",
      label: "Article créé",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      value: "edit_article",
      label: "Article modifié",
      icon: Edit,
      color: "text-amber-600",
    },
    {
      value: "create_podcast",
      label: "Podcast créé",
      icon: Mic,
      color: "text-indigo-600",
    },
    {
      value: "create_indice",
      label: "Indice créé",
      icon: BarChart3,
      color: "text-emerald-600",
    },
    {
      value: "moderate_comment",
      label: "Commentaire modéré",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      value: "download_report",
      label: "Rapport téléchargé",
      icon: Download,
      color: "text-cyan-600",
    },
    {
      value: "failed_login",
      label: "Échec connexion",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  const handleExportActivity = async () => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success("Export réussi", "Les données d'activité ont été exportées");
  };

  const handleBulkAction = async (action: string) => {
    if (selectedActivities.length === 0) {
      error("Erreur", "Aucune activité sélectionnée");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (action) {
      case "flag":
        warning(
          "Activités signalées",
          `${selectedActivities.length} activité(s) signalée(s)`,
        );
        break;
      case "export":
        success(
          "Export réussi",
          `${selectedActivities.length} activité(s) exportée(s)`,
        );
        break;
    }
    setSelectedActivities([]);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === "all" || activity.userId === filterUser;
    const matchesAction =
      filterAction === "all" || activity.action === filterAction;

    // Date filtering
    const activityDate = new Date(activity.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let matchesDate = true;
    switch (filterDate) {
      case "today":
        matchesDate = activityDate.toDateString() === today.toDateString();
        break;
      case "yesterday":
        matchesDate = activityDate.toDateString() === yesterday.toDateString();
        break;
      case "week":
        matchesDate = activityDate >= weekAgo;
        break;
    }

    return matchesSearch && matchesUser && matchesAction && matchesDate;
  });

  const getActionIcon = (action: string) => {
    const actionType = actionTypes.find((t) => t.value === action);
    return actionType ? actionType.icon : Activity;
  };

  const getActionColor = (action: string) => {
    const actionType = actionTypes.find((t) => t.value === action);
    return actionType ? actionType.color : "text-gray-600";
  };

  const getActionLabel = (action: string) => {
    const actionType = actionTypes.find((t) => t.value === action);
    return actionType ? actionType.label : action;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Monitor;
      default:
        return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "failed":
        return XCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <>
      {/* Header previously from DashboardLayout props can be re-added locally if desired */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-amani-primary">Activité des utilisateurs</h1>
        <p className="text-gray-600">Surveillez et analysez l'activité en temps réel sur la plateforme</p>
      </div> */}
      {/* actions JSX was previously provided via DashboardLayout props */}
      <div className="space-y-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.activeToday.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Utilisateurs actifs aujourd'hui
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.totalSessions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Sessions aujourd'hui</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.averageSessionTime}
            </div>
            <div className="text-sm text-gray-600">
              Durée moyenne de session
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <LogIn className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.topActions.login}
            </div>
            <div className="text-sm text-gray-600">Connexions aujourd'hui</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par utilisateur, email ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  <option value="all">Toutes les actions</option>
                  {actionTypes.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="week">Cette semaine</option>
                <option value="all">Toutes les dates</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Actions Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-amani-primary mb-4">
            Actions populaires aujourd'hui
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.topActions).map(([action, count]) => {
              const ActionIcon = getActionIcon(action);
              return (
                <div
                  key={action}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <ActionIcon className={`w-5 h-5 ${getActionColor(action)}`} />
                  <div>
                    <div className="font-bold text-amani-primary">{count}</div>
                    <div className="text-sm text-gray-600">
                      {getActionLabel(action)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedActivities.length > 0 && (
          <div className="bg-amani-primary text-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedActivities.length} activité(s) sélectionnée(s)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction("flag")}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Signaler
                </button>
                <button
                  onClick={() => handleBulkAction("export")}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-amani-primary">
              Activité récente ({filteredActivities.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => {
              const ActionIcon = getActionIcon(activity.action);
              const StatusIcon = getStatusIcon(activity.status);
              const DeviceIcon = getDeviceIcon(activity.device);

              return (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(activity.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActivities((prev) => [
                            ...prev,
                            activity.id,
                          ]);
                        } else {
                          setSelectedActivities((prev) =>
                            prev.filter((id) => id !== activity.id),
                          );
                        }
                      }}
                      className="mt-2 h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                    />

                    <div
                      className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}
                    >
                      <ActionIcon
                        className={`w-5 h-5 ${getActionColor(activity.action)}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {activity.userName}
                            </h4>
                            <span className="text-sm text-gray-500">
                              ({activity.userEmail})
                            </span>
                            <span className="px-2 py-1 bg-amani-secondary/20 text-amani-primary rounded-full text-xs">
                              {activity.userRole}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-medium">
                              {getActionLabel(activity.action)}
                            </span>
                            <span>•</span>
                            <span>{activity.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <StatusIcon
                            className={`w-4 h-4 ${activity.status === "success" ? "text-green-600" : activity.status === "failed" ? "text-red-600" : "text-amber-600"}`}
                          />
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DeviceIcon className="w-4 h-4" />
                          <span className="capitalize">{activity.device}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>{activity.ipAddress}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(activity.timestamp).toLocaleTimeString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                      </div>

                      {activity.details && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">
                            Détails :
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            {Object.entries(activity.details).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}:
                                  </span>{" "}
                                  <span>{String(value)}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterAction !== "all" || filterDate !== "all"
                ? "Essayez de modifier vos filtres de recherche."
                : "Aucune activité enregistrée pour le moment."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
