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
  Lightbulb,
  Shield,
  Zap,
  Heart,
  CheckCircle,
} from "lucide-react";
import InteractiveMap from '../components/InteractiveMap';

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
      title: "La BCEAO maintient son taux directeur à 3.5%",
      excerpt:
        "La Banque centrale des États de l'Afrique de l'Ouest a décidé de maintenir...",
      category: "Finance",
      date: "2024-01-14",
      author: "Fatou Kone",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Croissance du secteur agricole au Burkina Faso",
      excerpt:
        "Le secteur agricole burkinabé enregistre une croissance de 8% cette année...",
      category: "Agriculture",
      date: "2024-01-13",
      author: "Ibrahim Ouédraogo",
      image: "/placeholder.svg",
    },
  ];

  const podcasts = [
    {
      id: 1,
      title: "L'avenir de l'économie numérique en Afrique",
      description:
        "Discussion avec des experts sur les défis et opportunités du numérique",
      duration: "45 min",
      category: "Tech",
      date: "2024-01-10",
    },
    {
      id: 2,
      title: "Investir dans l'agriculture sahélienne",
      description:
        "Analyse des opportunités d'investissement dans le secteur agricole",
      duration: "38 min",
      category: "Agriculture",
      date: "2024-01-08",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amani-primary via-gray-800 to-gray-900 text-white py-32 overflow-hidden">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"m0 40l40-40h-40v40zm40 0v-40h-40l40 40z\"/%3E%3C/g%3E%3C/svg%3E')] opacity-10"}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Amani Finance
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-8 text-gray-300">
              Économie & Finance Africaine
            </p>
            <p className="text-xl max-w-4xl mx-auto mb-12 leading-relaxed text-gray-200">
              Votre plateforme de référence pour l'information économique et
              financière en Afrique. Nous rendons l'information digestible et
              accessible à tous les acteurs économiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/marche"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amani-primary rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <BarChart3 className="w-6 h-6" />
                Explorer les marchés
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-amani-primary transition-all duration-300 font-semibold text-lg"
              >
                <Target className="w-6 h-6" />
                Voir les analyses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Indices */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-amani-primary mb-12">
            Indices clés en temps réel
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {keyIndices.map((index, i) => (
              <div key={i} className="bg-[#E5DDD2] p-4 rounded-lg">
                <h3 className="font-bold text-lg text-amani-primary">
                  {index.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {index.value}
                  </span>
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      index.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {index.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {index.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News - Featured + List Design */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amani-primary mb-4">
              Dernières actualités
            </h2>
            <p className="text-xl text-gray-600">Restez informé des derniers développements économiques</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Featured Article - Left (2/3) */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop"
                  alt="Article principal"
                  className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                    🔥 À LA UNE
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    Le Mali annonce de nouveaux investissements dans les infrastructures
                  </h3>
                  <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                    Le gouvernement malien a dévoilé un plan d'investissement de 500 milliards de FCFA pour moderniser les infrastructures du pays et stimuler la croissance économique.
                  </p>
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">15 Mars 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Dr. Mohamed Keita</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">2.1K vues</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News List - Right (1/3) */}
            <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                  Dernières actualités
                </h4>
                <Link
                  to="/actualites"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Voir tout →
                </Link>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    title: "La BCEAO maintient son taux directeur à 3.5%",
                    category: "Finance",
                    time: "Il y a 2 heures",
                    color: "bg-blue-500"
                  },
                  {
                    title: "Croissance du secteur agricole au Burkina Faso",
                    category: "Agriculture",
                    time: "Il y a 4 heures",
                    color: "bg-green-500"
                  },
                  {
                    title: "Nouveau partenariat commercial Mali-Sénégal",
                    category: "Commerce",
                    time: "Il y a 6 heures",
                    color: "bg-purple-500"
                  },
                  {
                    title: "Innovation technologique dans la fintech africaine",
                    category: "Tech",
                    time: "Il y a 8 heures",
                    color: "bg-orange-500"
                  },
                  {
                    title: "Inflation modérée dans la zone UEMOA",
                    category: "Économie",
                    time: "Il y a 12 heures",
                    color: "bg-red-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-3 h-3 ${item.color} rounded-full mt-2`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 ${item.color} text-white rounded-full font-medium`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                        <h5 className="font-medium text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections by Category - Creative Design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amani-primary mb-6">
              Nos Rubriques
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez l'actualité économique organisée par secteur d'activité
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Marché Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <Link to="/marche" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Actualités Marché</h3>
              <p className="text-gray-700 mb-6">Suivez en temps réel les cours, indices et mouvements des marchés financiers.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">BRVM</span>
                  <span className="text-green-600 font-bold">+2.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">FCFA/EUR</span>
                  <span className="text-red-600 font-bold">-0.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Taux BCEAO</span>
                  <span className="text-gray-600 font-bold">3.5%</span>
                </div>
              </div>
            </div>

            {/* Économie Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <Link to="/economie" className="text-green-600 hover:text-green-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Économie</h3>
              <p className="text-gray-700 mb-6">Analyses macroéconomiques, politiques monétaires et indicateurs par pays.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+5.8%</div>
                  <div className="text-sm text-gray-600">Croissance PIB</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.2%</div>
                  <div className="text-sm text-gray-600">Inflation</div>
                </div>
              </div>
            </div>

            {/* Industrie Section */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <Link to="/industrie" className="text-purple-600 hover:text-purple-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrie</h3>
              <p className="text-gray-700 mb-6">Tendances industrielles, innovations et opportunités sectorielles.</p>
              <div className="flex items-center gap-4">
                <div className="bg-purple-200 px-3 py-1 rounded-full text-purple-800 text-sm font-medium">Automobile</div>
                <div className="bg-purple-200 px-3 py-1 rounded-full text-purple-800 text-sm font-medium">Énergie</div>
                <div className="bg-purple-200 px-3 py-1 rounded-full text-purple-800 text-sm font-medium">Mining</div>
              </div>
            </div>

            {/* Investissement Section */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <Link to="/investissement" className="text-orange-600 hover:text-orange-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Investissements</h3>
              <p className="text-gray-700 mb-6">Opportunités d'investissement et analyses de projets.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm">€125M investis ce trimestre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm">384 projets financés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm">Rendement moyen: 12.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Insights Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <Link to="/insights" className="text-yellow-600 hover:text-yellow-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Insights</h3>
              <p className="text-gray-700 mb-4">Analyses approfondies par nos experts.</p>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">Dr. Mohamed Keita</div>
                <div className="text-sm text-gray-600">Expert Économiste</div>
              </div>
            </div>

            {/* Tech Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <Link to="/tech" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tech</h3>
              <p className="text-gray-700 mb-4">Innovation et écosystème technologique.</p>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">🚀 2,450 startups</div>
                <div className="text-sm text-gray-600">💰 $3.2B investis</div>
                <div className="text-sm text-gray-600">👨‍💻 180K développeurs</div>
              </div>
            </div>

            {/* Podcast Section */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <Link to="/podcast" className="text-pink-600 hover:text-pink-800 font-medium">
                  Voir plus →
                </Link>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Podcasts</h3>
              <p className="text-gray-700 mb-4">Interviews et analyses audio.</p>
              <div className="flex items-center gap-2">
                <Play className="w-6 h-6 text-pink-600" />
                <span className="text-sm font-medium">Épisode récent disponible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-16 bg-amani-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary">Podcasts</h2>
            <Link
              to="/podcast"
              className="text-amani-primary hover:underline"
            >
              Tous les podcasts →
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amani-primary rounded-lg flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-[#E5DDD5] text-amani-primary px-3 py-1 rounded-full text-xs font-medium">
                      {podcast.category}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{podcast.date}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-amani-primary mb-3">
                  {podcast.title}
                </h3>
                <p className="text-gray-600 mb-4">{podcast.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {podcast.duration}
                  </span>
                  <button className="bg-amani-primary text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Écouter
                  </button>
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
          <InteractiveMap />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amani-primary mb-6">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services pour comprendre l'économie africaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Analyses de Marché",
                description: "Données en temps réel sur les indices boursiers, taux de change et indicateurs économiques",
                color: "bg-blue-500"
              },
              {
                icon: Lightbulb,
                title: "Insights Stratégiques",
                description: "Analyses approfondies et prospectives par nos experts économistes",
                color: "bg-yellow-500"
              },
              {
                icon: Globe,
                title: "Veille Économique",
                description: "Actualités et tendances des économies africaines mises à jour quotidiennement",
                color: "bg-green-500"
              },
              {
                icon: Video,
                title: "Podcasts Experts",
                description: "Interviews exclusives avec les leaders économiques et analyses sectorielles",
                color: "bg-purple-500"
              },
              {
                icon: Target,
                title: "Opportunités d'Investissement",
                description: "Identification et analyse des meilleures opportunités d'investissement",
                color: "bg-red-500"
              },
              {
                icon: Shield,
                title: "Conseil Stratégique",
                description: "Accompagnement personnalisé pour vos décisions d'investissement",
                color: "bg-indigo-500"
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-amani-primary mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Amani Section */}
      <section className="py-20 bg-gradient-to-br from-amani-primary to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Pourquoi Choisir Amani Finance ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre expertise au service de votre compréhension de l'économie africaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Expertise Locale",
                description: "Une équipe d'experts basés en Afrique avec une connaissance approfondie des marchés locaux"
              },
              {
                icon: Zap,
                title: "Données en Temps Réel",
                description: "Accès instantané aux dernières données économiques et financières"
              },
              {
                icon: Heart,
                title: "Information Digestible",
                description: "Notre mission : rendre l'information économique accessible et compréhensible"
              },
              {
                icon: Globe,
                title: "Couverture Complète",
                description: "Analyse de tous les secteurs économiques clés d'Afrique de l'Ouest"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors duration-300">
                  <feature.icon className="w-10 h-10 text-[#E5DDD5]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amani-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa7441c9084eb43e6855cf7e960c5c609%2F6ebebc1a91e8447db48a68aa5b391a28?format=webp&width=800"
                alt="Amani"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-300 mb-4">
                Votre source d'information économique pour l'Afrique de l'Ouest et le Mali.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/marche" className="hover:text-white">
                    Marché
                  </Link>
                </li>
                <li>
                  <Link to="/economie" className="hover:text-white">
                    Économie
                  </Link>
                </li>
                <li>
                  <Link to="/industrie" className="hover:text-white">
                    Industrie
                  </Link>
                </li>
                <li>
                  <Link to="/investissement" className="hover:text-white">
                    Investissement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contenu</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/insights" className="hover:text-white">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link to="/tech" className="hover:text-white">
                    Tech
                  </Link>
                </li>
                <li>
                  <Link to="/podcast" className="hover:text-white">
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link to="/indices" className="hover:text-white">
                    Indices
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Faladie, Bamako, Mali</span>
                </li>
                <li>
                  <a href="mailto:info@amani-finance.com" className="hover:text-white flex items-center gap-2">
                    📧 info@amani-finance.com
                  </a>
                </li>
                <li>
                  <a href="tel:+22320224567" className="hover:text-white flex items-center gap-2">
                    📞 +223 20 22 45 67
                  </a>
                </li>
                <li>
                  <Link to="/newsletter" className="hover:text-white">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    À propos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-300">
            <p>&copy; 2025 Amani Finance. Tous droits réservés.</p>
            <p className="flex items-center gap-1 mt-2 md:mt-0">
              Créé avec <Heart className="w-4 h-4 text-red-500 fill-current" /> par 
              <a 
                href="https://www.aikio.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 font-medium ml-1 transition-colors"
              >
                Aikio Corp SAS
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
