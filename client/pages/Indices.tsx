import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Download,
  Calendar,
  Globe,
} from "lucide-react";

export default function Indices() {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const indices = [
    {
      name: "BRVM Composite",
      value: "185.42",
      change: "+2.3%",
      changeValue: "+4.18",
      isPositive: true,
      country: "Régional",
      category: "Bourse",
      lastUpdate: "15 Jan 2024, 16:30",
    },
    {
      name: "FCFA/EUR",
      value: "655.957",
      change: "-0.1%",
      changeValue: "-0.65",
      isPositive: false,
      country: "UEMOA",
      category: "Devise",
      lastUpdate: "15 Jan 2024, 18:00",
    },
    {
      name: "Inflation Mali",
      value: "4.2%",
      change: "+0.5%",
      changeValue: "+0.5",
      isPositive: false,
      country: "Mali",
      category: "Inflation",
      lastUpdate: "Jan 2024",
    },
    {
      name: "Taux directeur BCEAO",
      value: "3.5%",
      change: "0%",
      changeValue: "0",
      isPositive: true,
      country: "UEMOA",
      category: "Taux",
      lastUpdate: "15 Jan 2024",
    },
    {
      name: "PIB Burkina Faso",
      value: "5.8%",
      change: "+1.2%",
      changeValue: "+1.2",
      isPositive: true,
      country: "Burkina Faso",
      category: "PIB",
      lastUpdate: "Q4 2023",
    },
    {
      name: "Or (LBMA)",
      value: "$2,045",
      change: "+0.8%",
      changeValue: "+$16",
      isPositive: true,
      country: "International",
      category: "Commodité",
      lastUpdate: "15 Jan 2024, 17:45",
    },
    {
      name: "Pétrole Brent",
      value: "$82.15",
      change: "-1.2%",
      changeValue: "-$1.01",
      isPositive: false,
      country: "International",
      category: "Commodité",
      lastUpdate: "15 Jan 2024, 18:00",
    },
    {
      name: "Inflation Niger",
      value: "3.8%",
      change: "-0.3%",
      changeValue: "-0.3",
      isPositive: true,
      country: "Niger",
      category: "Inflation",
      lastUpdate: "Jan 2024",
    },
    {
      name: "Taux chômage Sénégal",
      value: "16.9%",
      change: "-0.5%",
      changeValue: "-0.5",
      isPositive: true,
      country: "Sénégal",
      category: "Emploi",
      lastUpdate: "Q4 2023",
    },
  ];

  const countries = [
    "all",
    "Mali",
    "Burkina Faso",
    "Niger",
    "Sénégal",
    "UEMOA",
    "Régional",
    "International",
  ];
  const categories = [
    "all",
    "Bourse",
    "Devise",
    "Inflation",
    "Taux",
    "PIB",
    "Commodité",
    "Emploi",
  ];

  const filteredIndices = indices.filter((index) => {
    const countryMatch =
      selectedCountry === "all" || index.country === selectedCountry;
    const categoryMatch =
      selectedCategory === "all" || index.category === selectedCategory;
    return countryMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-amani-primary mb-4">
            Indices économiques
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Suivez en temps réel les principaux indicateurs économiques du Sahel
            et du Tchad. Données actualisées quotidiennement.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-amani-primary" />
            <h2 className="text-xl font-semibold text-amani-primary">
              Filtres
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays/Région
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Tous les pays</option>
                {countries.slice(1).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 bg-amani-primary text-white px-6 py-3 rounded-lg hover:bg-amani-primary/90 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-amani-primary">
              {filteredIndices.length}
            </span>{" "}
            indices trouvés
          </p>
        </div>

        {/* Indices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndices.map((index, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-amani-primary mb-1">
                    {index.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    {index.country}
                  </div>
                </div>
                <span className="bg-amani-secondary/50 text-amani-primary px-3 py-1 rounded-full text-xs font-medium">
                  {index.category}
                </span>
              </div>

              {/* Value */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-amani-primary mb-2">
                  {index.value}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      index.isPositive
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {index.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {index.change}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({index.changeValue})
                  </span>
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
                <Calendar className="w-4 h-4" />
                Mis à jour: {index.lastUpdate}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIndices.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun indice trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres pour voir plus de résultats.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-amani-primary mb-6">
            À propos des indices
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-3">
                Sources de données
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>
                  • BCEAO (Banque Centrale des États de l'Afrique de l'Ouest)
                </li>
                <li>• BRVM (Bourse Régionale des Valeurs Mobilières)</li>
                <li>• Instituts nationaux de statistiques</li>
                <li>• Bloomberg et Reuters</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amani-primary mb-3">
                Fréquence de mise à jour
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Indices boursiers: Temps réel</li>
                <li>• Taux de change: Quotidien</li>
                <li>• Inflation: Mensuel</li>
                <li>• PIB: Trimestriel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
