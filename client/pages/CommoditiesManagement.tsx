import React from "react";
import { Link } from "react-router-dom";
import { useCommodities, type Commodity } from "../hooks/useCommodities";
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
  RefreshCw,
  Coffee,
  Cookie,
  Shirt,
  Wheat,
  Coins,
  Circle,
  Fuel,
  Flame,
  Zap,
  Box,
} from "lucide-react";

// Mapping des icônes
const iconMap: Record<string, any> = {
  Coffee,
  Cookie,
  Shirt,
  Wheat,
  Coins,
  Circle,
  Fuel,
  Flame,
  Zap,
  Box,
};

export default function CommoditiesManagement() {
  const { 
    commodities, 
    loading, 
    error, 
    fetchCommodities, 
    getCategories,
    updateCommodity,
    createCommodity,
    deleteCommodity: deleteCommodityFromDB 
  } = useCommodities({ is_active: true });

  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<Commodity>>({});
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
      id: "Métaux précieux",
      name: "Métaux précieux",
      icon: DollarSign,
      color: "yellow",
    },
    { id: "Énergie", name: "Énergie", icon: TrendingUp, color: "red" },
    { id: "Agriculture", name: "Agriculture", icon: Globe, color: "green" },
  ];

  const availableCategories = getCategories();
  const filteredCommodities = selectedCategory === "all"
    ? commodities
    : commodities.filter((commodity) => commodity.category === selectedCategory);

  const startEdit = (commodity: Commodity) => {
    setIsEditing(commodity.id);
    setEditForm(commodity);
  };

  const saveEdit = async () => {
    if (isEditing && editForm) {
      try {
        await updateCommodity(isEditing, editForm);
        setIsEditing(null);
        setEditForm({});
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde');
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const handleDeleteCommodity = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière première ?")) {
      try {
        await deleteCommodityFromDB(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const addNewCommodity = async () => {
    if (!editForm.name || !editForm.symbol || !editForm.current_price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const newCommodity = {
        ...editForm,
        is_active: true,
        show_on_homepage: true,
        display_order: 0,
      } as Omit<Commodity, 'id' | 'created_at' | 'updated_at' | 'last_updated'>;

      await createCommodity(newCommodity);
      setShowAddForm(false);
      setEditForm({});
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Métaux précieux": "bg-yellow-100 text-yellow-800",
      "Énergie": "bg-red-100 text-red-800",
      "Agriculture": "bg-green-100 text-green-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) {
      return Globe;
    }
    return iconMap[iconName];
  };

  const formatPrice = (price: number, unit: string) => {
    return `${price.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ${unit}`;
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchCommodities}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
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
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={fetchCommodities}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Ajouter une commodité
          </button>
        </div>
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
                <strong>🥇 Métaux précieux :</strong> Or, argent, platine - valeurs refuges
              </p>
              <p>
                <strong>⛽ Énergie :</strong> Pétrole, gaz naturel - impact sur tous les coûts
              </p>
              <p>
                <strong>🌾 Agriculture :</strong> Coton, cacao, café - importantes pour l'économie africaine
              </p>
              <p>
                <strong>💡 Impact :</strong> Ces prix influencent directement l'économie et le quotidien des citoyens
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
          const count = category.id === "all" 
            ? commodities.length 
            : commodities.filter((c) => c.category === category.id).length;
          
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
                {count}
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
              to="/marche"
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
            const IconComponent = getIconComponent(commodity.icon);
            const isPositive = commodity.change_percent >= 0;

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
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-orange-600" />
                        </div>
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
                            type="number"
                            value={editForm.current_price || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                current_price: parseFloat(e.target.value) || 0,
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
                            {formatPrice(commodity.current_price, commodity.unit)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {commodity.currency}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Variation */}
                    <div className="text-center">
                      {isEditingThis ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            value={editForm.change_amount || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                change_amount: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                            placeholder="2.5"
                          />
                          <input
                            type="number"
                            value={editForm.change_percent || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                change_percent: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                            placeholder="1.2"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-center gap-1 font-semibold ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <div>
                            <div>{isPositive ? '+' : ''}{commodity.change_amount.toFixed(2)}</div>
                            <div className="text-sm">
                              ({isPositive ? '+' : ''}{commodity.change_percent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Marché */}
                    <div className="text-center">
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={editForm.market || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              market: e.target.value,
                            }))
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                          placeholder="ICE"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{commodity.market || 'N/A'}</span>
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
                            <span>
                              Mis à jour: {new Date(commodity.last_updated).toLocaleString("fr-FR")}
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
                          disabled={loading}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
                          onClick={() => handleDeleteCommodity(commodity.id)}
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
              {loading ? 'Chargement...' : 'Aucune commodité dans cette catégorie'}
            </h3>
            <p className="text-gray-600 mb-6">
              {loading ? 'Veuillez patienter...' : 'Commencez par ajouter votre première matière première.'}
            </p>
            {!loading && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter une commodité
              </button>
            )}
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
                <select
                  value={editForm.category || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Métaux précieux">Métaux précieux</option>
                  <option value="Énergie">Énergie</option>
                  <option value="Métaux industriels">Métaux industriels</option>
                </select>
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
                    placeholder="Ex: GOLD, BRENT, COTTON"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix actuel *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.current_price || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        current_price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: 2025.50, 82.45"
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
                    placeholder="Ex: USD/once, USD/baril, USD/livre"
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
                    Marché
                  </label>
                  <input
                    type="text"
                    value={editForm.market || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        market: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: COMEX, ICE, LME"
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
                      <li>• Les prix des commodités changent constamment selon l'offre et la demande</li>
                      <li>• Utilisez + ou - devant les variations pour indiquer hausses/baisses</li>
                      <li>• Expliquez l'impact sur l'économie locale dans la description</li>
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
                disabled={loading}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer la commodité'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
