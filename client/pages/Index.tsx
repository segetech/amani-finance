import { Link } from "react-router-dom";
import React from "react";
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
  RefreshCw,
} from "lucide-react";
import InteractiveMap from "../components/InteractiveMap";
import { fetchBRVMData, BRVMData } from "../services/brvmApi";
import {
  fetchCommoditiesData,
  CommoditiesData,
  getCommodityIcon,
} from "../services/commoditiesApi";
import { useArticles } from "../hooks/useArticles";
import { usePodcasts } from "../hooks/usePodcasts";

export default function Index() {
  // État pour les données BRVM et commodités en temps réel
  const [brvmData, setBrvmData] = React.useState<BRVMData | null>(null);
  const [commoditiesData, setCommoditiesData] =
    React.useState<CommoditiesData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);

  // Données réelles: articles et podcasts publiés depuis Supabase
  const { articles, loading: loadingArticles } = useArticles({ status: 'published', limit: 4, offset: 0 });
  const { podcasts, loading: loadingPodcasts } = usePodcasts({ status: 'published', limit: 2, offset: 0 });

  // Fonction pour charger toutes les données (BRVM + Commodités)
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [brvmResponse, commoditiesResponse] = await Promise.allSettled([
        fetchBRVMData(),
        fetchCommoditiesData(),
      ]);

      if (brvmResponse.status === "fulfilled") {
        setBrvmData(brvmResponse.value);
      } else {
        console.error("Erreur BRVM:", brvmResponse.reason);
      }

      if (commoditiesResponse.status === "fulfilled") {
        setCommoditiesData(commoditiesResponse.value);
      } else {
        console.error("Erreur commodités:", commoditiesResponse.reason);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au démarrage et toutes les 5 minutes
  React.useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Convertir les données BRVM pour l'affichage
  const keyIndices = React.useMemo(() => {
    if (!brvmData) {
      // Données de fallback
      return [
        { name: "BRVM", value: "185.42", change: "+2.3%", isPositive: true },
        {
          name: "FCFA/EUR",
          value: "655.957",
          change: "-0.1%",
          isPositive: false,
        },
        {
          name: "Inflation",
          value: "4.2%",
          change: "+0.5%",
          isPositive: false,
        },
        { name: "Taux BCEAO", value: "3.5%", change: "0%", isPositive: true },
      ];
    }

    return [
      {
        name: "BRVM",
        value: brvmData.composite.value,
        change: brvmData.composite.changePercent,
        isPositive: brvmData.composite.isPositive,
      },
      {
        name: "FCFA/EUR",
        value: brvmData.fcfa_eur.value,
        change: brvmData.fcfa_eur.changePercent,
        isPositive: brvmData.fcfa_eur.isPositive,
      },
      {
        name: "Inflation",
        value: brvmData.inflation.value,
        change: brvmData.inflation.changePercent,
        isPositive: brvmData.inflation.isPositive,
      },
      {
        name: "Taux BCEAO",
        value: brvmData.taux_bceao.value,
        change: brvmData.taux_bceao.changePercent,
        isPositive: brvmData.taux_bceao.isPositive,
      },
    ];
  }, [brvmData]);

  // Dérivés pour l'affichage public
  const heroArticle = React.useMemo(() => articles?.[0], [articles]);
  const otherArticles = React.useMemo(() => (articles || []).slice(1, 4), [articles]);

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section – utilise le dernier article publié s'il existe */}
      <section className="bg-amani-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">À la une</h1>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                {heroArticle ? heroArticle.title : "Le Mali lance son plus grand projet d'infrastructure"}
              </h2>
              <p className="text-lg mb-8 text-gray-200">
                {heroArticle?.summary || "Un investissement de 2 milliards d'euros pour moderniser les réseaux de transport et d'énergie, promettant de transformer l'économie du pays d'ici 2027."}
              </p>
              <div className="flex flex-wrap gap-4 items-center mb-8">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {heroArticle?.category_info?.name || "Économie"}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {heroArticle?.published_at ? new Date(heroArticle.published_at).toLocaleDateString('fr-FR') : '15 janvier 2024'}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  {heroArticle?.author_id ? "Auteur" : "Amadou Diallo"}
                </span>
              </div>
              <Link
                to={heroArticle ? `/article/${heroArticle.id}` : "/article/1"}
                className="inline-flex items-center gap-2 bg-white text-amani-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Lire l'article
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src={heroArticle?.featured_image || "/placeholder.svg"}
                alt={heroArticle?.title || "Infrastructure project"}
                className="w-full h-80 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Indices Widget - BRVM en temps réel */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amani-primary">
                Indices BRVM en temps réel
              </h2>
              {lastUpdate && (
                <p className="text-sm text-gray-500 mt-1">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString("fr-FR")}
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Simulation
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="flex items-center gap-2 text-amani-primary hover:underline disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Actualiser
              </button>
              <Link
                to="/indices"
                className="text-amani-primary hover:underline"
              >
                Voir tous les indices →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {keyIndices.map((index, i) => (
              <div
                key={i}
                className={`bg-[#E5DDD2] p-4 rounded-lg relative transition-all duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                    <RefreshCw className="w-5 h-5 animate-spin text-amani-primary" />
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  {index.name}
                </div>
                <div className="text-2xl font-bold text-amani-primary mb-2">
                  {index.value}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${index.isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {index.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {index.change}
                </div>
                {/* Indicateur temps réel */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500" : "bg-green-500"} animate-pulse`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dernières actualités – affiche les articles publiés en base */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amani-primary mb-4">
              Dernières actualités
            </h2>
            <p className="text-xl text-gray-600">
              Restez informé des derniers développements économiques
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Featured Article - Left (2/3) */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src={heroArticle?.featured_image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop"}
                  alt={heroArticle?.title || "Article principal"}
                  className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                    🔥 À LA UNE
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {heroArticle?.title || 'Le Mali annonce de nouveaux investissements dans les infrastructures'}
                  </h3>
                  <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                    {heroArticle?.summary || "Le gouvernement malien a dévoilé un plan d'investissement de 500 milliards de FCFA pour moderniser les infrastructures du pays et stimuler la croissance économique."}
                  </p>
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">{heroArticle?.published_at ? new Date(heroArticle.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '15 Mars 2025'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{heroArticle?.author_id ? 'Auteur' : 'Rédaction Amani'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">{typeof heroArticle?.views === 'number' ? `${heroArticle.views} vues` : '2.1K vues'}</span>
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
                {(otherArticles.length ? otherArticles : []).map((item, index) => (
                  <Link key={index} to={`/article/${item.id}`} className="group cursor-pointer block">
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-3 h-3 ${item.category_info?.color ? '' : 'bg-blue-500'} rounded-full mt-2`}
                        style={item.category_info?.color ? { backgroundColor: item.category_info.color } : undefined}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs px-2 py-1 text-white rounded-full font-medium`}
                            style={{ backgroundColor: item.category_info?.color || '#1D4ED8' }}
                          >
                            {item.category_info?.name || 'Actualités'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : ''}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Section – données réelles Supabase */}
      <section className="py-16 bg-amani-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary">Podcasts</h2>
            <Link to="/podcast" className="text-amani-primary hover:underline">
              Tous les podcasts →
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {(podcasts || []).map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={(podcast as any).featured_image || "/placeholder.svg"}
                    alt={podcast.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-amani-primary mb-2">
                      {podcast.title}
                    </h3>
                    {podcast.summary && (
                      <p className="text-gray-600 mb-3 text-sm">
                        {podcast.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {(podcast as any)?.podcast_data?.duration && (
                          <span>{(podcast as any).podcast_data.duration}</span>
                        )}
                        <span>{podcast.published_at ? new Date(podcast.published_at).toLocaleDateString('fr-FR') : ''}</span>
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
            {(!podcasts || podcasts.length === 0) && (
              <div className="text-gray-500">Aucun podcast publié pour le moment.</div>
            )}
          </div>
        </div>
      </section>

      {/* Commodities Section */}
      {commoditiesData && (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amani-primary mb-4">
                Matières Premières
              </h2>
              <p className="text-xl text-gray-600">
                Prix en temps réel des commodités importantes pour l'Afrique
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                commoditiesData.gold,
                commoditiesData.cotton,
                commoditiesData.oil_brent,
                commoditiesData.cocoa,
              ].map((commodity, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">
                      {getCommodityIcon(commodity.symbol)}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${commodity.isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      {commodity.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {commodity.changePercent}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {commodity.name}
                  </h3>
                  <div className="text-2xl font-bold text-amani-primary mb-1">
                    ${commodity.price}
                  </div>
                  <div className="text-sm text-gray-500">{commodity.unit}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/indices"
                className="inline-flex items-center gap-2 bg-amani-primary text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-semibold text-lg"
              >
                <Globe className="w-6 h-6" />
                Voir tous les prix
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

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
            <h2 className="text-4xl font-bold text-[#373B3A] mb-6">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services pour comprendre l'économie
              africaine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Analyses de Marché",
                description:
                  "Données en temps réel sur les indices boursiers, taux de change et indicateurs économiques",
                color: "bg-blue-500",
              },
              {
                icon: Lightbulb,
                title: "Insights Stratégiques",
                description:
                  "Analyses approfondies et prospectives par nos experts économistes",
                color: "bg-yellow-500",
              },
              {
                icon: Globe,
                title: "Veille Économique",
                description:
                  "Actualités et tendances des économies africaines mises à jour quotidiennement",
                color: "bg-green-500",
              },
              {
                icon: Video,
                title: "Podcasts Experts",
                description:
                  "Interviews exclusives avec les leaders économiques et analyses sectorielles",
                color: "bg-purple-500",
              },
              {
                icon: Target,
                title: "Opportunités d'Investissement",
                description:
                  "Identification et analyse des meilleures opportunités d'investissement",
                color: "bg-red-500",
              },
              {
                icon: Shield,
                title: "Conseil Stratégique",
                description:
                  "Accompagnement personnalisé pour vos décisions d'investissement",
                color: "bg-indigo-500",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#373B3A] mb-4">
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
      <section className="py-20 bg-gradient-to-br from-[#373B3A] to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Pourquoi Choisir Amani Finance ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre expertise au service de votre compréhension de l'économie
              africaine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Expertise Locale",
                description:
                  "Une équipe d'experts basés en Afrique avec une connaissance approfondie des marchés locaux",
              },
              {
                icon: Zap,
                title: "Données en Temps Réel",
                description:
                  "Accès instantané aux dernières données économiques et financières",
              },
              {
                icon: Heart,
                title: "Information Digestible",
                description:
                  "Notre mission : rendre l'information économique accessible et compréhensible",
              },
              {
                icon: Globe,
                title: "Couverture Complète",
                description:
                  "Analyse de tous les secteurs économiques clés d'Afrique de l'Ouest",
              },
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
                Votre source d'information économique pour l'Afrique de l'Ouest
                et le Mali.
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
                  <a
                    href="mailto:info@amani-finance.com"
                    className="hover:text-white flex items-center gap-2"
                  >
                    📧 info@amani-finance.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+22320224567"
                    className="hover:text-white flex items-center gap-2"
                  >
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
              Créé avec <Heart className="w-4 h-4 text-red-500 fill-current" />{" "}
              par
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
