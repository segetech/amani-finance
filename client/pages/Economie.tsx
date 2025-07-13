import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Globe,
  Users,
  Building,
  Banknote,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function Economie() {
  const [selectedCountry, setSelectedCountry] = useState("all");

  const economicIndicators = [
    {
      country: "Mali",
      gdp: "19.2 Mds $",
      gdpGrowth: "+5.1%",
      inflation: "4.2%",
      unemployment: "8.1%",
      population: "21.9M",
      gdpPerCapita: "876 $",
      mainSectors: ["Or", "Agriculture", "Coton"],
    },
    {
      country: "Burkina Faso",
      gdp: "18.7 Mds $",
      gdpGrowth: "+5.8%",
      inflation: "3.9%",
      unemployment: "6.2%",
      population: "22.7M",
      gdpPerCapita: "824 $",
      mainSectors: ["Or", "Coton", "Élevage"],
    },
    {
      country: "Niger",
      gdp: "14.9 Mds $",
      gdpGrowth: "+7.2%",
      inflation: "3.8%",
      unemployment: "16.3%",
      population: "25.1M",
      gdpPerCapita: "594 $",
      mainSectors: ["Uranium", "Agriculture", "Élevage"],
    },
    {
      country: "Tchad",
      gdp: "11.8 Mds $",
      gdpGrowth: "+3.4%",
      inflation: "5.1%",
      unemployment: "22.6%",
      population: "17.2M",
      gdpPerCapita: "686 $",
      mainSectors: ["Pétrole", "Agriculture", "Élevage"],
    },
    {
      country: "Mauritanie",
      gdp: "9.7 Mds $",
      gdpGrowth: "+4.7%",
      inflation: "4.8%",
      unemployment: "11.2%",
      population: "4.9M",
      gdpPerCapita: "1,980 $",
      mainSectors: ["Fer", "Pêche", "Or"],
    },
  ];

  const monetaryData = [
    {
      indicator: "Taux directeur BCEAO",
      value: "3.5%",
      trend: "stable",
      description: "Maintenu depuis juin 2023",
    },
    {
      indicator: "Réserves de change",
      value: "15.2 Mds €",
      trend: "up",
      description: "Couverture de 5.3 mois d'importations",
    },
    {
      indicator: "Inflation UEMOA",
      value: "3.8%",
      trend: "down",
      description: "En baisse par rapport au pic de 2022",
    },
    {
      indicator: "Masse monétaire M2",
      value: "+8.4%",
      trend: "up",
      description: "Croissance annuelle",
    },
  ];

  const economicNews = [
    {
      id: 1,
      title: "La BCEAO maintient son taux directeur à 3,5%",
      excerpt:
        "Le comité de politique monétaire privilégie la stabilité des prix dans un contexte d'inflation maîtrisée",
      category: "Politique monétaire",
      date: "15 Jan 2024",
      country: "UEMOA",
    },
    {
      id: 2,
      title: "PIB du Mali : croissance de 5,1% en 2023",
      excerpt:
        "La production aurifère et les bonnes récoltes agricoles soutiennent la croissance économique",
      category: "Croissance",
      date: "12 Jan 2024",
      country: "Mali",
    },
    {
      id: 3,
      title: "Le Burkina Faso projette 6% de croissance en 2024",
      excerpt:
        "Malgré les défis sécuritaires, le gouvernement table sur une reprise de l'activité économique",
      category: "Prévisions",
      date: "10 Jan 2024",
      country: "Burkina Faso",
    },
  ];

  const filteredCountries = economicIndicators.filter((country) =>
    selectedCountry === "all" ? true : country.country === selectedCountry,
  );

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-amani-primary mb-4">
            Économie Sahélienne
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Analyses macroéconomiques, indicateurs de croissance et politiques
            monétaires des pays du Sahel et du Tchad. Données actualisées par
            les instituts nationaux de statistiques.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                PIB Régional
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">
              74.3 Mds $
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5.2% en 2023
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Population</h3>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">91.8M</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2.8% par an
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Inflation Moy.
              </h3>
              <PieChart className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">4.4%</div>
            <div className="text-sm text-red-600 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -1.2% vs 2022
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Chômage</h3>
              <Building className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-amani-primary">13.5%</div>
            <div className="text-sm text-gray-600">Moyenne régionale</div>
          </div>
        </div>

        {/* Country Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-amani-primary">
              Indicateurs par Pays
            </h2>
            <div className="flex gap-2 flex-wrap">
              {[
                "all",
                "Mali",
                "Burkina Faso",
                "Niger",
                "Tchad",
                "Mauritanie",
              ].map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCountry === country
                      ? "bg-amani-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-amani-secondary/50"
                  }`}
                >
                  {country === "all" ? "Tous" : country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Countries Economic Data */}
        <div className="grid gap-6 mb-8">
          {filteredCountries.map((country, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 border border-white/50"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amani-primary to-amani-primary/80 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-amani-primary">
                      {country.country}
                    </h3>
                    <p className="text-gray-600">
                      Population : {country.population}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amani-primary">
                    {country.gdp}
                  </div>
                  <div className="text-sm text-gray-600">PIB nominal</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {country.gdpGrowth}
                  </div>
                  <div className="text-sm text-gray-600">Croissance PIB</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {country.inflation}
                  </div>
                  <div className="text-sm text-gray-600">Inflation</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">
                    {country.unemployment}
                  </div>
                  <div className="text-sm text-gray-600">Chômage</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {country.gdpPerCapita}
                  </div>
                  <div className="text-sm text-gray-600">PIB/habitant</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-amani-primary mb-3">
                  Secteurs clés :
                </h4>
                <div className="flex gap-2">
                  {country.mainSectors.map((sector, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amani-secondary/50 text-amani-primary rounded-full text-sm font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monetary Policy */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Banknote className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Politique Monétaire BCEAO
              </h2>
            </div>
            <div className="space-y-4">
              {monetaryData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-amani-primary">
                      {item.indicator}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div className="text-lg font-semibold">{item.value}</div>
                    {item.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                    {item.trend === "down" && (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-amani-primary">
                Actualités Économiques
              </h2>
              <Link
                to="/economie/news"
                className="text-amani-primary hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {economicNews.map((news) => (
                <div
                  key={news.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-amani-primary line-clamp-2">
                      {news.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {news.country}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="bg-amani-secondary/50 text-amani-primary px-2 py-1 rounded">
                      {news.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {news.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Economic Outlook */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-amani-primary mb-6">
            Perspectives Économiques 2024
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-4">
                Croissance Attendue
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                +5.7%
              </div>
              <p className="text-gray-600 text-sm">
                La région devrait maintenir une croissance solide portée par le
                secteur minier et les réformes structurelles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-4">
                Défis Principaux
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sécurité et stabilité politique</li>
                <li>• Diversification économique</li>
                <li>• Inflation des produits alimentaires</li>
                <li>• Accès au financement</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-4">
                Opportunités
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Zone de libre-échange africaine</li>
                <li>• Transition énergétique</li>
                <li>• Digitalisation des services</li>
                <li>• Développement des infrastructures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
