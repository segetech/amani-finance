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
  BarChart3,
  Globe,
  DollarSign,
  AlertCircle,
  Eye,
  RefreshCw,
  HelpCircle,
  Info
} from "lucide-react";

interface IndexData {
  id: string;
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
  description: string;
  category: 'brvm' | 'commodity' | 'economic';
  unit?: string;
  source?: string;
}

export default function IndicesManagement() {
  const [indices, setIndices] = React.useState<IndexData[]>([
    {
      id: "1",
      name: "BRVM Composite",
      symbol: "BRVM",
      value: "185.42",
      change: "+4.28",
      changePercent: "+2.3%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      description: "Indice principal de la Bourse Régionale des Valeurs Mobilières",
      category: "brvm",
      source: "BRVM"
    },
    {
      id: "2",
      name: "FCFA/EUR",
      symbol: "XOF/EUR",
      value: "655.957",
      change: "0",
      changePercent: "0%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      description: "Taux de change Franc CFA / Euro",
      category: "economic",
      source: "BCE"
    },
    {
      id: "3",
      name: "Or",
      symbol: "XAU/USD",
      value: "2025.50",
      change: "+15.20",
      changePercent: "+0.75%",
      isPositive: true,
      lastUpdate: new Date().toISOString(),
      description: "Prix de l'or en dollars US par once troy",
      category: "commodity",
      unit: "USD/oz",
      source: "COMEX"
    }
  ]);

  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<IndexData>>({});
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous les indices', icon: BarChart3, color: 'blue' },
    { id: 'brvm', name: 'BRVM & Bourse', icon: TrendingUp, color: 'green' },
    { id: 'commodity', name: 'Matières Premières', icon: Globe, color: 'orange' },
    { id: 'economic', name: 'Indicateurs Économiques', icon: DollarSign, color: 'purple' }
  ];

  const filteredIndices = selectedCategory === 'all' 
    ? indices 
    : indices.filter(index => index.category === selectedCategory);

  const startEdit = (index: IndexData) => {
    setIsEditing(index.id);
    setEditForm(index);
  };

  const saveEdit = () => {
    if (isEditing && editForm) {
      // Calculer automatiquement les valeurs dérivées
      const updatedForm = calculateDerivedValues(editForm);

      setIndices(prev => prev.map(index =>
        index.id === isEditing
          ? { ...index, ...updatedForm, lastUpdate: new Date().toISOString() }
          : index
      ));
      setIsEditing(null);
      setEditForm({});
    }
  };

  const calculateDerivedValues = (formData: Partial<IndexData>) => {
    const result = { ...formData };

    // Calculer automatiquement le pourcentage si on a la valeur et la variation
    if (formData.value && formData.change) {
      const currentValue = parseFloat(formData.value);
      const changeValue = parseFloat(formData.change);

      if (!isNaN(currentValue) && !isNaN(changeValue) && currentValue > 0) {
        const percentage = (changeValue / (currentValue - changeValue)) * 100;
        result.changePercent = `${changeValue >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
      }
    }

    // Déterminer automatiquement si c'est positif
    if (formData.change) {
      result.isPositive = parseFloat(formData.change) >= 0;
    }

    return result;
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const deleteIndex = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet indice ?')) {
      setIndices(prev => prev.filter(index => index.id !== id));
    }
  };

  const addNewIndex = () => {
    // Calculer automatiquement les valeurs dérivées
    const calculatedForm = calculateDerivedValues(editForm);

    const newIndex: IndexData = {
      id: Date.now().toString(),
      name: calculatedForm.name || '',
      symbol: calculatedForm.symbol || '',
      value: calculatedForm.value || '0',
      change: calculatedForm.change || '0',
      changePercent: calculatedForm.changePercent || '0%',
      isPositive: calculatedForm.isPositive ?? parseFloat(calculatedForm.change || '0') >= 0,
      lastUpdate: new Date().toISOString(),
      description: calculatedForm.description || '',
      category: calculatedForm.category || 'brvm',
      unit: calculatedForm.unit,
      source: calculatedForm.source
    };

    setIndices(prev => [...prev, newIndex]);
    setShowAddForm(false);
    setEditForm({});
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      brvm: 'bg-green-100 text-green-800',
      commodity: 'bg-orange-100 text-orange-800',
      economic: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      brvm: TrendingUp,
      commodity: Globe,
      economic: DollarSign
    };
    return icons[category as keyof typeof icons] || BarChart3;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Gestion des Indices
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez tous les indices, matières premières et indicateurs économiques affichés sur votre site
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Ajouter un indice
          </button>
        </div>

        {/* Guide complet pour débutants */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                💡 Comment fonctionnent les indices économiques - Guide complet
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">🎯 Qu'est-ce qu'un indice ?</h4>
                  <div className="text-blue-800 space-y-2">
                    <p><strong>📊 BRVM Composite :</strong> Thermomètre de la bourse ouest-africaine. Si il monte = entreprises vont bien, économie forte.</p>
                    <p><strong>🥇 Or/Argent :</strong> Prix des métaux précieux. Si ils montent = les gens cherchent la sécurité, possible crise.</p>
                    <p><strong>🛢️ Pétrole :</strong> Plus cher = transport coûteux, inflation sur tout le reste.</p>
                    <p><strong>🌾 Coton/Cacao :</strong> Important pour l'Afrique de l'Ouest. Prix élevé = plus de revenus pour les agriculteurs.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">⚙️ Comment ça marche ici ?</h4>
                  <div className="text-blue-800 space-y-2">
                    <p><strong>1. Valeur actuelle :</strong> Le prix maintenant (ex: 185.42 points pour BRVM)</p>
                    <p><strong>2. Variation :</strong> Combien ça a bougé (+4.28 = a monté de 4.28 points)</p>
                    <p><strong>3. Pourcentage :</strong> Le système calcule automatiquement (+2.3%)</p>
                    <p><strong>4. Couleur :</strong> Vert = hausse (bon), Rouge = baisse (attention)</p>
                    <p><strong>✏️ Modification :</strong> Changez juste la valeur et variation, le reste se calcule automatiquement !</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 Astuce :</strong> Vous n'avez qu'à mettre la nouvelle valeur et dire si ça a monté (+) ou baissé (-).
                  Le pourcentage se calcule tout seul !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {category.id === 'all' ? indices.length : indices.filter(i => i.category === category.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Liste des indices */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Indices actuels ({filteredIndices.length})
              </h2>
              <Link
                to="/indices"
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Eye className="w-4 h-4" />
                Voir sur le site
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredIndices.map(index => {
              const CategoryIcon = getCategoryIcon(index.category);
              const isEditingThis = isEditing === index.id;

              return (
                <div key={index.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Nom et catégorie */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="w-5 h-5 text-gray-600" />
                          <div>
                            {isEditingThis ? (
                              <input
                                type="text"
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                className="font-semibold text-lg border border-gray-300 rounded px-2 py-1 w-full"
                                placeholder="Nom de l'indice"
                              />
                            ) : (
                              <h3 className="font-semibold text-lg text-gray-900">{index.name}</h3>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(index.category)}`}>
                                {index.category.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">{index.symbol}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Valeur */}
                      <div className="text-center">
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editForm.value || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                            className="text-2xl font-bold border border-gray-300 rounded px-2 py-1 text-center w-24"
                          />
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">{index.value}</div>
                        )}
                        {index.unit && <div className="text-xs text-gray-500">{index.unit}</div>}
                      </div>

                      {/* Variation */}
                      <div className="text-center">
                        {isEditingThis ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editForm.change || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, change: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                              placeholder="+2.5"
                            />
                            <input
                              type="text"
                              value={editForm.changePercent || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, changePercent: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1 text-center w-20"
                              placeholder="+1.2%"
                            />
                          </div>
                        ) : (
                          <div className={`flex items-center justify-center gap-1 font-semibold ${
                            index.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {index.isPositive ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            <div>
                              <div>{index.change}</div>
                              <div className="text-sm">({index.changePercent})</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        {isEditingThis ? (
                          <textarea
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                            rows={2}
                            placeholder="Description de l'indice"
                          />
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600 line-clamp-2">{index.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              {index.source && <span>Source: {index.source}</span>}
                              <span>Mis à jour: {new Date(index.lastUpdate).toLocaleString('fr-FR')}</span>
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
                            onClick={() => startEdit(index)}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteIndex(index.id)}
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

          {filteredIndices.length === 0 && (
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun indice dans cette catégorie</h3>
              <p className="text-gray-600 mb-6">Commencez par ajouter votre premier indice.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un indice
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
                  <h2 className="text-2xl font-bold text-gray-900">Ajouter un nouvel indice</h2>
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
                    {categories.filter(c => c.id !== 'all').map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setEditForm(prev => ({ ...prev, category: category.id as any }))}
                          className={`p-4 border rounded-lg text-left transition-colors ${
                            editForm.category === category.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-2 text-blue-600" />
                          <div className="font-medium">{category.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'indice *
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: BRVM Composite, Or, USD/FCFA"
                    />
                  </div>

                  {/* Symbole */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symbole *
                    </label>
                    <input
                      type="text"
                      value={editForm.symbol || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, symbol: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: BRVM, XAU/USD, USD/XOF"
                    />
                  </div>

                  {/* Valeur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur actuelle *
                    </label>
                    <input
                      type="text"
                      value={editForm.value || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 185.42, 2025.50"
                    />
                  </div>

                  {/* Variation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variation
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.change || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, change: e.target.value }))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+4.28"
                      />
                      <input
                        type="text"
                        value={editForm.changePercent || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, changePercent: e.target.value }))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+2.3%"
                      />
                    </div>
                  </div>

                  {/* Unité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité
                    </label>
                    <input
                      type="text"
                      value={editForm.unit || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: USD/oz, cents/livre, points"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={editForm.source || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: BRVM, COMEX, BCEAO"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description de l'indice pour aider les utilisateurs à comprendre"
                  />
                </div>

                {/* Note d'aide */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-yellow-800 text-sm">
                      <p className="font-medium mb-1">💡 Conseils pour débutants :</p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Variation positive :</strong> Utilisez + devant le nombre (ex: +2.5)</li>
                        <li>• <strong>Variation négative :</strong> Utilisez - devant le nombre (ex: -1.2)</li>
                        <li>• <strong>Description :</strong> Expliquez simplement ce que représente cet indice</li>
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
                  onClick={addNewIndex}
                  disabled={!editForm.name || !editForm.symbol || !editForm.value}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter l'indice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
