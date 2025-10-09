import { useState } from 'react';
import { useCommodities } from '../../hooks/useCommodities';
import {
  TrendingUp,
  TrendingDown,
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
  Filter,
  RefreshCw,
  Eye,
  LineChart as LineChartIcon,
  BarChart3,
} from 'lucide-react';

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

interface CommoditiesSectionProps {
  showTitle?: boolean;
  maxItems?: number;
  showFilters?: boolean;
}

export default function CommoditiesSection({ 
  showTitle = true, 
  maxItems = 8,
  showFilters = true 
}: CommoditiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllCommodities, setShowAllCommodities] = useState(false);

  const { 
    commodities, 
    loading, 
    error, 
    fetchCommodities, 
    getCategories,
    getCommoditiesByCategory 
  } = useCommodities({
    is_active: true,
    show_on_homepage: true
  });

  const categories = getCategories();
  const commoditiesByCategory = getCommoditiesByCategory();

  // Filtrer les matières premières selon la catégorie sélectionnée
  const filteredCommodities = selectedCategory === 'all' 
    ? commodities 
    : commodities.filter(c => c.category === selectedCategory);

  // Limiter l'affichage
  const displayedCommodities = showAllCommodities 
    ? filteredCommodities 
    : filteredCommodities.slice(0, maxItems);

  const handleRefresh = () => {
    fetchCommodities();
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) {
      return BarChart3;
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Erreur lors du chargement des matières premières: {error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary mb-4 lg:mb-0 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Matières Premières
            </h2>
            
            {showFilters && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Actualisation...' : 'Actualiser'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Résumé par catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(commoditiesByCategory).map(([category, items]) => {
            const gainers = items.filter(item => item.change_percent > 0).length;
            const losers = items.filter(item => item.change_percent < 0).length;
            
            return (
              <div key={category} className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                  <div className="text-2xl font-bold text-amani-primary">{items.length}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{gainers} ↗</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>{losers} ↘</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tableau des matières premières */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-amani-primary">
                  Cotations Matières Premières ({displayedCommodities.length}
                  {!showAllCommodities && filteredCommodities.length > maxItems ? ` sur ${filteredCommodities.length}` : ''})
                </h3>
                <p className="text-gray-600 mt-1">
                  Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
                  {loading && (
                    <span className="ml-2 text-blue-600 text-sm">
                      <RefreshCw className="w-4 h-4 inline animate-spin mr-1" />
                      Actualisation en cours...
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matière Première
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variation
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marché
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Haut/Bas
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedCommodities.map((commodity) => {
                  const IconComponent = getIconComponent(commodity.icon);
                  const isPositive = commodity.change_percent >= 0;
                  
                  return (
                    <tr key={commodity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <IconComponent className="w-5 h-5 text-amani-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
                            <div className="text-sm text-gray-500">
                              {commodity.symbol} • {commodity.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(commodity.current_price, commodity.unit)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {commodity.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {isPositive ? '+' : ''}{commodity.change_percent.toFixed(2)}%
                          </span>
                        </div>
                        <div className={`text-xs ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {isPositive ? '+' : ''}{commodity.change_amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {commodity.market || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-xs text-gray-900">
                          H: {commodity.daily_high?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          B: {commodity.daily_low?.toFixed(2) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="text-amani-primary hover:text-amani-primary/80 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Voir le graphique"
                          >
                            <LineChartIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bouton "Voir plus" */}
          {!showAllCommodities && filteredCommodities.length > maxItems && (
            <div className="p-6 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowAllCommodities(true)}
                className="px-6 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
              >
                Voir toutes les matières premières ({filteredCommodities.length})
              </button>
            </div>
          )}

          {showAllCommodities && filteredCommodities.length > maxItems && (
            <div className="p-6 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowAllCommodities(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Voir moins
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
