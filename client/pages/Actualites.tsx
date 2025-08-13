import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  Eye,
  Clock,
  ArrowRight,
  Filter,
  Search,
  TrendingUp,
  Globe,
  Briefcase,
  DollarSign,
  BarChart3,
  Mic,
} from "lucide-react";

export default function Actualites() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  // Mock data des actualités
  const actualites = [
    {
      id: 1,
      title:
        "Le Mali annonce de nouveaux investissements dans les infrastructures",
      excerpt:
        "Le gouvernement malien a dévoilé un plan d'investissement de 500 milliards de FCFA pour moderniser les infrastructures du pays et stimuler la croissance économique. Ce programme ambitieux vise à améliorer les réseaux de transport, d'énergie et de télécommunications.",
      category: "Économie",
      date: "2024-01-15",
      author: "Dr. Mohamed Keita",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop",
      views: 2150,
      readTime: "5 min",
      featured: true,
    },
    {
      id: 2,
      title: "La BCEAO maintient son taux directeur à 3.5%",
      excerpt:
        "La Banque centrale des États de l'Afrique de l'Ouest a décidé de maintenir son taux directeur inchangé lors de sa dernière réunion, citant la stabilité de l'inflation dans la zone UEMOA.",
      category: "Finance",
      date: "2024-01-14",
      author: "Kani Sissoko",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop",
      views: 1890,
      readTime: "3 min",
      featured: false,
    },
    {
      id: 3,
      title: "Croissance du secteur agricole au Burkina Faso",
      excerpt:
        "Le secteur agricole burkinabé enregistre une croissance de 8% cette année, porté par une augmentation de la production de coton et de céréales. Cette performance dépasse les prévisions initiales.",
      category: "Agriculture",
      date: "2024-01-13",
      author: "Dr. Mohamed Keita",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop",
      views: 1567,
      readTime: "4 min",
      featured: false,
    },
    {
      id: 4,
      title: "BRVM : Performance record avec +28,89% en 2024",
      excerpt:
        "La Bourse Régionale des Valeurs Mobilières conclut l'année 2024 sur une hausse remarquable, marquant l'une de ses meilleures performances de la décennie avec des volumes d'échanges en forte progression.",
      category: "Marché",
      date: "2024-01-12",
      author: "Kani Sissoko",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=500&fit=crop",
      views: 2890,
      readTime: "6 min",
      featured: true,
    },
    {
      id: 5,
      title: "Nouveau partenariat commercial Mali-Sénégal",
      excerpt:
        "Les gouvernements malien et sénégalais signent un accord de partenariat commercial visant à faciliter les échanges bilatéraux et à réduire les barrières douanières entre les deux pays.",
      category: "Commerce",
      date: "2024-01-11",
      author: "Dr. Mohamed Keita",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop",
      views: 1234,
      readTime: "4 min",
      featured: false,
    },
    {
      id: 6,
      title: "Innovation technologique dans la fintech africaine",
      excerpt:
        "Les startups fintech africaines lèvent plus de 3 milliards de dollars en 2024, témoignant de l'innovation croissante dans le secteur des services financiers numériques sur le continent.",
      category: "Tech",
      date: "2024-01-10",
      author: "Kani Sissoko",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      views: 1876,
      readTime: "5 min",
      featured: false,
    },
    {
      id: 7,
      title: "Prix du cacao : Impact sur l'économie ivoirienne",
      excerpt:
        "La hausse du prix du cacao sur les marchés internationaux profite aux producteurs ivoiriens, le pays étant le premier producteur mondial avec 40% de la production globale.",
      category: "Agriculture",
      date: "2024-01-09",
      author: "Dr. Mohamed Keita",
      image:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=500&fit=crop",
      views: 1654,
      readTime: "4 min",
      featured: false,
    },
    {
      id: 8,
      title: "Inflation modérée dans la zone UEMOA",
      excerpt:
        "L'inflation dans la zone UEMOA reste modérée à 4.2%, en ligne avec les objectifs de la BCEAO. Cette stabilité favorise un environnement économique prévisible pour les entreprises.",
      category: "Économie",
      date: "2024-01-08",
      author: "Kani Sissoko",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      views: 987,
      readTime: "3 min",
      featured: false,
    },
  ];

  const categories = [
    { id: "all", name: "Toutes", icon: Globe, count: actualites.length },
    {
      id: "Économie",
      name: "Économie",
      icon: TrendingUp,
      count: actualites.filter((a) => a.category === "Économie").length,
    },
    {
      id: "Finance",
      name: "Finance",
      icon: DollarSign,
      count: actualites.filter((a) => a.category === "Finance").length,
    },
    {
      id: "Marché",
      name: "Marché",
      icon: BarChart3,
      count: actualites.filter((a) => a.category === "Marché").length,
    },
    {
      id: "Agriculture",
      name: "Agriculture",
      icon: Globe,
      count: actualites.filter((a) => a.category === "Agriculture").length,
    },
    {
      id: "Tech",
      name: "Tech",
      icon: Briefcase,
      count: actualites.filter((a) => a.category === "Tech").length,
    },
    {
      id: "Commerce",
      name: "Commerce",
      icon: Briefcase,
      count: actualites.filter((a) => a.category === "Commerce").length,
    },
  ];

  // Filtrer les actualités
  const filteredActualites = actualites.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = filteredActualites.filter((a) => a.featured);
  const regularArticles = filteredActualites.filter((a) => !a.featured);

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Économie: "bg-blue-500",
      Finance: "bg-green-500",
      Marché: "bg-purple-500",
      Agriculture: "bg-emerald-500",
      Tech: "bg-orange-500",
      Commerce: "bg-indigo-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const ArticleCard = ({
    article,
    featured = false,
  }: {
    article: any;
    featured?: boolean;
  }) => (
    <article
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className="relative">
        <img
          src={article.image}
          alt={article.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${featured ? "h-64 lg:h-80" : "h-48"}`}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}
          >
            {article.category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              🔥 À LA UNE
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2
          className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors ${featured ? "text-2xl lg:text-3xl" : "text-xl"}`}
        >
          {article.title}
        </h2>

        <p
          className={`text-gray-600 mb-4 leading-relaxed ${featured ? "text-lg line-clamp-3" : "text-sm line-clamp-2"}`}
        >
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.date).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Link
          to={`/article/${article.id}`}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          Lire l'article complet
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <section className="bg-gradient-to-br from-amani-primary to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Actualités Économiques
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Suivez les dernières nouvelles économiques et financières
              d'Afrique de l'Ouest. Analyses, tendances et insights pour rester
              informé.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres et recherche */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Résultats */}
            <div className="text-gray-600">
              {filteredActualites.length} article
              {filteredActualites.length > 1 ? "s" : ""} trouvé
              {filteredActualites.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles à la une */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
              <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-lg">
                🔥
              </span>
              À la une
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Autres articles */}
        {regularArticles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-amani-primary mb-8">
              Dernières actualités
            </h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Aucun résultat */}
        {filteredActualites.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez avec d'autres mots-clés ou sélectionnez une autre
                catégorie.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir toutes les actualités
              </button>
            </div>
          </div>
        )}

        {/* Newsletter signup */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Restez informé avec notre newsletter
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Recevez chaque semaine un résumé des actualités économiques les plus
            importantes d'Afrique de l'Ouest.
          </p>
          <Link
            to="/newsletter"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <Mic className="w-5 h-5" />
            S'abonner à la newsletter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
