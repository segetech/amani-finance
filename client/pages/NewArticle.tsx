import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Calendar,
  Tag,
  Globe,
  FileText,
  User,
} from "lucide-react";

export default function NewArticle() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Économie",
    country: "Mali",
    tags: "",
    publishDate: new Date().toISOString().split("T")[0],
    status: "draft",
    featured: false,
  });

  // Check permissions
  if (!user || !hasPermission("create_articles")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour créer des articles.
          </p>
          <Link
            to="/dashboard"
            className="bg-amani-primary text-white px-6 py-2 rounded-lg hover:bg-amani-primary/90 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Saving article:", {
      ...formData,
      status,
      author: `${user.firstName} ${user.lastName}`,
      createdAt: new Date().toISOString(),
    });

    setIsSaving(false);
    navigate("/dashboard");
  };

  const categories = [
    "Économie",
    "Marché",
    "Industrie",
    "Investissement",
    "Tech",
    "Politique",
    "Analyse",
  ];

  const countries = [
    "Mali",
    "Burkina Faso",
    "Niger",
    "Tchad",
    "Mauritanie",
    "Sénégal",
    "UEMOA",
    "Régional",
  ];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-amani-primary mb-2">
                Nouvel Article
              </h1>
              <p className="text-gray-600">
                Créer un nouveau contenu pour la plateforme Amani
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-amani-primary text-amani-primary rounded-lg hover:bg-amani-secondary/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "Éditer" : "Aperçu"}
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Brouillon
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {isSaving ? "Publication..." : "Publier"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!isPreview ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'article *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Entrez le titre de l'article..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résumé *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Résumé court de l'article (visible dans les listes)..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu de l'article *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Rédigez le contenu complet de l'article..."
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                      required
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      Vous pouvez utiliser Markdown pour le formatage.
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image de couverture
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amani-primary transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Glissez une image ici ou cliquez pour sélectionner
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG ou WebP (max. 5MB)
                      </p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Preview */
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {formData.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {formData.country}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(formData.publishDate).toLocaleDateString(
                        "fr-FR",
                      )}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-amani-primary mb-4">
                    {formData.title || "Titre de l'article"}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>

                {formData.excerpt && (
                  <div className="bg-amani-secondary/30 p-4 rounded-lg mb-6">
                    <h2 className="font-semibold text-amani-primary mb-2">
                      Ce qu'il faut retenir
                    </h2>
                    <p className="text-gray-700">{formData.excerpt}</p>
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  {formData.content ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {formData.content}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Le contenu de l'article apparaîtra ici...
                    </p>
                  )}
                </div>

                {formData.tags && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-amani-primary mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
              <h2 className="text-lg font-semibold text-amani-primary mb-4">
                Paramètres
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays/Région
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="économie, sahel, croissance..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Article à la une
                  </label>
                </div>
              </div>
            </div>

            {/* Publishing Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/50">
              <h2 className="text-lg font-semibold text-amani-primary mb-4">
                Informations
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="font-medium text-amani-primary">
                    Brouillon
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auteur:</span>
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créé:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mots:</span>
                  <span className="font-medium">
                    {formData.content.split(" ").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
