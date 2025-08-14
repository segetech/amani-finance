import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  Mic,
  Play,
  Pause,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  Calendar,
  Users,
  Heart,
  Share2,
  MoreVertical,
  Upload,
  Settings,
  BarChart3,
  Headphones,
  Volume2,
  Tag,
  Video,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function PodcastsManager() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPodcasts, setSelectedPodcasts] = useState<string[]>([]);
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);

  // Check permissions
  if (
    !user ||
    (!hasPermission("create_podcasts") && !hasPermission("view_analytics"))
  ) {
    return (
      <DashboardLayout title="Accès refusé">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour gérer les podcasts.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Mock data - in real app would come from API
  const podcasts = [
    {
      id: "1",
      title: "L'avenir de l'économie sahélienne",
      description:
        "Discussion avec des experts sur les perspectives économiques de la région du Sahel",
      duration: "45:32",
      category: "Économie",
      status: "published",
      publishDate: "2024-01-15",
      author: "Fatou Diallo",
      plays: 2840,
      downloads: 1230,
      likes: 156,
      coverImage: "/placeholder.svg",
      audioFile: "episode-001.mp3",
      guests: ["Dr. Amadou Touré", "Prof. Aïcha Koné"],
      tags: ["économie", "sahel", "développement"],
    },
    {
      id: "2",
      title: "Investir dans les startups africaines",
      description:
        "Analyse des opportunités d'investissement dans la tech africaine avec des entrepreneurs locaux",
      duration: "38:15",
      category: "Tech",
      status: "published",
      publishDate: "2024-01-12",
      author: "Ibrahim Touré",
      plays: 1950,
      downloads: 890,
      likes: 89,
      coverImage: "/placeholder.svg",
      audioFile: "episode-002.mp3",
      guests: ["Salif Keita", "Mariam Ba"],
      tags: ["tech", "startup", "investissement"],
    },
    {
      id: "3",
      title: "BCEAO : Nouvelles politiques monétaires",
      description:
        "Entretien exclusif avec un responsable de la BCEAO sur les dernières décisions",
      duration: "52:18",
      category: "Finance",
      status: "draft",
      publishDate: "2024-01-18",
      author: "Amadou Sanogo",
      plays: 0,
      downloads: 0,
      likes: 0,
      coverImage: "/placeholder.svg",
      audioFile: "",
      guests: ["Dr. Moussa Traoré"],
      tags: ["bceao", "monétaire", "politique"],
    },
    {
      id: "4",
      title: "Agriculture durable au Mali",
      description:
        "Innovations et défis de l'agriculture moderne dans la région",
      duration: "41:47",
      category: "Agriculture",
      status: "scheduled",
      publishDate: "2024-01-20",
      author: "Aïcha Koné",
      plays: 0,
      downloads: 0,
      likes: 0,
      coverImage: "/placeholder.svg",
      audioFile: "episode-004.mp3",
      guests: ["Bakary Sidibé", "Fatoumata Coulibaly"],
      tags: ["agriculture", "durabilité", "innovation"],
    },
  ];

  const stats = {
    total: podcasts.length,
    published: podcasts.filter((p) => p.status === "published").length,
    draft: podcasts.filter((p) => p.status === "draft").length,
    totalPlays: podcasts.reduce((sum, p) => sum + p.plays, 0),
    totalDownloads: podcasts.reduce((sum, p) => sum + p.downloads, 0),
    averageDuration: "44:18",
  };

  const categories = [
    "Économie",
    "Tech",
    "Finance",
    "Agriculture",
    "Politique",
    "Culture",
    "Interview",
    "Analyse",
  ];

  const handleTogglePlay = (podcastId: string) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
  };

  const handlePodcastSelect = (podcastId: string) => {
    setSelectedPodcasts((prev) =>
      prev.includes(podcastId)
        ? prev.filter((id) => id !== podcastId)
        : [...prev, podcastId],
    );
  };

  const handleSelectAll = () => {
    setSelectedPodcasts(
      selectedPodcasts.length === filteredPodcasts.length
        ? []
        : filteredPodcasts.map((p) => p.id),
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPodcasts.length === 0) {
      error("Erreur", "Aucun podcast sélectionné");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (action) {
      case "publish":
        success(
          "Podcasts publiés",
          `${selectedPodcasts.length} podcast(s) publié(s)`,
        );
        break;
      case "unpublish":
        warning(
          "Podcasts dépubliés",
          `${selectedPodcasts.length} podcast(s) dépublié(s)`,
        );
        break;
      case "delete":
        error(
          "Podcasts supprimés",
          `${selectedPodcasts.length} podcast(s) supprimé(s)`,
        );
        break;
    }
    setSelectedPodcasts([]);
  };

  const handleDeletePodcast = async (podcastId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce podcast ?")) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      error("Podcast supprimé", "Le podcast a été supprimé avec succès");
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || podcast.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || podcast.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "scheduled":
        return "Programmé";
      default:
        return status;
    }
  };

  const stats = [
    {
      label: "Podcasts publiés",
      value: podcasts.filter((p) => p.status === "published").length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Brouillons",
      value: podcasts.filter((p) => p.status === "draft").length.toString(),
      icon: Edit,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total écoutes",
      value: podcasts.reduce((sum, p) => sum + p.plays, 0).toLocaleString(),
      icon: Headphones,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Téléchargements",
      value: podcasts.reduce((sum, p) => sum + p.downloads, 0).toLocaleString(),
      icon: Download,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <DashboardLayout
      title="Gestion des podcasts"
      subtitle="Créez, modifiez et gérez vos podcasts audio et vidéo"
      actions={
        <div className="flex items-center gap-4">
          {/* Bouton de création principale */}
          {hasPermission("create_podcasts") && (
            <button
              onClick={() => navigate("/dashboard/podcasts/new")}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouveau podcast
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">🎙️ Publiés</option>
                <option value="draft">✏️ Brouillons</option>
                <option value="scheduled">⏰ Programmés</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mic className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total podcasts</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.totalPlays.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Lectures totales</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Téléchargements</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.averageDuration}
            </div>
            <div className="text-sm text-gray-600">Durée moyenne</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un podcast..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Programmé</option>
                </select>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPodcasts.length > 0 && (
          <div className="bg-amani-primary text-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedPodcasts.length} podcast(s) sélectionné(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPermission("publish_podcasts") && (
                  <button
                    onClick={() => handleBulkAction("publish")}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Publier
                  </button>
                )}
                <button
                  onClick={() => handleBulkAction("unpublish")}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Dépublier
                </button>
                {hasPermission("delete_podcasts") && (
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Podcasts List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amani-primary">
                Podcasts ({filteredPodcasts.length})
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      selectedPodcasts.length === filteredPodcasts.length &&
                      filteredPodcasts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                  />
                  Tout sélectionner
                </label>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedPodcasts.includes(podcast.id)}
                    onChange={() => handlePodcastSelect(podcast.id)}
                    className="mt-2 h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                  />

                  <img
                    src={podcast.coverImage}
                    alt={podcast.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-amani-primary mb-1">
                          {podcast.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {podcast.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(podcast.status)}`}
                        >
                          {getStatusLabel(podcast.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {podcast.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {podcast.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {podcast.author}
                      </span>
                      <span className="bg-amani-secondary/20 text-amani-primary px-2 py-1 rounded-full text-xs">
                        {podcast.category}
                      </span>
                    </div>

                    {podcast.status === "published" && (
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          {podcast.plays.toLocaleString()} lectures
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {podcast.downloads.toLocaleString()} téléchargements
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {podcast.likes} likes
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Invités:</span>
                        <div className="flex flex-wrap gap-1">
                          {podcast.guests.map((guest, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {guest}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {podcast.audioFile && (
                          <button
                            onClick={() => handleTogglePlay(podcast.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              playingPodcast === podcast.id
                                ? "bg-amani-primary text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {playingPodcast === podcast.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {hasPermission("view_analytics") && (
                          <Link
                            to={`/dashboard/podcasts/${podcast.id}/analytics`}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Voir les analytics de ce podcast"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        )}

                        {hasPermission("edit_podcasts") && (
                          <Link
                            to={`/dashboard/podcasts/${podcast.id}/edit`}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}

                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>

                        {hasPermission("delete_podcasts") && (
                          <button
                            onClick={() => handleDeletePodcast(podcast.id)}
                            className="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredPodcasts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <Headphones className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun podcast trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                ? "Essayez de modifier vos filtres de recherche."
                : "Commencez par créer votre premier podcast."}
            </p>
            {hasPermission("create_podcasts") && (
              <Link
                to="/dashboard/podcasts/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer un podcast
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
