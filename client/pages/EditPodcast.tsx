import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { usePodcasts, Podcast } from "../hooks/usePodcasts";
import { supabase } from "../lib/supabase";
// DashboardLayout removed: page now renders inside persistent DashboardShell
import UnifiedContentForm from "../components/UnifiedContentForm";
import { ArrowLeft, Mic, AlertCircle, Loader } from "lucide-react";

export default function EditPodcast() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const { fetchPodcastBySlug, updatePodcast } = usePodcasts();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Vérification des permissions
  if (!user || !hasPermission("manage_podcasts")) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour modifier des podcasts.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
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
        console.log("🔍 Chargement du podcast avec ID:", id);

        // Récupérer le podcast par ID avec les données de catégorie
        const { data, error: fetchError } = await supabase
          .from('contents')
          .select(`
            *,
            content_categories!inner(id, name, slug, color)
          `)
          .eq('id', id)
          .eq('type', 'podcast')
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Podcast non trouvé');
        }

        // Formater les données pour correspondre au type Podcast
        // Typage explicite du résultat Supabase pour éviter "unknown"
        const row = data as any;
        const podcastData: Podcast = {
          ...(row as Podcast),
          author: {
            id: row.author_id as string,
            first_name: 'Animateur',
            last_name: 'Podcast',
            avatar_url: null
          },
          categories: row.content_categories ? {
            id: row.content_categories.id as string,
            name: row.content_categories.name as string,
            slug: row.content_categories.slug as string,
            color: row.content_categories.color as string
          } : {
            id: row.category_id as string,
            name: 'Catégorie Podcast',
            slug: 'podcast',
            color: '#8B5CF6'
          }
        };

        console.log("✅ Podcast récupéré:", podcastData);
        setPodcast(podcastData);
      } catch (err) {
        console.error("❌ Erreur lors du chargement du podcast:", err);
        error("Erreur", "Impossible de charger les données du podcast.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPodcast();
  }, [id]);

  // Gestion de la sauvegarde
  const handleSave = async (formData: any) => {
    if (!id) {
      error("Erreur", "ID du podcast manquant");
      return;
    }

    try {
      console.log("🚀 Mise à jour du podcast:", formData);
      await updatePodcast(id, formData);
      success("Succès", "Podcast mis à jour avec succès !");
      
      // Recharger les données du podcast après la sauvegarde
      const updatedPodcast = await fetchPodcastBySlug(podcast?.slug || '');
      console.log("🔄 Podcast rechargé après sauvegarde:", updatedPodcast);
      setPodcast(updatedPodcast);
      
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour:", err);
      error("Erreur", "Une erreur est survenue lors de la mise à jour du podcast.");
    }
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    navigate("/dashboard/podcasts");
  };

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données du podcast...</p>
        </div>
      </div>
    );
  }

  // Podcast non trouvé
  if (notFound || !podcast) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center">
          <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Podcast introuvable</h2>
          <p className="text-gray-600 mb-6">Le podcast avec l'ID "{id}" n'a pas été trouvé.</p>
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
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amani-primary">Modifier le podcast</h1>
          <p className="text-gray-600">Modification de "{podcast.title}"</p>
        </div>
      </div>
        
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

          {podcast.podcast_data?.audio_url && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Disponible sur :</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={podcast.podcast_data.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-200 hover:bg-purple-50 transition-colors"
                  >
                    <span>Écouter le podcast</span>
                  </a>
                </div>
              </div>
            )}
        </div>

        {/* Formulaire unifié */}
        <UnifiedContentForm
          type="podcast"
          initialData={{
            ...podcast,
            category: podcast?.categories?.slug || podcast?.category_id, // Utiliser le slug de la catégorie
            published_at: podcast?.published_at ? podcast.published_at.split('T')[0] : undefined, // Format yyyy-MM-dd pour input date
          } as any}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
}
