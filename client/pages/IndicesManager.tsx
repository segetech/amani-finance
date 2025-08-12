import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  Globe,
  Building,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  RefreshCw,
  Database,
  FileSpreadsheet,
  Share2,
} from "lucide-react";

export default function IndicesManager() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);

  // Check permissions
  if (!user || (!hasPermission("view_indices") && !hasPermission("create_indices"))) {
    return (
      <DashboardLayout title="Accès refusé">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour gérer les indices économiques.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Mock data - in real app would come from API
  const indices = [
    {
      id: "1",
      name: "Taux directeur BCEAO",
      code: "BCEAO_RATE",
      category: "monetary",
      country: "uemoa",
      currency: "XOF",
      unit: "percent",
      frequency: "monthly",
      currentValue: "3.50",
      previousValue: "3.25",
      changePercent: "7.69",
      changeDirection: "up",
      lastUpdated: "2024-01-15",
      source: "BCEAO",
      status: "published",
      isPublic: true,
      description: "Taux directeur de la Banque Centrale des États de l'Afrique de l'Ouest",
      views: 12450,
      subscribers: 890,
    },
    {
      id: "2", 
      name: "BRVM Composite",
      code: "BRVM_COMP",
      category: "market",
      country: "regional",
      currency: "XOF",
      unit: "index",
      frequency: "daily",
      currentValue: "185.42",
      previousValue: "181.25",
      changePercent: "2.30",
      changeDirection: "up",
      lastUpdated: "2024-01-15",
      source: "BRVM",
      status: "published",
      isPublic: true,
      description: "Indice composite de la Bourse Régionale des Valeurs Mobilières",
      views: 8920,
      subscribers: 1250,
    },
    {
      id: "3",
      name: "Inflation Mali",
      code: "MALI_INF",
      category: "inflation",
      country: "mali",
      currency: "XOF",
      unit: "percent",
      frequency: "monthly",
      currentValue: "4.20",
      previousValue: "3.80",
      changePercent: "10.53",
      changeDirection: "up",
      lastUpdated: "2024-01-12",
      source: "INSTAT Mali",
      status: "published",
      isPublic: true,
      description: "Taux d'inflation annuel au Mali",
      views: 5630,
      subscribers: 420,
    },
    {
      id: "4",
      name: "PIB Burkina Faso",
      code: "BF_GDP",
      category: "gdp",
      country: "burkina",
      currency: "XOF",
      unit: "billions",
      frequency: "quarterly",
      currentValue: "9870.5",
      previousValue: "9654.2",
      changePercent: "2.24",
      changeDirection: "up",
      lastUpdated: "2024-01-10",
      source: "INSD Burkina",
      status: "draft",
      isPublic: false,
      description: "Produit Intérieur Brut du Burkina Faso",
      views: 3240,
      subscribers: 185,
    },
    {
      id: "5",
      name: "Cours de l'or",
      code: "GOLD_PRICE",
      category: "mining",
      country: "regional",
      currency: "USD",
      unit: "dollars",
      frequency: "daily",
      currentValue: "2045.80",
      previousValue: "2038.50",
      changePercent: "0.36",
      changeDirection: "up",
      lastUpdated: "2024-01-15",
      source: "London Bullion Market",
      status: "published",
      isPublic: true,
      description: "Prix de l'once d'or sur le marché international",
      views: 15620,
      subscribers: 2100,
    },
  ];

  const stats = {
    total: indices.length,
    published: indices.filter(i => i.status === "published").length,
    draft: indices.filter(i => i.status === "draft").length,
    totalViews: indices.reduce((sum, i) => sum + i.views, 0),
    totalSubscribers: indices.reduce((sum, i) => sum + i.subscribers, 0),
    upTrending: indices.filter(i => i.changeDirection === "up").length,
  };

  const categories = [
    { value: "monetary", label: "Politique monétaire" },
    { value: "market", label: "Marchés financiers" },
    { value: "inflation", label: "Inflation" },
    { value: "gdp", label: "PIB et croissance" },
    { value: "employment", label: "Emploi" },
    { value: "trade", label: "Commerce extérieur" },
    { value: "agriculture", label: "Agriculture" },
    { value: "mining", label: "Mines et ressources" },
    { value: "energy", label: "Énergie" },
  ];

  const countries = [
    { value: "mali", label: "Mali" },
    { value: "burkina", label: "Burkina Faso" },
    { value: "niger", label: "Niger" },
    { value: "tchad", label: "Tchad" },
    { value: "mauritanie", label: "Mauritanie" },
    { value: "senegal", label: "Sénégal" },
    { value: "uemoa", label: "UEMOA" },
    { value: "regional", label: "Régional" },
  ];

  const handleIndiceSelect = (indiceId: string) => {
    setSelectedIndices(prev => 
      prev.includes(indiceId)
        ? prev.filter(id => id !== indiceId)
        : [...prev, indiceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIndices(
      selectedIndices.length === filteredIndices.length 
        ? [] 
        : filteredIndices.map(i => i.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIndices.length === 0) {
      error("Erreur", "Aucun indice sélectionné");
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (action) {
      case "publish":
        success("Indices publiés", `${selectedIndices.length} indice(s) publié(s)`);
        break;
      case "unpublish":
        warning("Indices dépubliés", `${selectedIndices.length} indice(s) dépublié(s)`);
        break;
      case "export":
        success("Export réussi", `${selectedIndices.length} indice(s) exporté(s)`);
        break;
      case "delete":
        error("Indices supprimés", `${selectedIndices.length} indice(s) supprimé(s)`);
        break;
    }
    setSelectedIndices([]);
  };

  const handleDeleteIndice = async (indiceId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet indice ?")) {
      await new Promise(resolve => setTimeout(resolve, 500));
      error("Indice supprimé", "L'indice a été supprimé avec succès");
    }
  };

  const handleUpdateIndice = async (indiceId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    success("Indice mis à jour", "L'indice a été actualisé avec les dernières données");
  };

  const filteredIndices = indices.filter(indice => {
    const matchesSearch = indice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || indice.category === filterCategory;
    const matchesCountry = filterCountry === "all" || indice.country === filterCountry;
    const matchesStatus = filterStatus === "all" || indice.status === filterStatus;
    return matchesSearch && matchesCategory && matchesCountry && matchesStatus;
  });

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCountryLabel = (country: string) => {
    return countries.find(c => c.value === country)?.label || country;
  };

  return (
    <DashboardLayout
      title="Indices économiques"
      subtitle="Gérez et suivez les indicateurs économiques de la région"
      actions={
        hasPermission("create_indices") && (
          <Link
            to="/dashboard/indices/new"
            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel indice
          </Link>
        )
      }
    >
      <div className="space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total indices</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.upTrending}
            </div>
            <div className="text-sm text-gray-600">En hausse</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Vues totales</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Database className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amani-primary mb-1">
              {stats.totalSubscribers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Abonnés</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un indice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Tous les pays</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIndices.length > 0 && (
          <div className="bg-amani-primary text-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedIndices.length} indice(s) sélectionné(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasPermission("publish_indices") && (
                  <button
                    onClick={() => handleBulkAction("publish")}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Publier
                  </button>
                )}
                {hasPermission("export_indices") && (
                  <button
                    onClick={() => handleBulkAction("export")}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Exporter
                  </button>
                )}
                <button
                  onClick={() => handleBulkAction("unpublish")}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Dépublier
                </button>
                {hasPermission("delete_indices") && (
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Indices List */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-amani-primary">
                Indices ({filteredIndices.length})
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIndices.length === filteredIndices.length && filteredIndices.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                  />
                  Tout sélectionner
                </label>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredIndices.map((indice) => (
              <div key={indice.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIndices.includes(indice.id)}
                    onChange={() => handleIndiceSelect(indice.id)}
                    className="mt-2 h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-amani-primary">
                            {indice.name}
                          </h4>
                          <code className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {indice.code}
                          </code>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(indice.status)}`}>
                            {indice.status === "published" ? "Publié" : "Brouillon"}
                          </span>
                          {!indice.isPublic && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                              Privé
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {indice.description}
                        </p>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getTrendColor(indice.changeDirection)}`}>
                        {getTrendIcon(indice.changeDirection)}
                        <span className="font-bold text-lg">
                          {indice.currentValue}
                        </span>
                        {indice.unit === "percent" && <span>%</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Variation:</span>
                        <div className={`font-medium ${indice.changeDirection === "up" ? "text-green-600" : indice.changeDirection === "down" ? "text-red-600" : "text-gray-600"}`}>
                          {indice.changeDirection === "up" ? "+" : ""}{indice.changePercent}%
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Catégorie:</span>
                        <div className="font-medium">{getCategoryLabel(indice.category)}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Pays/Région:</span>
                        <div className="font-medium">{getCountryLabel(indice.country)}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Source:</span>
                        <div className="font-medium">{indice.source}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Mis à jour: {indice.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Fréquence: {indice.frequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {indice.views.toLocaleString()} vues
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        {indice.subscribers} abonnés
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Valeur précédente: <span className="font-medium">{indice.previousValue}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateIndice(indice.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Refresh className="w-4 h-4" />
                        </button>
                        
                        {hasPermission("view_analytics") && (
                          <Link
                            to={`/dashboard/indices/${indice.id}/analytics`}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        )}
                        
                        {hasPermission("export_indices") && (
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPermission("edit_indices") && (
                          <Link
                            to={`/dashboard/indices/${indice.id}/edit`}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        {hasPermission("delete_indices") && (
                          <button
                            onClick={() => handleDeleteIndice(indice.id)}
                            className="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredIndices.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun indice trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all" || filterCountry !== "all" || filterStatus !== "all"
                ? "Essayez de modifier vos filtres de recherche."
                : "Commencez par créer votre premier indice économique."}
            </p>
            {hasPermission("create_indices") && (
              <Link
                to="/dashboard/indices/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer un indice
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
