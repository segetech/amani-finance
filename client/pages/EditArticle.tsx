import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useArticles } from "../hooks/useArticles";
import DashboardLayout from "../components/DashboardLayout";
import UnifiedContentForm from "../components/UnifiedContentForm";
import { Article } from "../hooks/useArticles";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader,
  Eye,
  Calendar,
} from "lucide-react";

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const { fetchArticleBySlug, updateArticle } = useArticles();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Vérification des permissions
  if (!user || !hasPermission("manage_articles")) {
    return (
      <DashboardLayout title="Accès refusé">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour modifier des
              articles.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Charger les données de l'article
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📖 Chargement de l'article:", id);

        const articleData = await fetchArticleBySlug(id);
        
        if (articleData) {
          setArticle(articleData);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement de l'article:", err);
        error("Erreur", "Impossible de charger les données de l'article.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, error, fetchArticleBySlug]);

  // Gestion de la sauvegarde
  const handleSave = async (formData: any) => {
    try {
      console.log("📝 Mise à jour de l'article:", formData);

      const articleData = {
        type: 'article' as const,
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        description: formData.description,
        content: formData.content,
        status: formData.status,
        category_id: formData.category,
        author_id: user?.id || '',
        country: formData.country,
        tags: formData.tags,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        featured_image_alt: formData.featured_image_alt,
        published_at: formData.published_at,
        article_data: formData.article_data || {}
      };

      await updateArticle(article!.id, articleData);

      console.log("✅ Article mis à jour avec succès");

      success(
        "Article mis à jour",
        `L'article "${formData.title}" a été mis à jour avec succès.`,
      );

      navigate("/dashboard/articles");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      error(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour de l'article.",
      );
    }
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    navigate("/dashboard/articles");
  };

  // État de chargement
  if (loading) {
    return (
      <DashboardLayout title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">
              Chargement des données de l'article...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Article non trouvé
  if (notFound || !article) {
    return (
      <DashboardLayout title="Article introuvable">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Article introuvable
            </h2>
            <p className="text-gray-600 mb-6">
              L'article avec l'ID "{id}" n'a pas été trouvé.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/dashboard/articles")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour aux articles
              </button>
              <button
                onClick={() => navigate("/dashboard/articles/new")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Créer un article
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Modifier l'article"
      subtitle={`Modification de "${article.title}"`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/articles")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux articles
          </button>

          {/* Indicateur de statut */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                article.status === "published"
                  ? "bg-green-500"
                  : article.status === "draft"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 capitalize">
              {article.status === "published"
                ? "Publié"
                : article.status === "draft"
                  ? "Brouillon"
                  : "Archivé"}
            </span>
          </div>

          {/* Lien vers l'article publié */}
          {article.status === "published" && (
            <a
              href={`/article/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Voir l'article</span>
            </a>
          )}
        </div>

        {/* Informations de l'article existant */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Article en modification
              </h3>
              <p className="text-gray-600">
                Publié le{" "}
                {new Date(article.published_at || "").toLocaleDateString(
                  "fr-FR",
                )}
              </p>
            </div>

            {/* Métriques de l'article */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views?.toLocaleString() || 0} vues</span>
              </div>
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{article.likes || 0} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{article.read_time || 5} min</span>
              </div>
            </div>
          </div>

          {/* Tags de l'article */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                Étiquettes actuelles :
              </p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulaire unifié */}
        <UnifiedContentForm
          type="article"
          initialData={article}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}
