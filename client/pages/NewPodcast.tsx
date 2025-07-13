import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  ArrowLeft,
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
  const [newTopic, setNewTopic] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check permissions
  if (!user || !hasPermission("create_podcasts")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
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
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "audioFile") {
        setAudioFile(files[0]);
      } else if (name === "coverImage") {
        setCoverImage(files[0]);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addGuest = () => {
    if (newGuest.trim() && !formData.guests.includes(newGuest.trim())) {
      setFormData((prev) => ({
        ...prev,
        guests: [...prev.guests, newGuest.trim()],
      }));
      setNewGuest("");
    }
  };

  const removeGuest = (guestToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((guest) => guest !== guestToRemove),
    }));
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic !== topicToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    if (!audioFile) {
      newErrors.audioFile = "Le fichier audio est requis";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "La durée est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error(
        "Erreur de validation",
        "Veuillez corriger les erreurs dans le formulaire.",
      );
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const podcastData = {
      id: `podcast-${Date.now()}`,
      ...formData,
      audioFile: audioFile?.name,
      coverImage: coverImage?.name,
      createdAt: new Date().toISOString(),
      createdBy: `${user.firstName} ${user.lastName}`,
      plays: 0,
      likes: 0,
      comments: 0,
    };

    console.log("Creating podcast:", podcastData);

    success(
      "Podcast créé",
      `Le podcast "${formData.title}" a été ${
        formData.status === "published" ? "publié" : "sauvegardé en brouillon"
      } avec succès.`,
    );

    setIsSaving(false);
    navigate("/dashboard");
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const categories = [
    { value: "economie", label: "Économie" },
    { value: "marche", label: "Marché financier" },
    { value: "industrie", label: "Industrie" },
    { value: "tech", label: "Technologie" },
    { value: "politique", label: "Politique" },
    { value: "interview", label: "Interview" },
    { value: "analyse", label: "Analyse" },
  ];

  const countries = [
    { value: "mali", label: "Mali" },
    { value: "burkina", label: "Burkina Faso" },
    { value: "niger", label: "Niger" },
    { value: "tchad", label: "Tchad" },
    { value: "mauritanie", label: "Mauritanie" },
    { value: "senegal", label: "Sénégal" },
    { value: "regional", label: "Régional" },
  ];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Nouveau podcast
              </h1>
              <p className="text-gray-600">
                Créez et publiez un nouvel épisode de podcast
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Brouillon automatique activé</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Informations de base
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du podcast *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ex: Économie du Sahel - Épisode 15"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
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
                  Numéro d'épisode
                </label>
                <input
                  type="number"
                  name="episodeNumber"
                  value={formData.episodeNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saison
                </label>
                <input
                  type="number"
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                    errors.duration ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="45:32"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.duration}
                  </p>
                )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Description de l'épisode, sujets abordés, points clés..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Media Files */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Fichiers média
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier audio *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amani-primary transition-colors">
                  <input
                    type="file"
                    name="audioFile"
                    onChange={handleFileChange}
                    accept="audio/*"
                    className="hidden"
                    id="audioFile"
                  />
                  <label htmlFor="audioFile" className="cursor-pointer">
                    <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600">
                      {audioFile ? (
                        <div className="text-amani-primary font-medium">
                          {audioFile.name}
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">
                            Cliquez pour télécharger
                          </span>{" "}
                          ou glissez votre fichier audio
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      MP3, WAV, M4A jusqu'à 500MB
                    </div>
                  </label>
                </div>
                {errors.audioFile && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.audioFile}
                  </p>
                )}

                {audioFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlayback}
                          className="w-10 h-10 bg-amani-primary text-white rounded-full flex items-center justify-center hover:bg-amani-primary/90 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <div className="font-medium text-sm">
                            Prévisualisation
                          </div>
                          <div className="text-xs text-gray-500">
                            {audioFile.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amani-primary transition-colors">
                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="coverImage"
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
                    {coverImage ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(coverImage)}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg mx-auto"
                        />
                        <div className="text-sm text-amani-primary font-medium">
                          {coverImage.name}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            Cliquez pour télécharger
                          </span>{" "}
                          une image
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          JPG, PNG jusqu'à 10MB
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Métadonnées
              </h2>
            </div>

            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amani-secondary/20 text-amani-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-amani-primary/60 hover:text-amani-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invités
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    placeholder="Nom de l'invité"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addGuest())
                    }
                  />
                  <button
                    type="button"
                    onClick={addGuest}
                    className="px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.guests.map((guest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Users className="w-3 h-3" />
                      {guest}
                      <button
                        type="button"
                        onClick={() => removeGuest(guest)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujets abordés
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Sujet principal"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTopic())
                    }
                  />
                  <button
                    type="button"
                    onClick={addTopic}
                    className="px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcription (optionnel)
                </label>
                <textarea
                  name="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  placeholder="Transcription complète de l'épisode..."
                />
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-amani-primary" />
              <h2 className="text-xl font-semibold text-amani-primary">
                Options de publication
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Statut de publication
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.status === "draft"
                        ? "border-amani-primary bg-amani-secondary/20"
                        : "border-gray-200 hover:border-amani-primary/50"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "draft" }))
                    }
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === "draft"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amani-primary focus:ring-amani-primary"
                      />
                      <div>
                        <div className="font-medium text-amani-primary flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          Brouillon
                        </div>
                        <div className="text-sm text-gray-600">
                          Sauvegarder sans publier
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.status === "published"
                        ? "border-amani-primary bg-amani-secondary/20"
                        : "border-gray-200 hover:border-amani-primary/50"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "published" }))
                    }
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === "published"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amani-primary focus:ring-amani-primary"
                      />
                      <div>
                        <div className="font-medium text-amani-primary flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Publier maintenant
                        </div>
                        <div className="text-sm text-gray-600">
                          Rendre visible au public
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Link
              to="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {formData.status === "published"
                    ? "Publication..."
                    : "Sauvegarde..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {formData.status === "published"
                    ? "Publier le podcast"
                    : "Sauvegarder le brouillon"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
