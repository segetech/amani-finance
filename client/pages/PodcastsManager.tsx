import React, { useState } from "react";
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
      type: "audio",
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
      type: "video",
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
      category: "Économie",
      status: "draft",
      publishDate: "2024-01-10",
      author: "Amadou Sanogo",
      plays: 0,
      downloads: 0,
      likes: 0,
      type: "audio",
      coverImage: "/placeholder.svg",
      audioFile: "episode-003.mp3",
      guests: ["Directeur BCEAO"],
      tags: ["BCEAO", "politique monétaire", "banque centrale"],
    },
  ];

  const categories = [
    "Économie",
    "Tech",
    "Marché",
    "Politique",
    "Investissement",
    "Analyse",
  ];

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

  const handleTogglePlay = (podcastId: string) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
  };

  const handleEditPodcast = (id: string) => {
    navigate(`/dashboard/podcasts/${id}/edit`);
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

  const getTypeIcon = (type: string) => {
    return type === "video" ? Video : Mic;
  };

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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
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

        {/* Liste des podcasts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Podcasts ({filteredPodcasts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredPodcasts.map((podcast) => {
              const TypeIcon = getTypeIcon(podcast.type);
              const isPlaying = playingPodcast === podcast.id;
              
              return (
                <div key={podcast.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Image de couverture */}
                    <div className="relative">
                      <img
                        src={podcast.coverImage}
                        alt={podcast.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => handleTogglePlay(podcast.id)}
                          className="w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Informations du podcast */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {podcast.title}
                            </h3>
                            <TypeIcon className="w-4 h-4 text-purple-600" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(podcast.status)}`}>
                              {getStatusLabel(podcast.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {podcast.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {podcast.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(podcast.publishDate).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Headphones className="w-4 h-4" />
                              {podcast.plays.toLocaleString()} écoutes
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {podcast.downloads.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPodcast(podcast.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePodcast(podcast.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPodcasts.length === 0 && (
              <div className="p-12 text-center">
                <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun podcast trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Aucun podcast ne correspond à vos critères de recherche.
                </p>
                {hasPermission("create_podcasts") && (
                  <button
                    onClick={() => navigate("/dashboard/podcasts/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Créer votre premier podcast
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
