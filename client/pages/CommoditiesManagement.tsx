import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  Save,
  X,
  Globe,
  DollarSign,
  Eye,
  HelpCircle,
  Info,
} from "lucide-react";

interface CommodityData {
  id: string;
  name: string;
  symbol: string;
  price: string;
  currency: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
  unit: string;
  description: string;
  category: "metals" | "energy" | "agriculture";
  source?: string;
}

export default function CommoditiesManagement() {
  const [commodities, setCommodities] = React.useState<CommodityData[]>([
    {
      id: "1",
      name: "Or",
      symbol: "XAU/USD",
      price: "2025.50",
      currency: "USD",
      change: "+15.20",
      changePercent: "+0.75%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      unit: "once troy",
      description:
        "Métal précieux de référence, refuge en temps d'incertitude économique",
      category: "metals",
      source: "COMEX",
    },
    {
      id: "2",
      name: "Coton",
      symbol: "CT",
      price: "75.25",
      currency: "USD",
      change: "-2.10",
      changePercent: "-2.7%",
      isPositive: false,
      lastUpdate: new Date().toISOString(),
      unit: "cents/livre",
      description: "Fibre textile importante pour l'économie ouest-africaine",
      category: "agriculture",
      source: "ICE",
    },
    {
      id: "3",
      name: "Pétrole Brent",
      symbol: "BZ",
      price: "82.45",
      currency: "USD",
      change: "+1.85",
      changePercent: "+2.3%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      unit: "USD/baril",
      description: "Référence mondiale pour le prix du pétrole",
      category: "energy",
      source: "ICE",
    },
    {
      id: "4",
      name: "Cacao",
      symbol: "CC",
      price: "3250.80",
      currency: "USD",
      change: "+125.50",
      changePercent: "+4.0%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      unit: "USD/tonne",
      description: "Matière première majeure pour la Côte d'Ivoire et le Ghana",
      category: "agriculture",
      source: "ICE",
    },
  ]);

  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<CommodityData>>({});
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const categories = [
    {
      id: "all",
      name: "Toutes les matières premières",
      icon: Globe,
      color: "blue",
    },
    {
      id: "metals",
      name: "Métaux précieux",
      icon: DollarSign,
      color: "yellow",
    },
    { id: "energy", name: "Énergie", icon: TrendingUp, color: "red" },
    { id: "agriculture", name: "Agriculture", icon: Globe, color: "green" },
  ];

  const filteredCommodities =
    selectedCategory === "all"
      ? commodities
      : commodities.filter(
          (commodity) => commodity.category === selectedCategory,
        );

  const startEdit = (commodity: CommodityData) => {
    setIsEditing(commodity.id);
    setEditForm(commodity);
  };

  const saveEdit = () => {
    if (isEditing && editForm) {
      setCommodities((prev) =>
        prev.map((commodity) =>
          commodity.id === isEditing
            ? {
                ...commodity,
                ...editForm,
                lastUpdate: new Date().toISOString(),
              }
            : commodity,
        ),
      );
      setIsEditing(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const deleteCommodity = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette matière première ?",
      )
    ) {
      setCommodities((prev) => prev.filter((commodity) => commodity.id !== id));
    }
  };

  const addNewCommodity = () => {
    const newCommodity: CommodityData = {
      id: Date.now().toString(),
      name: editForm.name || "",
      symbol: editForm.symbol || "",
      price: editForm.price || "0",
      currency: editForm.currency || "USD",
      change: editForm.change || "0",
      changePercent: editForm.changePercent || "0%",
      isPositive: parseFloat(editForm.change || "0") >= 0,
      lastUpdate: new Date().toISOString(),
      unit: editForm.unit || "",
      description: editForm.description || "",
      category: editForm.category || "agriculture",
      source: editForm.source,
    };

    setCommodities((prev) => [...prev, newCommodity]);
    setShowAddForm(false);
    setEditForm({});
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      metals: "bg-yellow-100 text-yellow-800",
      energy: "bg-red-100 text-red-800",
      agriculture: "bg-green-100 text-green-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getCommodityIcon = (symbol: string): string => {
    const icons: { [key: string]: string } = {
      "XAU/USD": "🥇",
      CT: "🤍",
      BZ: "🛢️",
      CL: "⛽",
      "XAG/USD": "🥈",
      "XPT/USD": "💍",
      HG: "🔩",
      KC: "☕",
      CC: "🍫",
    };
    return icons[symbol] || "📊";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Globe className="w-8 h-8 text-orange-600" />
              Gestion des Matières Premières
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez les prix de l'or, pétrole, coton, cacao et autres commodités
              affichées sur votre site
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Ajouter une commodité
          </button>
        </div>

        {/* Guide rapide */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Guide des matières premières
              </h3>
              <div className="text-orange-800 space-y-2 text-sm">
                <p>
                  <strong>🥇 Métaux précieux :</strong> Or, argent, platine -
                  valeurs refuges
                </p>
                <p>
                  <strong>⛽ Énergie :</strong> Pétrole, gaz naturel - impact
                  sur tous les coûts
                </p>
                <p>
                  <strong>🌾 Agriculture :</strong> Coton, cacao, café -
                  importantes pour l'économie africaine
                </p>
                <p>
                  <strong>💡 Impact :</strong> Ces prix influencent directement
                  l'économie et le quotidien des citoyens
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isActive ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {category.id === "all"
                    ? commodities.length
                    : commodities.filter((c) => c.category === category.id)
                        .length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Liste des commodités */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Commodités actuelles ({filteredCommodities.length})
              </h2>
              <Link
                to="/indices"
                target="_blank"
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
              >
                <Eye className="w-4 h-4" />
                Voir sur le site
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredCommodities.map((commodity) => {
              const isEditingThis = isEditing === commodity.id;

              return (
                <div
                  key={commodity.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Nom et catégorie */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getCommodityIcon(commodity.symbol)}
                          </span>
                          <div>
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editForm.name || ""}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="font-semibold text-lg border border-gray-300 rounded px-2 py-1 w-full"
                                placeholder="Nom de la commodité"
                              />
                            ) : (
                              <h3 className="font-semibold text-lg text-gray-900">
                                {commodity.name}
                              </h3>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(commodity.category)}`}
                              >
                                {commodity.category.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {commodity.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="text-center">
                        {isEditingThis ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editForm.price || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  price: e.target.value,
                                }))
                              }
                              className="text-xl font-bold border border-gray-300 rounded px-2 py-1 text-center w-24"
                            />
                            <input
                              type="text"
                              value={editForm.currency || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  currency: e.target.value,
                                }))
                              }
                              className="text-xs border border-gray-300 rounded px-2 py-1 text-center w-16"
                              placeholder="USD"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {commodity.currency === "USD" && "$"}
                              {commodity.price}
                              {commodity.currency !== "USD" &&
                                ` ${commodity.currency}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {commodity.unit}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Variation */}
                      <div className="text-center">
                        {isEditingThis ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editForm.change || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  change: e.target.value,
                                }))
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                              placeholder="+2.5"
                            />
                            <input
                              type="text"
                              value={editForm.changePercent || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  changePercent: e.target.value,
                                }))
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                              placeholder="+1.2%"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex items-center justify-center gap-1 font-semibold ${
                              commodity.isPositive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {commodity.isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <div>
                              <div>{commodity.change}</div>
                              <div className="text-sm">
                                ({commodity.changePercent})
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        {isEditingThis ? (
                          <textarea
                            value={editForm.description || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            rows={2}
                            placeholder="Description de la commodité"
                          />
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {commodity.description}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              {commodity.source && (
                                <span>Source: {commodity.source}</span>
                              )}
                              <span>
                                Mis à jour:{" "}
                                {new Date(commodity.lastUpdate).toLocaleString(
                                  "fr-FR",
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {isEditingThis ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                            title="Sauvegarder"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(commodity)}
                            className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCommodity(commodity.id)}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCommodities.length === 0 && (
            <div className="p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune commodité dans cette catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par ajouter votre première matière première.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter une commodité
              </button>
            </div>
          )}
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ajouter une nouvelle commodité
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditForm({});
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((category) => {
                        const Icon = category.icon;
                        return (
                          <button
                            key={category.id}
                            onClick={() =>
                              setEditForm((prev) => ({
                                ...prev,
                                category: category.id as any,
                              }))
                            }
                            className={`p-4 border rounded-lg text-left transition-colors ${
                              editForm.category === category.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="w-6 h-6 mb-2 text-orange-600" />
                            <div className="font-medium">{category.name}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: Or, Pétrole Brent, Coton"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symbole *
                    </label>
                    <input
                      type="text"
                      value={editForm.symbol || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: XAU/USD, BZ, CT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix actuel *
                    </label>
                    <input
                      type="text"
                      value={editForm.price || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: 2025.50, 82.45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Devise
                    </label>
                    <input
                      type="text"
                      value={editForm.currency || "USD"}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="USD, EUR, FCFA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité *
                    </label>
                    <input
                      type="text"
                      value={editForm.unit || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: once troy, USD/baril, cents/livre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={editForm.source || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          source: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: COMEX, ICE, LME"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variation
                    </label>
                    <input
                      type="text"
                      value={editForm.change || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          change: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+15.20 ou -2.10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variation %
                    </label>
                    <input
                      type="text"
                      value={editForm.changePercent || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          changePercent: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+0.75% ou -2.7%"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Expliquez l'importance de cette commodité pour l'économie africaine"
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-orange-800 text-sm">
                      <p className="font-medium mb-1">💡 Conseils :</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • Les prix des commodités changent constamment selon
                          l'offre et la demande
                        </li>
                        <li>
                          • Utilisez + ou - devant les variations pour indiquer
                          hausses/baisses
                        </li>
                        <li>
                          • Expliquez l'impact sur l'économie locale dans la
                          description
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditForm({});
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addNewCommodity}
                  disabled={
                    !editForm.name ||
                    !editForm.symbol ||
                    !editForm.price ||
                    !editForm.unit
                  }
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter la commodité
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
