import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Database,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Trash2,
  MoreVertical,
  Clock,
  Code,
} from "lucide-react";

export default function Logs() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterService, setFilterService] = useState("all");

  // Check permissions after all hooks
  if (!user || !hasPermission("access_logs")) {
    return (
      <>
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-amani-primary mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder aux logs système.
            </p>
            <Link
              to="/dashboard"
              className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </>
    );
  }

  const logs = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      level: "error",
      service: "api",
      message: "BCEAO API connection failed: timeout after 30s",
      details: "Failed to fetch exchange rates from https://api.bceao.int/v2/rates",
      user: "system",
      ip: "127.0.0.1",
      userAgent: "Node.js/18.0.0",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:10",
      level: "info",
      service: "auth",
      message: "User login successful",
      details: "User fatou.diallo@amani.demo authenticated successfully",
      user: "fatou.diallo@amani.demo",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:45",
      level: "warning",
      service: "storage",
      message: "Disk usage above 80%",
      details: "Current disk usage: 85% (8.5GB of 10GB used)",
      user: "system",
      ip: "127.0.0.1",
      userAgent: "System Monitor",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:15:30",
      level: "info",
      service: "content",
      message: "Article published successfully",
      details: "Article 'Évolution du FCFA face à l'Euro en 2024' published by fatou.diallo@amani.demo",
      user: "fatou.diallo@amani.demo",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:10:15",
      level: "debug",
      service: "cache",
      message: "Cache cleared for user preferences",
      details: "Cleared 245 cached items for user preference updates",
      user: "system",
      ip: "127.0.0.1",
      userAgent: "Cache Manager",
    },
    {
      id: "6",
      timestamp: "2024-01-15 14:05:00",
      level: "error",
      service: "email",
      message: "Failed to send newsletter",
      details: "SMTP server connection failed: Authentication error",
      user: "system",
      ip: "127.0.0.1",
      userAgent: "Email Service",
    },
    {
      id: "7",
      timestamp: "2024-01-15 14:00:45",
      level: "info",
      service: "backup",
      message: "Database backup completed",
      details: "Backup file: db_backup_20240115_140045.sql (2.3GB)",
      user: "system",
      ip: "127.0.0.1",
      userAgent: "Backup Service",
    },
    {
      id: "8",
      timestamp: "2024-01-15 13:55:30",
      level: "warning",
      service: "security",
      message: "Multiple failed login attempts detected",
      details: "5 failed login attempts for user test@example.com from IP 203.0.113.42",
      user: "test@example.com",
      ip: "203.0.113.42",
      userAgent: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
    },
  ];

  const levels = [
    { id: "all", label: "Tous les niveaux" },
    { id: "debug", label: "Debug" },
    { id: "info", label: "Info" },
    { id: "warning", label: "Warning" },
    { id: "error", label: "Error" },
  ];

  const services = [
    { id: "all", label: "Tous les services" },
    { id: "api", label: "API" },
    { id: "auth", label: "Authentification" },
    { id: "content", label: "Contenu" },
    { id: "storage", label: "Stockage" },
    { id: "cache", label: "Cache" },
    { id: "email", label: "Email" },
    { id: "backup", label: "Sauvegarde" },
    { id: "security", label: "Sécurité" },
  ];

  const stats = [
    {
      label: "Erreurs",
      value: logs.filter(l => l.level === "error").length.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Avertissements",
      value: logs.filter(l => l.level === "warning").length.toString(),
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Informations",
      value: logs.filter(l => l.level === "info").length.toString(),
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Debug",
      value: logs.filter(l => l.level === "debug").length.toString(),
      icon: Code,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "debug":
        return <Code className="w-4 h-4 text-gray-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      filterLevel === "all" || log.level === filterLevel;
    const matchesService =
      filterService === "all" || log.service === filterService;
    return matchesSearch && matchesLevel && matchesService;
  });

  const handleRefreshLogs = () => {
    success("Logs", "Logs actualisés");
  };

  const handleExportLogs = () => {
    success("Export", "Logs exportés avec succès");
  };

  const handleViewDetails = (id: string) => {
    success("Détails", `Détails du log ${id}`);
  };

  const handleClearLogs = () => {
    warning("Suppression", "Logs anciens supprimés");
  };

  return (
    <>
      {/* Actions bar previously in DashboardLayout */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
          >
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleRefreshLogs}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>
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

        {/* Logs List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amani-primary">
                Logs système ({filteredLogs.length})
              </h2>
              <button
                onClick={handleClearLogs}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Nettoyer les anciens logs
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun log trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterLevel !== "all" || filterService !== "all"
                    ? "Aucun log ne correspond à vos critères."
                    : "Aucun log disponible pour le moment."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow font-mono text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-500 font-medium">
                            {log.timestamp}
                          </span>
                          {getLevelIcon(log.level)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                              log.level,
                            )}`}
                          >
                            {log.level.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {log.service}
                          </span>
                        </div>

                        <div className="mb-2">
                          <span className="font-semibold text-gray-900">{log.message}</span>
                        </div>

                        <div className="text-gray-600 mb-3">{log.details}</div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user}
                          </span>
                          <span>IP: {log.ip}</span>
                          <span className="max-w-xs truncate" title={log.userAgent}>
                            UA: {log.userAgent}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => handleViewDetails(log.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
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
    </>
  );
}
