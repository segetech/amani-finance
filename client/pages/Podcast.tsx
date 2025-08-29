import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Headphones,
  Star,
  Download,
} from "lucide-react";
import SocialShare from '../components/SocialShare';
import { usePodcasts } from "../hooks/usePodcasts";

export default function Podcast() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  // Inline playback: no modal
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const { podcasts: data, loading, error } = usePodcasts({ status: 'published', limit: 50 });

  const mapped = (data || []).map((p) => {
    const coverImage = p.podcast_data?.cover_image || p.featured_image || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400";
    const duration = p.podcast_data?.duration || undefined;
    const audioUrl = p.podcast_data?.audio_url || undefined;
    const videoUrl = p.podcast_data?.video_url || undefined;
    const plays = (p.podcast_data?.plays as number | undefined) ?? (p.views as number | undefined) ?? 0;
    const rating = (p.podcast_data?.rating as number | undefined) ?? undefined;
    const host = p.podcast_data?.host || 'Animateur';
    const guests = Array.isArray(p.podcast_data?.guests) ? p.podcast_data?.guests : undefined;
    const categoryName = p.categories?.name || 'Podcast';
    const publishedAt = p.published_at || p.created_at;
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return {
      id: p.id,
      title: p.title,
      description: p.summary || p.description || "",
      host,
      guest: guests && guests.length ? guests.join(', ') : undefined,
      category: categoryName,
      duration,
      publishedAt,
      plays,
      downloads: (p.podcast_data?.downloads as number | undefined) ?? undefined,
      rating,
      coverImage,
      audioUrl,
      videoUrl,
      tags,
    };
  });

  const categories = [
    "all",
    ...Array.from(new Set(mapped.map((m) => m.category))).filter(Boolean),
  ];

  const filteredPodcasts = mapped.filter((podcast) => {
    const srch = searchTerm.toLowerCase();
    const matchesSearch =
      podcast.title.toLowerCase().includes(srch) ||
      (podcast.description || "").toLowerCase().includes(srch) ||
      (podcast.host || "").toLowerCase().includes(srch);
    const matchesCategory = selectedCategory === "all" || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract YouTube video ID and build embed URL
  const getYouTubeEmbed = (url: string): string | null => {
    try {
      const u = new URL(url);
      // Common params to minimize controls/branding
      const params = 'controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3';
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return id ? `https://www.youtube.com/embed/${id}?${params}` : null;
      }
      if (u.hostname.includes('youtube.com')) {
        // watch?v=ID or /embed/ID or /shorts/ID
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}?${params}`;
        const parts = u.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex(p => p === 'embed' || p === 'shorts');
        const id = idx >= 0 && parts[idx + 1] ? parts[idx + 1] : null;
        return id ? `https://www.youtube.com/embed/${id}?${params}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const togglePlay = (podcastId: string) => {
    setCurrentlyPlaying(currentlyPlaying === podcastId ? null : podcastId);
  };

  const featuredPodcast = mapped[0];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amani-primary to-amani-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎧 Podcasts Amani
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Décryptage audio de l'actualité économique sahélienne
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Headphones className="w-6 h-6" />
                <span>50k+ Écoutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                <span>4.8/5 Étoiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Podcast */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            À l'affiche
          </h2>
          
          {loading ? (
            <div className="text-gray-600">Chargement...</div>
          ) : error ? (
            <div className="text-red-600">Erreur: {String(error.message || error)}</div>
          ) : !featuredPodcast ? (
            <div className="text-gray-600">Aucun podcast publié pour le moment.</div>
          ) : (
            <div className="rounded-2xl shadow-xl overflow-hidden border border-amani-primary/10 bg-gradient-to-br from-white to-amani-secondary/5">
              <div className="md:flex">
                <div className="md:w-7/12 lg:w-8/12">
                  {currentlyPlaying === featuredPodcast.id && featuredPodcast.videoUrl ? (
                    <div className="w-full aspect-video bg-black">
                      <iframe
                        className="w-full h-full"
                        src={getYouTubeEmbed(featuredPodcast.videoUrl) || undefined}
                        title={featuredPodcast.title}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video">
                      <img
                        src={featuredPodcast.coverImage}
                        alt={featuredPodcast.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="md:w-5/12 lg:w-4/12 p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amani-secondary/20 text-amani-secondary">
                      À l'affiche
                    </span>
                    <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPodcast.category}
                    </span>
                    {featuredPodcast.duration && (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {featuredPodcast.duration}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight text-amani-primary">
                    {featuredPodcast.title}
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {featuredPodcast.description}
                  </p>

                  {featuredPodcast.tags && featuredPodcast.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPodcast.tags.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/70 border border-gray-200 text-gray-700 rounded-full text-xs">#{t}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Animé par <strong>{featuredPodcast.host}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPodcast.publishedAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => togglePlay(featuredPodcast.id)}
                      className="flex items-center gap-3 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
                    >
                      {currentlyPlaying === featuredPodcast.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-1" />
                      )}
                      {currentlyPlaying === featuredPodcast.id ? "Pause" : (featuredPodcast.videoUrl ? "Regarder" : "Écouter")}
                    </button>
                    
                    <SocialShare
                      title={featuredPodcast.title}
                      description={featuredPodcast.description}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un podcast..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Toutes catégories</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {/* View mode toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className={`px-3 py-2 rounded border ${viewMode === 'list' ? 'bg-amani-primary text-white border-amani-primary' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                Liste
              </button>
              <button
                className={`px-3 py-2 rounded border ${viewMode === 'grid' ? 'bg-amani-primary text-white border-amani-primary' : 'bg-white text-gray-700 border-gray-300'}`}
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
              >
                Grille
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8">
            Tous les épisodes ({filteredPodcasts.length})
          </h2>
          
          {/* List/Grid container */}
          {loading && <div className="text-gray-600">Chargement...</div>}
          {!loading && !error && filteredPodcasts.length === 0 && (
            <div className="text-gray-600">Aucun épisode trouvé.</div>
          )}
          {!loading && !error && viewMode === 'list' && (
            <div className="space-y-6">
              {filteredPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex items-start gap-6">
                    {/* Media */}
                    <div className="flex-shrink-0">
                      {currentlyPlaying === podcast.id && (podcast as any).videoUrl ? (
                        <div className="w-64 h-36 md:w-80 md:h-44 bg-black rounded-lg overflow-hidden">
                          <iframe
                            className="w-full h-full"
                            src={getYouTubeEmbed((podcast as any).videoUrl) || undefined}
                            title={podcast.title}
                            frameBorder={0}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <img
                          src={podcast.coverImage}
                          alt={podcast.title}
                          className="w-64 h-36 md:w-80 md:h-44 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {podcast.category}
                        </span>
                        {podcast.duration && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {podcast.duration}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{podcast.rating ?? '—'}</span>
                        </div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-amani-primary mb-1 leading-tight">
                        {podcast.title}
                      </h3>
                      <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2">
                        {podcast.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {podcast.host}
                        </span>
                        {podcast.guest && (
                          <span>Invité: {podcast.guest}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(podcast.publishedAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {podcast.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            {podcast.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePlay(podcast.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                          >
                            {currentlyPlaying === podcast.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            {currentlyPlaying === podcast.id ? "Pause" : ((podcast as any).videoUrl ? "Regarder" : "Écouter")}
                          </button>
                          <SocialShare title={podcast.title} description={podcast.description} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast) => (
                <div key={podcast.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Media */}
                  <div className="w-full aspect-video bg-black">
                    {currentlyPlaying === podcast.id && (podcast as any).videoUrl ? (
                      <iframe
                        className="w-full h-full"
                        src={getYouTubeEmbed((podcast as any).videoUrl) || undefined}
                        title={podcast.title}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <img src={podcast.coverImage} alt={podcast.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-amani-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">{podcast.category}</span>
                      {podcast.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-600"><Clock className="w-3 h-3" />{podcast.duration}</span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-amani-primary line-clamp-2 mb-1">{podcast.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{podcast.description}</p>
                    <div className="flex items-center justify-between">
                      <span />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlay(podcast.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amani-primary text-white rounded hover:bg-amani-primary/90 text-sm"
                        >
                          {currentlyPlaying === podcast.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {currentlyPlaying === podcast.id ? "Pause" : ((podcast as any).videoUrl ? "Regarder" : "Écouter")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amani-primary/10 to-amani-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amani-primary mb-6">
            Restez connecté à l'actualité économique
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Abonnez-vous pour recevoir nos derniers podcasts et analyses directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
            />
            <button className="px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium">
              S'abonner
            </button>
          </div>
        </div>
      </section>

      {/* Inline audio fallback when no videoUrl */}
      {/* We render audio inside each card only when playing; handled above */}
    </div>
  );
}
