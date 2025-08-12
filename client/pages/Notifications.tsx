import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  Bell,
  Search,
  Filter,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Settings,
  MoreVertical,
} from "lucide-react";

export default function Notifications() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Check permissions after all hooks
  if (!user || !hasPermission("system_settings")) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Vous n'avez pas les permissions nécessaires"
      >
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amani-primary mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour gérer les notifications.
            </p>
            <Link
              to="/dashboard"
              className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const notifications = [
    {
      id: "1",
      title: "Nouveau signalement reçu",
      message: "Un contenu a été signalé par un utilisateur et nécessite votre attention.",
      type: "warning",
      isRead: false,
      createdAt: "2024-01-15 14:30",
      sender: "Système",
      action: "Voir le signalement",
      actionUrl: "/dashboard/moderation",
    },
    {
      id: "2",
      title: "Article publié avec succès",
      message: "L'article 'Évolution du FCFA face à l'Euro en 2024' a été publié.",
      type: "success",
      isRead: true,
      createdAt: "2024-01-15 12:15",
      sender: "Fatou Diallo",
      action: "Voir l'article",
      actionUrl: "/dashboard/articles",
    },
    {
      id: "3",
      title: "Échec de synchronisation",
      message: "La synchronisation avec l'API BCEAO a échoué. Vérifiez la configuration.",
      type: "error",
      isRead: false,
      createdAt: "2024-01-15 10:45",
      sender: "Système",
      action: "Voir les intégrations",
      actionUrl: "/dashboard/integrations",
    },
    {
      id: "4",
      title: "Nouveau membre inscrit",
      message: "Un nouvel utilisateur s'est inscrit sur la plateforme.",
      type: "info",
      isRead: true,
      createdAt: "2024-01-15 09:20",
      sender: "Système",
      action: "Voir les utilisateurs",
      actionUrl: "/dashboard/users",
    },
    {
      id: "5",
      title: "Maintenance programmée",
      message: "Une maintenance est programmée pour le 20 janvier de 02:00 à 04:00 UTC.",
      type: "warning",
      isRead: false,
      createdAt: "2024-01-14 16:30",
      sender: "Administrateur",
      action: "Voir les paramètres",
      actionUrl: "/dashboard/settings",
    },
    {
      id: "6",
      title: "Rapport mensuel généré",
      message: "Le rapport analytique mensuel de décembre 2023 est maintenant disponible.",
      type: "success",
      isRead: true,
      createdAt: "2024-01-14 08:00",
      sender: "Système",
      action: "Voir les rapports",
      actionUrl: "/dashboard/reports",
    },
  ];

  const types = [
    { id: "all", label: "Tous les types" },
    { id: "info", label: "Information" },
    { id: "success", label: "Succès" },
    { id: "warning", label: "Avertissement" },
    { id: "error", label: "Erreur" },
  ];

  const stats = [
    {
      label: "Non lues",
      value: notifications.filter(n => !n.isRead).length.toString(),
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Lues",
      value: notifications.filter(n => n.isRead).length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Avertissements",
      value: notifications.filter(n => n.type === "warning").length.toString(),
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Erreurs",
      value: notifications.filter(n => n.type === "error").length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.isRead) ||
      (filterStatus === "unread" && !notification.isRead);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleMarkAsRead = (id: string) => {
    success("Notification", "Marquée comme lue");
  };

  const handleMarkAsUnread = (id: string) => {
    success("Notification", "Marquée comme non lue");
  };

  const handleDeleteNotification = (id: string) => {
    warning("Suppression", "Notification supprimée");
  };

  const handleMarkAllAsRead = () => {
    success("Notifications", "Toutes les notifications marquées comme lues");
  };

  return (
    <DashboardLayout
      title="Centre de notifications"
      subtitle="Gérez vos notifications système et alertes"
      actions={
        <>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
          </select>
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            <Check className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amani-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amani-primary">
                Notifications ({filteredNotifications.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune notification trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Aucune notification ne correspond à vos critères."
                    : "Vous n'avez aucune notification pour le moment."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      !notification.isRead
                        ? "border-amani-primary/30 bg-amani-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-amani-primary rounded-full"></div>
                          )}
                          {getTypeIcon(notification.type)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              notification.type,
                            )}`}
                          >
                            {notification.type === "info" && "Information"}
                            {notification.type === "success" && "Succès"}
                            {notification.type === "warning" && "Avertissement"}
                            {notification.type === "error" && "Erreur"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString("fr-FR")}
                          </span>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{notification.message}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {notification.sender}
                          </span>
                          {notification.action && (
                            <Link
                              to={notification.actionUrl}
                              className="text-amani-primary hover:underline"
                            >
                              {notification.action}
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        {notification.isRead ? (
                          <button
                            onClick={() => handleMarkAsUnread(notification.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Marquer comme non lue"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Marquer comme lue"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
