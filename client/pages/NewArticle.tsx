import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import ImageUpload from "../components/ImageUpload";
import {
  Save,
  Eye,
  Calendar,
  Tag,
  Globe,
  FileText,
  User,
} from "lucide-react";

export default function NewArticle() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Économie",
    country: "Mali",
    tags: "",
    publishDate: new Date().toISOString().split("T")[0],
    status: "draft",
    readTime: 5,
  });

  // Check permissions
  if (!user || !hasPermission("create_articles")) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Vous n'avez pas les permissions nécessaires"
      >
        <div className="flex items-center justify-center py-12">
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
      </DashboardLayout>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      error("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const action = status === "published" ? "publié" : "sauvegardé";
      success("Article " + action, `L'article "${formData.title}" a été ${action} avec succès`);
      
      // Redirect after successful save
      setTimeout(() => {
        navigate("/dashboard/articles");
      }, 1000);
    } catch (err) {
      error("Erreur", "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = (file: File | null) => {
    setCoverImage(file);
  };

  const categories = [
    "Économie",
    "Marché",
    "Industrie",
    "Investissement",
    "Tech",
    "Insights",
    "Politique monétaire"
  ];

  const countries = [
    "Mali",
    "Burkina Faso",
    "Niger",
    "Tchad",
    "Mauritanie",
    "Côte d'Ivoire",
    "Sénégal",
    "Guinée"
  ];

  return (
    <DashboardLayout
      title={isPreview ? "Aperçu de l'article" : "Créer un nouvel article"}
      subtitle={isPreview ? "Vérifiez le rendu de votre article" : "Rédigez un article pour informer votre audience"}
      actions={
        <>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isPreview ? "Modifier" : "Aperçu"}
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Sauvegarde..." : "Brouillon"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {isSaving ? "Publication..." : "Publier"}
          </button>
        </>
      }
    >
      <div className="max-w-4xl mx-auto">
        {!isPreview ? (
          /* Formulaire d'édition */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Donnez un titre accrocheur à votre article"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Résumé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résumé/Extrait *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Rédigez un résumé captivant qui donnera envie de lire l'article complet..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  Ce résumé sera affiché en premier aux lecteurs. Gardez-le informatif mais concis.
                </div>
              </div>

              {/* Métadonnées */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Pays
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
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
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de publication
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image de couverture */}
              <ImageUpload
                onImageSelect={handleImageSelect}
                className="mb-6"
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="économie, mali, fcfa, analyse"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>

              {/* Temps de lecture estimé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps de lecture estimé (minutes)
                </label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  className="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>

              {/* Contenu complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu complet de l'article *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Rédigez le contenu détaillé de l'article. Ce contenu sera affiché après que le lecteur clique sur 'Lire l'article complet'..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  Vous pouvez utiliser du Markdown pour le formatage. Ce contenu sera visible uniquement quand le lecteur choisit de lire l'article complet.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Aperçu */
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
                  {new Date(formData.publishDate).toLocaleDateString("fr-FR")}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              
              {coverImage && (
                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Aperçu couverture"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <h1 className="text-3xl font-bold text-amani-primary mb-4">
                {formData.title || "Titre de l'article"}
              </h1>

              {/* Résumé avec style */}
              <div className="bg-amani-secondary/10 border-l-4 border-amani-primary p-6 rounded-r-lg mb-6">
                <h3 className="text-lg font-semibold text-amani-primary mb-3 flex items-center gap-2">
                  📋 Résumé de l'article
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {formData.excerpt || "Votre résumé apparaîtra ici..."}
                </p>
              </div>

              <div className="mb-6">
                <button className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg font-medium">
                  Lire l'article complet
                </button>
              </div>

              {formData.content && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-amani-primary mb-4">
                    📖 Article complet
                  </h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    {formData.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {formData.tags && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
