import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import UnifiedContentForm from "../components/UnifiedContentForm";
import { UnifiedContent } from "../types/database";
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

  const [article, setArticle] = useState<Partial<UnifiedContent> | null>(null);
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

        // Simuler le chargement des données - à remplacer par un appel API Supabase
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Données de demo - remplacer par ContentService.getContentBySlug(id)
        const mockArticle: Partial<UnifiedContent> = {
          id: id,
          type: "article",
          title:
            "L'impact de la politique monétaire de la BCEAO sur l'économie malienne",
          slug: "impact-politique-monetaire-bceao-economie-mali",
          summary:
            "Analyse approfondie des récentes décisions de la Banque Centrale des États de l'Afrique de l'Ouest et leur influence sur l'économie du Mali en 2024.",
          content: `<p>La Banque Centrale des États de l'Afrique de l'Ouest (BCEAO) a récemment annoncé plusieurs mesures importantes qui auront un impact significatif sur l'économie malienne.</p>

<h2>Les nouvelles mesures annoncées</h2>

<p>Parmi les principales décisions prises par la BCEAO, nous retrouvons :</p>

<ul>
<li>Maintien du taux directeur à 2,5%</li>
<li>Renforcement des réserves obligatoires</li>
<li>Nouvelles directives sur les crédits immobiliers</li>
</ul>

<h2>Impact sur l'économie malienne</h2>

<p>Ces mesures auront plusieurs conséquences directes sur l'économie du Mali, notamment sur les secteurs bancaire, immobilier et agricole.</p>

<p>Le maintien du taux directeur à un niveau relativement bas devrait favoriser l'investissement et la consommation, tout en maintenant une inflation maîtrisée.</p>`,
          status: "published",
          category: "economie",
          country: "mali",
          tags: [
            "BCEAO",
            "politique monétaire",
            "économie",
            "Mali",
            "taux directeur",
          ],
          meta_title:
            "Impact de la politique monétaire BCEAO sur l'économie malienne | Amani Finance",
          meta_description:
            "Analyse approfondie des récentes décisions de la BCEAO et leur influence sur l'économie du Mali en 2024.",
          featured_image: "/images/bceao-mali-economie.jpg",
          featured_image_alt: "Siège de la BCEAO et drapeau du Mali",
          published_at: "2024-01-20",
          views: 1247,
          likes: 89,
          shares: 23,
          read_time: 8,
          article_data: {
            excerpt:
              "Les récentes décisions de la BCEAO concernant la politique monétaire auront un impact majeur sur l'économie malienne. Découvrez notre analyse complète.",
            content_type: "full",
            reading_time: 8,
            is_featured: true,
            related_articles: [],
            sources: ["BCEAO", "Ministère de l'Économie du Mali", "FMI"],
            author_note:
              "Article rédigé en collaboration avec des experts de la BCEAO et du secteur bancaire malien.",
          },
        };

        setArticle(mockArticle);
      } catch (err) {
        console.error("Erreur lors du chargement de l'article:", err);
        error("Erreur", "Impossible de charger les données de l'article.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, error]);

  // Gestion de la sauvegarde
  const handleSave = async (formData: any) => {
    try {
      // Simuler l'API call - remplacer par ContentService.updateContent(id, formData)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Données de l'article mises à jour:", formData);

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
