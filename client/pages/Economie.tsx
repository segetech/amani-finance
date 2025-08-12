import { useState } from "react";
import { Link } from "react-router-dom";
import ArticleReader from "../components/ArticleReader";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Globe,
  ArrowRight,
  Calendar,
  Eye,
  Filter,
  Search,
  BookOpen,
  Users,
  Building,
  Target,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

export default function Economie() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const economicData = [
    {
      country: "Mali",
      gdpGrowth: "+5.2%",
      inflation: "2.1%",
      unemployment: "8.4%",
      currency: "FCFA",
      population: "21.9M",
      gdpPerCapita: "875 USD",
      mainSectors: ["Agriculture", "Mines", "Services"],
      flag: "🇲🇱",
    },
    {
      country: "Burkina Faso",
      gdpGrowth: "+4.8%",
      inflation: "1.9%",
      unemployment: "6.2%",
      currency: "FCFA",
      population: "22.1M",
      gdpPerCapita: "790 USD",
      mainSectors: ["Agriculture", "Mines", "Élevage"],
      flag: "🇧🇫",
    },
    {
      country: "Niger",
      gdpGrowth: "+6.1%",
      inflation: "2.8%",
      unemployment: "7.3%",
      currency: "FCFA",
      population: "25.3M",
      gdpPerCapita: "650 USD",
      mainSectors: ["Uranium", "Agriculture", "Élevage"],
      flag: "🇳🇪",
    },
    {
      country: "Tchad",
      gdpGrowth: "+3.9%",
      inflation: "3.2%",
      unemployment: "9.1%",
      currency: "FCFA",
      population: "17.2M",
      gdpPerCapita: "720 USD",
      mainSectors: ["Pétrole", "Agriculture", "Coton"],
      flag: "🇹🇩",
    },
  ];

  const articles = [
    {
      id: "1",
      title: "UEMOA : Croissance économique soutenue en 2024",
      excerpt: "L'Union économique et monétaire ouest-africaine maintient une dynamique positive avec une croissance projetée à 5.8% pour l'année 2024, portée par les réformes structurelles et l'amélioration du climat des affaires.",
      content: `L'économie de l'UEMOA connaît une période de croissance remarquable en 2024, avec des performances qui dépassent les prévisions initiales. Cette dynamique positive s'explique par plusieurs facteurs clés.

Premièrement, les réformes structurelles engagées par les États membres commencent à porter leurs fruits. La modernisation du système fiscal, l'amélioration de la gouvernance et la facilitation de l'accès au crédit pour les PME ont créé un environnement plus favorable aux investissements.

Deuxièmement, le secteur agricole, pilier de l'économie régionale, bénéficie de conditions climatiques favorables et d'innovations technologiques. L'adoption progressive de nouvelles variétés de semences et l'amélioration des systèmes d'irrigation contribuent à l'augmentation des rendements.

Le secteur minier continue également de jouer un rôle moteur, avec de nouveaux projets d'extraction d'or et d'autres minerais qui génèrent d'importantes recettes d'exportation. Parallèlement, le développement du secteur des services, notamment les télécommunications et les services financiers, diversifie l'économie et crée de nouveaux emplois.

Cette croissance s'accompagne d'une stabilité monétaire maintenue par la BCEAO, avec un taux d'inflation maîtrisé autour de 2.5%. Les politiques monétaires prudentes ont permis de préserver la confiance des investisseurs tout en soutenant l'activité économique.`,
      author: "Dr. Fatou Diallo",
      category: "Macroéconomie",
      country: "UEMOA",
      publishedAt: "2024-01-15",
      readTime: 8,
      views: 15420,
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      featured: true,
    },
    {
      id: "2",
      title: "Mali : Le secteur minier dopé par les cours de l'or",
      excerpt: "Les performances du secteur aurifère malien atteignent des niveaux records, contribuant significativement à l'économie nationale et aux recettes d'exportation.",
      content: `Le Mali consolide sa position de troisième producteur d'or africain avec une production qui dépasse les prévisions. Cette performance exceptionnelle s'explique par la combinaison de plusieurs facteurs favorables.

L'amélioration des cours internationaux de l'or, qui évoluent autour de 2000 USD l'once, offre des marges confortables aux compagnies minières opérant sur le territoire malien. Cette conjoncture favorable encourage les investissements dans l'exploration et l'expansion des sites existants.

Les nouvelles technologies d'extraction permettent également d'optimiser les rendements tout en réduisant l'impact environnemental. L'adoption de procédés plus efficaces et respectueux de l'environnement répond aux exigences croissantes des investisseurs internationaux en matière de responsabilité sociale.

Le gouvernement malien a également mis en place un cadre réglementaire plus attractif, avec une fiscalité adaptée qui encourage les investissements tout en garantissant des retombées significatives pour l'économie nationale. Les recettes minières représentent désormais plus de 70% des recettes d'exportation du pays.`,
      author: "Amadou Traoré",
      category: "Secteur minier",
      country: "Mali",
      publishedAt: "2024-01-12",
      readTime: 6,
      views: 8750,
      coverImage: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=800",
      featured: false,
    },
    {
      id: "3",
      title: "Agriculture sahélienne : Innovation et résilience",
      excerpt: "Face aux défis climatiques, les agriculteurs sahéliens adoptent des pratiques innovantes qui transforment progressivement le secteur agricole régional.",
      content: `L'agriculture sahélienne traverse une période de transformation remarquable, portée par l'innovation et l'adaptation aux changements climatiques. Cette évolution s'observe à travers plusieurs initiatives prometteuses.

L'agriculture intelligente face au climat (AIC) gagne du terrain avec l'adoption de variétés de semences résistantes à la sécheresse et l'utilisation de systèmes d'irrigation goutte-à-goutte. Ces technologies permettent d'optimiser l'utilisation de l'eau, ressource particulièrement précieuse dans la région.

Les coopératives agricoles jouent un rôle central dans cette transformation. Elles facilitent l'accès aux intrants de qualité, partagent les connaissances techniques et négocient de meilleurs prix pour les producteurs. Cette organisation collective renforce la résilience du secteur face aux chocs externes.

Le développement de chaînes de valeur agricoles intégrées créé de nouvelles opportunités économiques. De la production à la commercialisation, en passant par la transformation, chaque maillon de la chaîne est optimisé pour maximiser la valeur ajoutée et réduire les pertes post-récolte.`,
      author: "Mariama Sy",
      category: "Agriculture",
      country: "Sahel",
      publishedAt: "2024-01-10",
      readTime: 7,
      views: 12300,
      coverImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
      featured: false,
    }
  ];

  const categories = ["all", "Macroéconomie", "Secteur minier", "Agriculture", "Commerce", "Finance"];
  const countries = ["all", "Mali", "Burkina Faso", "Niger", "Tchad", "UEMOA", "Sahel"];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || article.country === selectedCountry;
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const featuredArticle = articles.find(article => article.featured);

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amani-primary to-amani-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              📊 Économie Sahélienne
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Analyses, perspectives et données économiques de la région
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Croissance: +5.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span>PIB: 180B USD</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span>86M habitants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economic Dashboard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Tableau de bord économique
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {economicData.map((country, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-amani-primary flex items-center gap-2">
                    <span className="text-2xl">{country.flag}</span>
                    {country.country}
                  </h3>
                  <div className="text-sm text-gray-500">{country.population}</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance PIB</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {country.gdpGrowth}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inflation</span>
                    <span className="font-semibold text-blue-600">{country.inflation}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PIB/habitant</span>
                    <span className="font-semibold text-amani-primary">{country.gdpPerCapita}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Secteurs clés:</div>
                    <div className="flex flex-wrap gap-1">
                      {country.mainSectors.map((sector, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amani-secondary/20 text-amani-primary rounded-full text-xs">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
              <Star className="w-8 h-8" />
              Article à la une
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredArticle.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {featuredArticle.country}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime} min
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-amani-primary mb-4 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredArticle.views.toLocaleString()}
                      </span>
                    </div>
                    
                    <Link
                      to={`/article/${featuredArticle.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
                    >
                      Lire l'article
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "Toutes catégories" : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === "all" ? "Tous pays" : country}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amani-primary mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Dernières analyses ({filteredArticles.length})
          </h2>
          
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {article.country}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-amani-primary mb-3 leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime} min
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                    
                    <Link
                      to={`/article/${article.id}`}
                      className="flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 font-medium"
                    >
                      Lire l'analyse complète
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-6">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {article.country}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-amani-primary mb-3 leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views.toLocaleString()}
                          </span>
                        </div>
                        
                        <Link
                          to={`/article/${article.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
                        >
                          Lire
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amani-primary/10 to-amani-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amani-primary mb-6">
            Restez informé de l'actualité économique
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Recevez nos analyses exclusives et nos prévisions économiques directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
            >
              <Target className="w-5 h-5" />
              S'abonner à la newsletter
            </Link>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amani-primary text-amani-primary rounded-lg hover:bg-amani-primary/5 transition-colors font-medium"
            >
              <Zap className="w-5 h-5" />
              Voir toutes les analyses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
