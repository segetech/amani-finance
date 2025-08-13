import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Save,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  DollarSign,
  AlertCircle,
  Info,
  Eye,
} from "lucide-react";

interface IndiceData {
  id: string;
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
  description: string;
  category: "brvm" | "commodity" | "economic";
  unit?: string;
  source?: string;
}

export default function EditIndice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - En production, récupérer depuis une API
  const [indice, setIndice] = React.useState<IndiceData>({
    id: id || "1",
    name: "BRVM Composite",
    symbol: "BRVM",
    value: "185.42",
    change: "+4.28",
    changePercent: "+2.3%",
    isPositive: true,
    lastUpdate: new Date().toISOString(),
    description:
      "Indice principal de la Bourse Régionale des Valeurs Mobilières",
    category: "brvm",
    source: "BRVM",
  });

  const [formData, setFormData] = React.useState<IndiceData>(indice);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    // Simulation de chargement des données
    if (id === "2") {
      const mockData = {
        id: "2",
        name: "FCFA/EUR",
        symbol: "XOF/EUR",
        value: "655.957",
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: new Date().toISOString(),
        description: "Taux de change Franc CFA / Euro",
        category: "economic" as const,
        source: "BCE",
      };
      setIndice(mockData);
      setFormData(mockData);
    } else if (id === "3") {
      const mockData = {
        id: "3",
        name: "Or",
        symbol: "XAU/USD",
        value: "2025.50",
        change: "+15.20",
        changePercent: "+0.75%",
        isPositive: true,
        lastUpdate: new Date().toISOString(),
        description: "Prix de l'or en dollars US par once troy",
        category: "commodity" as const,
        unit: "USD/oz",
        source: "COMEX",
      };
      setIndice(mockData);
      setFormData(mockData);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulation d'API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mettre à jour isPositive basé sur le change
      const updatedData = {
        ...formData,
        isPositive: parseFloat(formData.change) >= 0,
        lastUpdate: new Date().toISOString(),
      };

      setFormData(updatedData);
      setIndice(updatedData);
      setSaveSuccess(true);

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      brvm: BarChart3,
      commodity: Globe,
      economic: DollarSign,
    };
    return icons[category as keyof typeof icons] || BarChart3;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      brvm: "bg-green-100 text-green-800 border-green-200",
      commodity: "bg-orange-100 text-orange-800 border-orange-200",
      economic: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const CategoryIcon = getCategoryIcon(formData.category);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/indices")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux indices
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <CategoryIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Modifier l'indice
                </h1>
                <p className="text-gray-600">
                  ID: {id} - {formData.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/indices"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Eye className="w-4 h-4" />
              Voir sur le site
            </a>
          </div>
        </div>

        {/* Messages de statut */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                Modifications sauvegardées
              </h3>
              <p className="text-green-700 text-sm">
                L'indice a été mis à jour avec succès.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5" />
                  Informations de l'indice
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'indice *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symbole *
                    </label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Valeurs et variations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur actuelle *
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variation absolue
                    </label>
                    <input
                      type="text"
                      value={formData.change}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          change: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: +4.28 ou -2.15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variation en %
                    </label>
                    <input
                      type="text"
                      value={formData.changePercent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          changePercent: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: +2.3% ou -1.5%"
                    />
                  </div>
                </div>

                {/* Catégorie et métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as any,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="brvm">BRVM & Bourse</option>
                      <option value="commodity">Matières Premières</option>
                      <option value="economic">Indicateurs Économiques</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={formData.source || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          source: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: BRVM, COMEX, BCEAO"
                    />
                  </div>
                </div>

                {/* Unité (pour les commodités) */}
                {formData.category === "commodity" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité
                    </label>
                    <input
                      type="text"
                      value={formData.unit || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: USD/oz, cents/livre, USD/baril"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Description détaillée de l'indice pour aider les utilisateurs"
                  />
                </div>

                {/* Guide d'aide */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-blue-800 text-sm">
                      <p className="font-medium mb-1">
                        💡 Conseils pour la modification :
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • <strong>Variation positive :</strong> Utilisez +
                          devant le nombre (ex: +2.5)
                        </li>
                        <li>
                          • <strong>Variation négative :</strong> Utilisez -
                          devant le nombre (ex: -1.2)
                        </li>
                        <li>
                          • <strong>Valeur :</strong> Utilisez des points pour
                          les décimales (ex: 185.42)
                        </li>
                        <li>
                          • <strong>Description :</strong> Expliquez l'impact
                          économique pour les débutants
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/indices")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Panneau de prévisualisation */}
          <div className="space-y-6">
            {/* Aperçu de l'indice */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aperçu
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-6 h-6 text-gray-600" />
                  <div>
                    <h4 className="font-semibold text-lg">{formData.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium border ${getCategoryColor(formData.category)}`}
                    >
                      {formData.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-center py-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formData.value}
                    {formData.unit && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({formData.unit})
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center justify-center gap-1 font-semibold ${
                      parseFloat(formData.change) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {parseFloat(formData.change) >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{formData.change}</span>
                    <span>({formData.changePercent})</span>
                  </div>
                </div>

                {formData.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {formData.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  {formData.source && <div>Source: {formData.source}</div>}
                  <div>Symbole: {formData.symbol}</div>
                  <div>Dernière MAJ: {new Date().toLocaleString("fr-FR")}</div>
                </div>
              </div>
            </div>

            {/* Historique (simulation) */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Modifications récentes
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Valeur mise à jour</span>
                  <span className="text-gray-500">Il y a 2 min</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Description modifiée</span>
                  <span className="text-gray-500">Il y a 1h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Indice créé</span>
                  <span className="text-gray-500">Il y a 2 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
