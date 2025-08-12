import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import ImageUpload from "../components/ImageUpload";
import {
  Save,
  Mic,
  Upload,
  Play,
  Pause,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Tag,
  Globe,
  Users,
  Plus,
  X,
  FileAudio,
} from "lucide-react";

export default function NewPodcast() {
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "economie",
    country: "mali",
    tags: [] as string[],
    publishDate: new Date().toISOString().split("T")[0],
    status: "draft",
    duration: "",
    episodeNumber: "",
    season: "1",
    transcript: "",
    guests: [] as string[],
    topics: [] as string[],
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newGuest, setNewGuest] = useState("");

  // Check permissions
  if (!user || !hasPermission("create_podcasts")) {
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
              Vous n'avez pas les permissions nécessaires pour créer des podcasts.
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

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      // Auto-detect duration if possible
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        setFormData(prev => ({
          ...prev,
          duration: `${minutes}`
        }));
      };
    } else {
      error("Erreur", "Veuillez sélectionner un fichier audio valide");
    }
  };

  const handleImageSelect = (file: File | null) => {
    setCoverImage(file);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addGuest = () => {
    if (newGuest.trim() && !formData.guests.includes(newGuest.trim())) {
      setFormData(prev => ({
        ...prev,
        guests: [...prev.guests, newGuest.trim()]
      }));
      setNewGuest("");
    }
  };

  const removeGuest = (guestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter(guest => guest !== guestToRemove)
    }));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title || !formData.description || !audioFile) {
      error("Erreur", "Veuillez remplir tous les champs obligatoires et sélectionner un fichier audio");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const action = status === "published" ? "publié" : "sauvegardé";
      success("Podcast " + action, `Le podcast "${formData.title}" a été ${action} avec succès`);
      
      // Redirect after successful save
      setTimeout(() => {
        navigate("/dashboard/podcasts");
      }, 1000);
    } catch (err) {
      error("Erreur", "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlayPreview = () => {
    setIsPlaying(!isPlaying);
  };

  const categories = [
    { value: "economie", label: "Économie" },
    { value: "marche", label: "Marché" },
    { value: "industrie", label: "Industrie" },
    { value: "tech", label: "Tech" },
    { value: "politique", label: "Politique" },
    { value: "interview", label: "Interview" },
    { value: "analyse", label: "Analyse" }
  ];

  const countries = [
    { value: "mali", label: "Mali" },
    { value: "burkina", label: "Burkina Faso" },
    { value: "niger", label: "Niger" },
    { value: "tchad", label: "Tchad" },
    { value: "mauritanie", label: "Mauritanie" },
    { value: "senegal", label: "Sénégal" },
    { value: "cote_ivoire", label: "Côte d'Ivoire" }
  ];

  return (
    <DashboardLayout
      title={isPreviewMode ? "Aperçu du podcast" : "Créer un nouveau podcast"}
      subtitle={isPreviewMode ? "Vérifiez le rendu de votre podcast" : "Enregistrez et partagez vos analyses audio"}
      actions={
        <>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewMode ? "Modifier" : "Aperçu"}
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
            <Mic className="w-4 h-4" />
            {isSaving ? "Publication..." : "Publier"}
          </button>
        </>
      }
    >
      <div className="max-w-4xl mx-auto">
        {!isPreviewMode ? (
          /* Formulaire d'édition */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du podcast *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Donnez un titre captivant à votre podcast"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Métadonnées */}
              <div className="grid md:grid-cols-4 gap-4">
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
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
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
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Épisode #
                  </label>
                  <input
                    type="number"
                    name="episodeNumber"
                    value={formData.episodeNumber}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Durée (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du podcast *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez le contenu de votre podcast, les sujets abordés..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Fichier audio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier audio *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amani-primary transition-colors">
                  {audioFile ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileAudio className="w-8 h-8 text-amani-primary" />
                      <div>
                        <p className="font-medium text-gray-900">{audioFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAudioFile(null)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Sélectionnez votre fichier audio
                      </p>
                      <p className="text-sm text-gray-500">
                        MP3, WAV, M4A (max. 100MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileSelect}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="mt-4 inline-block px-4 py-2 bg-amani-primary text-white rounded-lg cursor-pointer hover:bg-amani-primary/90 transition-colors"
                  >
                    {audioFile ? "Changer le fichier" : "Choisir un fichier"}
                  </label>
                </div>
              </div>

              {/* Image de couverture */}
              <ImageUpload
                onImageSelect={handleImageSelect}
                className="mb-6"
              />

              {/* Invités */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Invités
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    placeholder="Nom de l'invité"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
                  />
                  <button
                    type="button"
                    onClick={addGuest}
                    className="px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.guests.map((guest, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {guest}
                      <button
                        type="button"
                        onClick={() => removeGuest(guest)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un mot-clé"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Date de publication */}
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
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Aperçu */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="mb-6">
              {/* En-tête avec métadonnées */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(c => c.value === formData.category)?.label}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {countries.find(c => c.value === formData.country)?.label}
                </span>
                {formData.episodeNumber && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Épisode {formData.episodeNumber}
                  </span>
                )}
                {formData.duration && (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formData.duration} min
                  </span>
                )}
              </div>

              {/* Image de couverture */}
              {coverImage && (
                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Aperçu couverture"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Titre */}
              <h1 className="text-3xl font-bold text-amani-primary mb-4">
                {formData.title || "Titre du podcast"}
              </h1>

              {/* Lecteur audio simulé */}
              {audioFile && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPreview}
                      className="w-12 h-12 bg-amani-primary text-white rounded-full flex items-center justify-center hover:bg-amani-primary/90 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {audioFile.name}
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div className="bg-amani-primary h-2 rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.duration}:00
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {formData.description || "Votre description apparaîtra ici..."}
                </p>
              </div>

              {/* Invités */}
              {formData.guests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Invités
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.guests.map((guest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Mots-clés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Métadonnées de publication */}
              <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Publié le {new Date(formData.publishDate).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Par {user?.firstName} {user?.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
