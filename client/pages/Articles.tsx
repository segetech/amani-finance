import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  TrendingUp,
  MessageSquare,
  Share2,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Articles() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Check permissions after all hooks
  if (!user || !hasPermission("view_analytics")) {
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
              Vous n'avez pas les permissions nécessaires pour voir les articles.
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

  const articles = [
    {
      id: "1",
      title: "Évolution du FCFA face à l'Euro en 2024",
      excerpt: "Analyse détaillée des fluctuations monétaires et leur impact sur l'économie sahélienne.",
      author: "Fatou Diallo",
      category: "Marché",
      status: "published",
      views: 8342,
      comments: 23,
      shares: 156,
      publishedAt: "2024-01-15",
      lastModified: "2024-01-15 14:30",
      featured: true,
    },
    {
      id: "2",
      title: "Perspectives économiques du Mali pour 2024",
      excerpt: "Les prévisions de croissance et les défis économiques à relever cette année.",
      author: "Amadou Traoré",
      category: "Économie",
      status: "published",
      views: 6891,
      comments: 34,
      shares: 89,
      publishedAt: "2024-01-14",
      lastModified: "2024-01-14 16:20",
      featured: false,
    },
    {
      id: "3",
      title: "Investissements miniers au Burkina Faso",
      excerpt: "Nouvelles opportunités d'investissement dans le secteur minier burkinabé.",
      author: "Adjoa Kone",
      category: "Industrie",
      status: "draft",
      views: 0,
      comments: 0,
      shares: 0,
      publishedAt: null,
      lastModified: "2024-01-15 10:45",
      featured: false,
    },
    {
      id: "4",
      title: "BCEAO : Nouvelles directives bancaires",
      excerpt: "Les dernières régulations de la Banque Centrale et leur impact sur le secteur bancaire.",
      author: "Mariama Sy",
      category: "Marché",
      status: "review",
      views: 0,
      comments: 0,
      shares: 0,
      publishedAt: null,
      lastModified: "2024-01-15 09:30",
      featured: false,
    },
    {
      id: "5",
      title: "Tech startup au Sahel : opportunités et défis",
      excerpt: "L'écosystème technologique sahélien en pleine expansion.",
      author: "Ibrahim Diarra",
      category: "Tech",
      status: "published",
      views: 4234,
      comments: 12,
      shares: 67,
      publishedAt: "2024-01-13",
      lastModified: "2024-01-13 18:15",
      featured: false,
    },
  ];

  const categories = [
    { id: "all", label: "Toutes catégories" },
    { id: "Économie", label: "Économie" },
    { id: "Marché", label: "Marché" },
    { id: "Industrie", label: "Industrie" },
    { id: "Tech", label: "Tech" },
    { id: "Investissement", label: "Investissement" },
  ];

  const stats = [
    {
      label: "Articles publiés",
      value: articles.filter(a => a.status === "published").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Brouillons",
      value: articles.filter(a => a.status === "draft").length.toString(),
      icon: Edit,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "En révision",
      value: articles.filter(a => a.status === "review").length.toString(),
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Vues totales",
      value: articles.reduce((sum, a) => sum + a.views, 0).toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "draft":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "review":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || article.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditArticle = (id: string) => {
    navigate(`/dashboard/articles/${id}/edit`);
  };

  const handleDeleteArticle = (id: string) => {
    warning("Suppression", `Article ${id} supprimé`);
  };

  const handlePublishArticle = (id: string) => {
    success("Publication", `Article ${id} publié`);
  };

  return (
    <DashboardLayout
      title="Gestion des articles"
      subtitle="Créez, modifiez et gérez vos articles"
      actions={
        <>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un article..."
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
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
              <option value="review">En révision</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <Link
            to="/dashboard/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </Link>
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

        {/* Articles List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amani-primary">
                Articles ({filteredArticles.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "Aucun article ne correspond à vos critères."
                    : "Commencez par créer votre premier article."}
                </p>
                <Link
                  to="/dashboard/articles/new"
                  className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel article
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {article.featured && (
                            <span className="px-2 py-1 bg-amani-primary text-white rounded-full text-xs font-medium">
                              À la une
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              article.status,
                            )}`}
                          >
                            {article.status === "published" && "Publié"}
                            {article.status === "draft" && "Brouillon"}
                            {article.status === "review" && "En révision"}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {article.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {article.author}
                          </span>
                          {article.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views.toLocaleString()} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {article.comments} commentaires
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {article.shares} partages
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(article.status)}
                        </div>

                        <div className="flex items-center gap-1">
                          {article.status === "draft" && (
                            <button
                              onClick={() => handlePublishArticle(article.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Publier"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditArticle(article.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
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
