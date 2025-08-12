import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
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
      </DashboardLayout>
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
      reported: "editor@example.com",
      reason: "Fausses informations",
      status: "reviewing",
      createdAt: "2024-01-15 12:15",
      priority: "medium",
    },
    {
      id: "3",
      type: "comment",
      content: "Spam répétitif dans plusieurs articles",
      reporter: "mod@example.com",
      reported: "spammer@example.com",
      reason: "Spam",
      status: "pending",
      createdAt: "2024-01-15 10:45",
      priority: "high",
    },
  ];

  const comments = [
    {
      id: "1",
      content: "Ce commentaire nécessite une révision manuelle...",
      author: "user123@example.com",
      article: "Évolution du FCFA face à l'Euro",
      status: "pending",
      createdAt: "2024-01-15 16:20",
      flags: ["inappropriate"],
    },
    {
      id: "2",
      content: "Commentaire signalé par plusieurs utilisateurs...",
      author: "suspicious@example.com",
      article: "Perspectives économiques du Mali",
      status: "flagged",
      createdAt: "2024-01-15 15:10",
      flags: ["spam", "offensive"],
    },
  ];

  const handleApprove = async (id: string, type: string) => {
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
    <DashboardLayout
      title="Centre de modération"
      subtitle="Gérez le contenu signalé et modérez les interactions sur la plateforme"
      actions={
        <>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent w-64"
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
              <option value="reviewing">En révision</option>
              <option value="flagged">Signalé</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
        </>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
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
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
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

          <div className="p-6">
            {activeTab === "reports" && (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              report.status,
                            )}`}
                          >
                            {report.status}
                          </span>
                          <span
                            className={`text-sm font-medium ${getPriorityColor(
                              report.priority,
                            )}`}
                          >
                            Priorité {report.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {report.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">{report.content}</p>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Signalé par:</span>{" "}
                          {report.reporter} |{" "}
                          <span className="font-medium">Utilisateur:</span>{" "}
                          {report.reported} |{" "}
                          <span className="font-medium">Raison:</span>{" "}
                          {report.reason}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(report.id, "Signalement")}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(report.id, "Signalement")}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(report.reported)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Suspendre utilisateur"
                        >
                          <Ban className="w-4 h-4" />
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
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              comment.status,
                            )}`}
                          >
                            {comment.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt}
                          </span>
                          {comment.flags.map((flag) => (
                            <span
                              key={flag}
                              className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-900 mb-2">{comment.content}</p>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Auteur:</span>{" "}
                          {comment.author} |{" "}
                          <span className="font-medium">Article:</span>{" "}
                          {comment.article}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(comment.id, "Commentaire")}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(comment.id, "Commentaire")}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
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
