import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Play,
  ArrowRight,
  Calendar,
  User,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Award,
  BarChart3,
  Globe,
  Briefcase,
  Users,
  Target,
  Clock,
  Eye,
  Bell,
  Download,
  BookOpen,
  Mic,
  Video,
  PieChart,
} from "lucide-react";

export default function Index() {
  // Mock data for demonstration
  const keyIndices = [
    { name: "BRVM", value: "185.42", change: "+2.3%", isPositive: true },
    { name: "FCFA/EUR", value: "655.957", change: "-0.1%", isPositive: false },
    { name: "Inflation", value: "4.2%", change: "+0.5%", isPositive: false },
    { name: "Taux BCEAO", value: "3.5%", change: "0%", isPositive: true },
  ];

  const latestNews = [
    {
      id: 1,
      title:
        "Le Mali annonce de nouveaux investissements dans les infrastructures",
      excerpt:
        "Le gouvernement malien a dévoilé un plan d'investissement de 500 milliards de FCFA...",
      category: "Économie",
      date: "2024-01-15",
      author: "Amadou Diallo",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "BRVM : hausse de 2.3% portée par les valeurs bancaires",
      excerpt:
        "La Bourse Régionale des Valeurs Mobilières a clôturé en hausse grâce aux performances...",
      category: "Marché",
      date: "2024-01-15",
      author: "Fatou Kone",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Burkina Faso : nouveau gisement d'or découvert",
      excerpt:
        "Une société minière canadienne annonce la découverte d'un important gisement...",
      category: "Industrie",
      date: "2024-01-14",
      author: "Ibrahim Traore",
      image: "/placeholder.svg",
    },
  ];

  const podcasts = [
    {
      id: 1,
      title: "L'avenir de l'économie sahélienne",
      duration: "45 min",
      date: "2024-01-12",
      description:
        "Discussion avec des experts sur les perspectives économiques de la région",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Investir dans les startups africaines",
      duration: "38 min",
      date: "2024-01-08",
      description:
        "Analyse des opportunités d'investissement dans la tech africaine",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-amani-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">À la une</h1>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                Le Mali lance son plus grand projet d'infrastructure
              </h2>
              <p className="text-lg mb-8 text-gray-200">
                Un investissement de 2 milliards d'euros pour moderniser les
                réseaux de transport et d'énergie, promettant de transformer
                l'économie du pays d'ici 2027.
              </p>
              <div className="flex flex-wrap gap-4 items-center mb-8">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Économie
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  15 janvier 2024
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Amadou Diallo
                </span>
              </div>
              <Link
                to="/article/1"
                className="inline-flex items-center gap-2 bg-white text-amani-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Lire l'article
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Infrastructure project"
                className="w-full h-80 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Indices Widget */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amani-primary">
              Indices clés
            </h2>
            <Link to="/indices" className="text-amani-primary hover:underline">
              Voir tous les indices →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {keyIndices.map((index, i) => (
              <div key={i} className="bg-[#E5DDD2] p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{index.name}</div>
                <div className="text-2xl font-bold text-amani-primary mb-2">
                  {index.value}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${index.isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {index.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {index.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary">
              Dernières actualités
            </h2>
            <Link
              to="/actualites"
              className="text-amani-primary hover:underline"
            >
              Toutes les actualités →
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="bg-amani-secondary text-amani-primary px-3 py-1 rounded-full text-xs font-medium">
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-amani-primary mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Par {news.author}
                    </span>
                    <Link
                      to={`/article/${news.id}`}
                      className="text-amani-primary font-medium hover:underline"
                    >
                      Lire plus →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-16 bg-amani-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary">Podcasts</h2>
            <Link to="/podcast" className="text-amani-primary hover:underline">
              Tous les podcasts →
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-amani-primary mb-2">
                      {podcast.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {podcast.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{podcast.duration}</span>
                        <span>{podcast.date}</span>
                      </div>
                      <button className="flex items-center gap-2 bg-amani-primary text-white px-4 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors">
                        <Play className="w-4 h-4" />
                        Écouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8 text-center">
            Carte interactive du Sahel & Tchad
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-amani-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amani-primary mb-2">
                  Carte interactive
                </h3>
                <p className="text-gray-600 max-w-md">
                  Explorez les données économiques par pays : Mali, Burkina
                  Faso, Niger, Mauritanie, Tchad et plus. Cliquez sur un pays
                  pour voir les dernières actualités et indicateurs économiques.
                </p>
                <button className="mt-4 bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors">
                  Explorer la carte
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
