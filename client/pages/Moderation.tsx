import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Shield,
  Flag,
  MessageSquare,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Clock,
  User,
  ArrowLeft,
  Filter,
  Search,
  MoreVertical,
  Ban,
  FileText,
} from "lucide-react";

export default function Moderation() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [activeTab, setActiveTab] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Check permissions
  if (!user || !hasPermission("moderate_comments")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à la
            modération.
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

  const moderationStats = [
    {
      label: "Signalements en attente",
      value: "23",
      icon: Flag,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Commentaires modérés",
      value: "187",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Articles en révision",
      value: "8",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Utilisateurs suspendus",
      value: "12",
      icon: Ban,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  const reports = [
    {
      id: "1",
      type: "comment",
      content: "Commentaire inapproprié sur l'article 'Économie malienne'",
      reporter: "user@example.com",
      reported: "problematic@example.com",
      reason: "Langage offensant",
      status: "pending",
      createdAt: "2024-01-15 14:30",
      priority: "high",
    },
    {
      id: "2",
      type: "article",
      content: "Article contenant des informations erronées",
      reporter: "analyst@example.com",
      reported: "author@example.com",
      reason: "Désinformation",
      status: "reviewing",
      createdAt: "2024-01-15 10:15",
      priority: "medium",
    },
    {
      id: "3",
      type: "user",
      content: "Comportement de spam répétitif",
      reporter: "moderator@example.com",
      reported: "spammer@example.com",
      reason: "Spam",
      status: "pending",
      createdAt: "2024-01-14 16:45",
      priority: "low",
    },
  ];

  const comments = [
    {
      id: "1",
      content:
        "Ce texte contient du contenu potentiellement problématique qui nécessite une révision...",
      author: "user123@example.com",
      article: "Évolution du FCFA face à l'Euro",
      status: "flagged",
      createdAt: "2024-01-15 12:30",
      reports: 3,
    },
    {
      id: "2",
      content:
        "Excellent article, très informatif sur la situation économique régionale.",
      author: "reader@example.com",
      article: "Perspectives économiques du Mali",
      status: "approved",
      createdAt: "2024-01-15 11:20",
      reports: 0,
    },
    {
      id: "3",
      content: "Je ne suis pas d'accord avec cette analyse, voici pourquoi...",
      author: "critic@example.com",
      article: "Investissements miniers au Burkina Faso",
      status: "pending",
      createdAt: "2024-01-15 09:45",
      reports: 1,
    },
  ];

  const handleApprove = async (id: string, type: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    success("Approuvé", `${type} approuvé avec succès`);
  };

  const handleReject = async (id: string, type: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    warning("Rejeté", `${type} rejeté et masqué`);
  };

  const handleSuspendUser = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    error("Utilisateur suspendu", `L'utilisateur ${email} a été suspendu`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.article.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || comment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
                Centre de modération
              </h1>
              <p className="text-gray-600">
                Gérez le contenu signalé et modérez les interactions sur la
                plateforme
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {moderationStats.map((stat, index) => (
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
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "reports"
                    ? "border-amani-primary text-amani-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Signalements ({reports.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "comments"
                    ? "border-amani-primary text-amani-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Commentaires ({comments.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                  <option value="reviewing">En révision</option>
                  <option value="flagged">Signalé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "reports" && (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Flag className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {report.content}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Signalé par {report.reporter} • {report.createdAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            report.priority,
                          )}`}
                        >
                          {report.priority === "high"
                            ? "Priorité haute"
                            : report.priority === "medium"
                              ? "Priorité moyenne"
                              : "Priorité basse"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status,
                          )}`}
                        >
                          {report.status === "pending"
                            ? "En attente"
                            : report.status === "reviewing"
                              ? "En révision"
                              : report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          Utilisateur signalé:
                        </span>{" "}
                        {report.reported} •{" "}
                        <span className="font-medium">Raison:</span>{" "}
                        {report.reason}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleApprove(report.id, "Signalement")
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(report.id, "Signalement")}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Rejeter
                        </button>
                        <button
                          onClick={() => handleSuspendUser(report.reported)}
                          className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-sm"
                        >
                          <Ban className="w-4 h-4" />
                          Suspendre
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900 mb-2">
                            {comment.content}
                          </div>
                          <div className="text-sm text-gray-500">
                            Par {comment.author} sur "{comment.article}" •{" "}
                            {comment.createdAt}
                            {comment.reports > 0 && (
                              <span className="ml-2 text-red-600">
                                • {comment.reports} signalement(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          comment.status,
                        )}`}
                      >
                        {comment.status === "pending"
                          ? "En attente"
                          : comment.status === "approved"
                            ? "Approuvé"
                            : comment.status === "flagged"
                              ? "Signalé"
                              : comment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(comment.id, "Commentaire")}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(comment.id, "Commentaire")}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        <EyeOff className="w-4 h-4" />
                        Masquer
                      </button>
                      <button
                        onClick={() => handleSuspendUser(comment.author)}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-sm"
                      >
                        <Ban className="w-4 h-4" />
                        Suspendre auteur
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
