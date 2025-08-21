import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useArticles } from "../hooks/useArticles";
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

  // Utiliser le hook useArticles pour récupérer les données depuis Supabase
  const { 
    articles: supabaseArticles, 
    loading, 
    error: articlesError, 
    count,
    deleteArticle,
    updateArticle
  } = useArticles({
    status: filterStatus === "all" ? "all" : filterStatus as any,
    limit: 50,
    offset: 0
  });

  // Debug logs
  console.log('🔍 Articles Page Debug:', {
    loading,
    articlesError,
    articlesCount: supabaseArticles?.length || 0,
    filterStatus,
    filterCategory
  });

  // Check permissions after all hooks
  if (!user || !hasPermission("create_articles")) {
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
              Vous n'avez pas les permissions nécessaires pour voir les
              articles.
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

  // Transformer les données Supabase pour correspondre à la structure attendue
  const articles = supabaseArticles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    author: article.author ? `${article.author.first_name} ${article.author.last_name}` : 'Auteur inconnu',
    category: article.category_info?.name || 'Non catégorisé',
    status: article.status,
    views: article.views,
    comments: 0, // À implémenter plus tard avec les commentaires
    shares: article.shares,
    publishedAt: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : null,
    lastModified: new Date(article.updated_at).toLocaleString('fr-FR'),
    featured: false // À implémenter plus tard
  }));

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
      value: articles.filter((a) => a.status === "published").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Brouillons",
      value: articles.filter((a) => a.status === "draft").length.toString(),
      icon: Edit,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "En révision",
      value: articles.filter((a) => a.status === "review").length.toString(),
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

  const handleEditArticle = (slug: string) => {
    // Route définie dans App.tsx: /dashboard/articles/edit/:id
    navigate(`/dashboard/articles/edit/${slug}`);
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id);
      success("Suppression", "Article supprimé avec succès");
    } catch (err) {
      error("Erreur", "Impossible de supprimer l'article");
    }
  };

  const handlePublishArticle = async (id: string) => {
    try {
      await updateArticle(id, { status: 'published' as any });
      success("Publication", "Article publié avec succès");
    } catch (err) {
      error("Erreur", "Impossible de publier l'article");
    }
  };

  return (
    <DashboardLayout
      title="Gestion des articles"
      subtitle="Créez, modifiez et gérez vos articles"
      actions={
        <div className="flex items-center gap-4">
          {/* Bouton de création principale */}
          {hasPermission("create_articles") && (
            <button
              onClick={() => navigate("/dashboard/articles/new")}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouvel article
            </button>
          )}

          {/* Barre de recherche améliorée */}
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 min-w-[320px] shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Filtres stylisés */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">📰 Publiés</option>
                <option value="draft">✏️ Brouillons</option>
                <option value="review">⏳ En révision</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amani-primary mb-4"></div>
            <span className="text-gray-600">Chargement des articles...</span>
            <div className="mt-4 text-sm text-gray-500">
              Vérifiez la console (F12) pour plus de détails
            </div>
          </div>
        )}

        {/* Error State */}
        {articlesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">Erreur lors du chargement des articles</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {!loading && !articlesError && (
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
        )}

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
                  {searchTerm ||
                  filterStatus !== "all" ||
                  filterCategory !== "all"
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
                              {new Date(article.publishedAt).toLocaleDateString(
                                "fr-FR",
                              )}
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
                            onClick={() => handleEditArticle(article.slug)}
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
