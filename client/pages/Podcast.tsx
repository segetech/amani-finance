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
  Eye,
  Download,
} from "lucide-react";
import SocialShare from '../components/SocialShare';

export default function Podcast() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const podcasts = [
    {
      id: "1",
      title: "Évolution du FCFA : Enjeux et Perspectives 2024",
      description: "Une analyse approfondie des fluctuations du FCFA et leur impact sur les économies sahéliennes",
      host: "Fatou Diallo",
      guest: "Dr. Amadou Traoré, Économiste BCEAO",
      category: "Économie",
      duration: "32:45",
      publishedAt: "2024-01-15",
      plays: 12500,
      downloads: 3200,
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
      audioUrl: "#",
      tags: ["FCFA", "Monnaie", "BCEAO", "Économie"],
    },
    {
      id: "2",
      title: "Tech Startup au Sahel : Révolution ou Illusion ?",
      description: "Décryptage de l'écosystème technologique émergent dans la région sahélienne",
      host: "Ibrahim Diarra",
      guest: "Sarah Konate, CEO TechMali",
      category: "Tech",
      duration: "28:15",
      publishedAt: "2024-01-12",
      plays: 8700,
      downloads: 2100,
      rating: 4.6,
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
      audioUrl: "#",
      tags: ["Startup", "Innovation", "Digital"],
    },
    {
      id: "3",
      title: "Investissement Minier : Opportunités au Burkina Faso",
      description: "Les nouvelles perspectives d'investissement dans le secteur aurifère burkinabé",
      host: "Adjoa Kone",
      guest: "Mohamed Ouédraogo, Ministre des Mines",
      category: "Industrie",
      duration: "41:20",
      publishedAt: "2024-01-10",
      plays: 15300,
      downloads: 4800,
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=400",
      audioUrl: "#",
      tags: ["Or", "Mines", "Investissement"],
    },
    {
      id: "4",
      title: "Commerce Transfrontalier : Défis et Solutions",
      description: "Comment faciliter les échanges commerciaux entre les pays de l'UEMOA",
      host: "Mariama Sy",
      guest: "Dr. Ousmane Ba, Expert UEMOA",
      category: "Marché",
      duration: "35:50",
      publishedAt: "2024-01-08",
      plays: 9800,
      downloads: 2900,
      rating: 4.7,
      coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
      audioUrl: "#",
      tags: ["Commerce", "UEMOA", "Échanges"],
    }
  ];

  const categories = ["all", "Économie", "Tech", "Industrie", "Marché"];

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.host.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePlay = (podcastId: string) => {
    setCurrentlyPlaying(currentlyPlaying === podcastId ? null : podcastId);
  };

  const featuredPodcast = podcasts[0];

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
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={featuredPodcast.coverImage}
                  alt={featuredPodcast.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPodcast.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {featuredPodcast.duration}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    {featuredPodcast.plays.toLocaleString()} écoutes
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-amani-primary mb-4">
                  {featuredPodcast.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPodcast.description}
                </p>
                
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
                    {currentlyPlaying === featuredPodcast.id ? "Pause" : "Écouter"}
                  </button>
                  
                  <SocialShare
                    title={featuredPodcast.title}
                    description={featuredPodcast.description}
                  />
                </div>
              </div>
            </div>
          </div>
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
          </div>
        </div>
      </section>

      {/* Podcast List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8">
            Tous les épisodes ({filteredPodcasts.length})
          </h2>
          
          <div className="space-y-6">
            {filteredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start gap-6">
                  {/* Cover Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {podcast.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {podcast.duration}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{podcast.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-amani-primary mb-2 leading-tight">
                      {podcast.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
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
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {podcast.plays.toLocaleString()}
                        </span>
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
                          {currentlyPlaying === podcast.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                          {currentlyPlaying === podcast.id ? "Pause" : "Écouter"}
                        </button>
                        
                        <SocialShare
                          title={podcast.title}
                          description={podcast.description}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
