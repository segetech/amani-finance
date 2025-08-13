import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import UnifiedContentForm from "../components/UnifiedContentForm";
import { UnifiedContent } from "../types/database";
import { ArrowLeft, Mic, AlertCircle, Loader } from "lucide-react";

export default function EditPodcast() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();

  const [podcast, setPodcast] = useState<Partial<UnifiedContent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Vérification des permissions
  if (!user || !hasPermission("manage_podcasts")) {
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
              podcasts.
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

  // Charger les données du podcast
  useEffect(() => {
    const loadPodcast = async () => {
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
        const mockPodcast: Partial<UnifiedContent> = {
          id: id,
          type: "podcast",
          title: "Analyse économique hebdomadaire",
          slug: "analyse-economique-hebdomadaire",
          summary:
            "Notre analyse des tendances économiques de la semaine en Afrique de l'Ouest.",
          description:
            "Un podcast hebdomadaire qui décortique les principales actualités économiques de la région.",
          status: "published",
          category: "economie",
          country: "mali",
          tags: ["économie", "analyse", "afrique"],
          meta_title: "Analyse économique hebdomadaire | Amani Finance",
          meta_description:
            "Notre analyse des tendances économiques de la semaine en Afrique de l'Ouest.",
          featured_image: undefined,
          featured_image_alt: "",
          published_at: "2024-01-15",
          podcast_data: {
            audio_url: "https://anchor.fm/amani-finance/episodes/episode-1",
            video_url: "",
            spotify_url: "https://open.spotify.com/episode/123",
            apple_url: "https://podcasts.apple.com/episode/123",
            duration: 1800, // 30 minutes en secondes
            episode_number: 1,
            season: 1,
            transcript: "",
            guests: ["Expert Économique", "Analyste BCEAO"],
            topics: ["Politique monétaire", "Inflation", "Croissance"],
            platforms: [
              {
                name: "Spotify",
                url: "https://open.spotify.com/episode/123",
                icon: "spotify",
              },
              {
                name: "Apple Podcasts",
                url: "https://podcasts.apple.com/episode/123",
                icon: "apple",
              },
              {
                name: "Anchor",
                url: "https://anchor.fm/amani-finance/episodes/episode-1",
                icon: "anchor",
              },
            ],
          },
        };

        setPodcast(mockPodcast);
      } catch (err) {
        console.error("Erreur lors du chargement du podcast:", err);
        error("Erreur", "Impossible de charger les données du podcast.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPodcast();
  }, [id, error]);

  // Gestion de la sauvegarde
  const handleSave = async (formData: any) => {
    try {
      // Simuler l'API call - remplacer par ContentService.updateContent(id, formData)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Données du podcast mises à jour:", formData);

      success(
        "Podcast mis à jour",
        `Le podcast "${formData.title}" a été mis à jour avec succès.`,
      );

      navigate("/dashboard/podcasts");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      error(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour du podcast.",
      );
    }
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    navigate("/dashboard/podcasts");
  };

  // État de chargement
  if (loading) {
    return (
      <DashboardLayout title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">
              Chargement des données du podcast...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Podcast non trouvé
  if (notFound || !podcast) {
    return (
      <DashboardLayout title="Podcast introuvable">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center">
            <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Podcast introuvable
            </h2>
            <p className="text-gray-600 mb-6">
              Le podcast avec l'ID "{id}" n'a pas été trouvé.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/dashboard/podcasts")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour aux podcasts
              </button>
              <button
                onClick={() => navigate("/dashboard/podcasts/new")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Créer un podcast
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Modifier le podcast"
      subtitle={`Modification de "${podcast.title}"`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/podcasts")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux podcasts
          </button>

          {/* Indicateur de statut */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                podcast.status === "published"
                  ? "bg-green-500"
                  : podcast.status === "draft"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 capitalize">
              {podcast.status === "published"
                ? "Publié"
                : podcast.status === "draft"
                  ? "Brouillon"
                  : "Archivé"}
            </span>
          </div>
        </div>

        {/* Informations du podcast existant */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600 text-white rounded-xl">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Modification en cours
              </h3>
              <p className="text-gray-600">
                Podcast créé le{" "}
                {new Date(podcast.created_at || "").toLocaleDateString("fr-FR")}
                {podcast.views && (
                  <span className="ml-4 text-sm">
                    👁️ {podcast.views.toLocaleString()} vues
                  </span>
                )}
              </p>
            </div>
          </div>

          {podcast.podcast_data?.platforms &&
            podcast.podcast_data.platforms.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Disponible sur :</p>
                <div className="flex flex-wrap gap-2">
                  {podcast.podcast_data.platforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <span>{platform.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Formulaire unifié */}
        <UnifiedContentForm
          type="podcast"
          initialData={podcast}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}
