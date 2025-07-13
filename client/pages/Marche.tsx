import { useState } from "react";
import { Link } from "react-router-dom";
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
  Download,
} from "lucide-react";

export default function Marche() {
  const [selectedMarket, setSelectedMarket] = useState("all");

  const marketData = [
    {
      name: "BRVM Composite",
      value: "185.42",
      change: "+2.3%",
      isPositive: true,
      volume: "2.8M FCFA",
      category: "Indice",
    },
    {
      name: "BRVM 30",
      value: "98.76",
      change: "+1.8%",
      isPositive: true,
      volume: "1.2M FCFA",
      category: "Indice",
    },
    {
      name: "Banque Atlantique",
      value: "4,250",
      change: "+3.2%",
      isPositive: true,
      volume: "156K FCFA",
      category: "Action",
    },
    {
      name: "Ecobank Transnational",
      value: "7,800",
      change: "-1.1%",
      isPositive: false,
      volume: "234K FCFA",
      category: "Action",
    },
    {
      name: "Orange Côte d'Ivoire",
      value: "12,500",
      change: "+2.8%",
      isPositive: true,
      volume: "189K FCFA",
      category: "Action",
    },
    {
      name: "FCFA/EUR",
      value: "655.957",
      change: "-0.1%",
      isPositive: false,
      volume: "Daily",
      category: "Devise",
    },
    {
      name: "FCFA/USD",
      value: "610.24",
      change: "-0.3%",
      isPositive: false,
      volume: "Daily",
      category: "Devise",
    },
  ];

  const commodities = [
    {
      name: "Or (Burkina/Mali)",
      value: "$2,045",
      change: "+0.8%",
      isPositive: true,
      unit: "/oz",
    },
    {
      name: "Coton (Mali)",
      value: "89.5¢",
      change: "+2.1%",
      isPositive: true,
      unit: "/lb",
    },
    {
      name: "Cacao (Côte d'Ivoire)",
      value: "$3,420",
      change: "-1.5%",
      isPositive: false,
      unit: "/tonne",
    },
    {
      name: "Pétrole (Tchad)",
      value: "$82.15",
      change: "-1.2%",
      isPositive: false,
      unit: "/baril",
    },
  ];

  const marketNews = [
    {
      id: 1,
      title: "BRVM : Performance exceptionnelle des banques régionales",
      excerpt:
        "Les valeurs bancaires tirent la performance de la bourse avec une hausse moyenne de 3.2%",
      category: "Bourse",
      time: "Il y a 2h",
    },
    {
      id: 2,
      title: "Évolution du taux de change FCFA/Euro",
      excerpt:
        "La devise ouest-africaine reste stable face à l'euro malgré les tensions mondiales",
      category: "Devise",
      time: "Il y a 4h",
    },
    {
      id: 3,
      title: "Cours de l'or : impact sur les économies du Mali et Burkina",
      excerpt:
        "La hausse du cours de l'or profite aux exportateurs de la région sahélienne",
      category: "Commodité",
      time: "Il y a 6h",
    },
  ];

  const filteredData = marketData.filter((item) =>
    selectedMarket === "all" ? true : item.category === selectedMarket,
  );

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-amani-primary mb-4">
            Marché Sahélien
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Suivez en temps réel les marchés financiers de la région UEMOA, les
            devises et commodités qui impactent l'économie du Sahel et du Tchad.
          </p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amani-primary">BRVM</h3>
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-amani-primary mb-2">
              185.42
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+2.3% aujourd'hui</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amani-primary">
                FCFA/EUR
              </h3>
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-amani-primary mb-2">
              655.96
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span className="font-medium">-0.1% cette semaine</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amani-primary">Or</h3>
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-amani-primary mb-2">
              $2,045
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+0.8% ce mois</span>
            </div>
          </div>
        </div>

        {/* Market Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Marchés
              </h2>
            </div>
            <div className="flex gap-2">
              {["all", "Indice", "Action", "Devise"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedMarket(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMarket === filter
                      ? "bg-amani-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-amani-secondary/50"
                  }`}
                >
                  {filter === "all" ? "Tous" : filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-white/50">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amani-primary">
                Cotations en temps réel
              </h2>
              <button className="flex items-center gap-2 text-amani-primary hover:text-amani-primary/80">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instrument
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-amani-primary">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold">{item.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center gap-1 ${
                          item.isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {item.change}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {item.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-amani-secondary/50 text-amani-primary rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodities Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <h2 className="text-xl font-semibold text-amani-primary mb-6">
              Commodités Régionales
            </h2>
            <div className="space-y-4">
              {commodities.map((commodity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-amani-primary">
                      {commodity.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {commodity.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {commodity.value}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        commodity.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {commodity.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {commodity.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-amani-primary">
                Actualités Marché
              </h2>
              <Link
                to="/marche/news"
                className="text-amani-primary hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {marketNews.map((news) => (
                <div
                  key={news.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-amani-primary mb-2 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="bg-amani-secondary/50 text-amani-primary px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {news.time}
                        </span>
                      </div>
                    </div>
                    <button className="text-amani-primary hover:text-amani-primary/80">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-amani-primary mb-6">
            Analyse du Marché Sahélien
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-4">
                Performance BRVM
              </h3>
              <p className="text-gray-600 mb-4">
                La Bourse Régionale des Valeurs Mobilières affiche une
                performance positive cette semaine, portée principalement par
                les valeurs bancaires et les télécommunications. Les
                investisseurs restent optimistes malgré les défis sécuritaires
                régionaux.
              </p>
              <div className="bg-amani-secondary/20 p-4 rounded-lg">
                <h4 className="font-medium text-amani-primary mb-2">
                  Points clés :
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Capitalisation boursière : 7,850 milliards FCFA</li>
                  <li>• Volume moyen quotidien : 2.8 millions FCFA</li>
                  <li>• 46 sociétés cotées</li>
                  <li>• Performance YTD : +5.2%</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-4">
                Zone Franc CFA
              </h3>
              <p className="text-gray-600 mb-4">
                Le franc CFA maintient sa stabilité face aux principales devises
                internationales. Les réserves de change de l'UEMOA restent
                solides, soutenues par les exportations d'or et de cacao.
              </p>
              <div className="bg-amani-secondary/20 p-4 rounded-lg">
                <h4 className="font-medium text-amani-primary mb-2">
                  Indicateurs :
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Réserves BCEAO : 15.2 milliards EUR</li>
                  <li>• Taux de couverture : 5.3 mois</li>
                  <li>• Inflation moyenne : 3.8%</li>
                  <li>• Taux directeur : 3.5%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
