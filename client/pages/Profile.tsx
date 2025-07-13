import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Building,
  MapPin,
  Phone,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Key,
  Globe,
  AlertCircle,
  CheckCircle,
  Settings,
  Activity,
  FileText,
  BarChart3,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    organization: user?.organization || "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    linkedIn: "",
    twitter: "",
  });

  const [preferences, setPreferences] = useState({
    sectors: user?.preferences?.sectors || [],
    countries: user?.preferences?.countries || [],
    newsletter: user?.preferences?.newsletter || false,
    alerts: user?.preferences?.alerts || false,
    emailNotifications: true,
    pushNotifications: true,
    language: "fr",
    timezone: "Africa/Bamako",
    publicProfile: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSectorToggle = (sector: string) => {
    setPreferences((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const handleCountryToggle = (country: string) => {
    setPreferences((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }));
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!profileData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Le mot de passe actuel est requis";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      error(
        "Erreur de validation",
        "Veuillez corriger les erreurs dans le formulaire.",
      );
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success("Profil mis à jour", "Vos informations ont été sauvegardées.");
    setIsSaving(false);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success(
      "Préférences mises à jour",
      "Vos préférences ont été sauvegardées.",
    );
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      error(
        "Erreur de validation",
        "Veuillez corriger les erreurs dans le formulaire.",
      );
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success("Mot de passe modifié", "Votre mot de passe a été mis à jour.");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsSaving(false);
  };

  const stats = [
    {
      label: "Articles lus",
      value: "47",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Analyses vues",
      value: "23",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      label: "Jours d'activité",
      value: "156",
      icon: Activity,
      color: "text-purple-600",
    },
    {
      label: "Alertes configurées",
      value: "8",
      icon: Bell,
      color: "text-amber-600",
    },
  ];

  const sectors = [
    "Marché financier",
    "Économie régionale",
    "Industrie minière",
    "Agriculture",
    "Investissement",
    "Technologie",
    "Politique monétaire",
    "Commerce international",
  ];

  const countries = [
    "Mali",
    "Burkina Faso",
    "Niger",
    "Tchad",
    "Mauritanie",
    "Sénégal",
    "UEMOA",
    "Tous",
  ];

  const tabs = [
    {
      id: "personal",
      name: "Informations personnelles",
      icon: User,
    },
    {
      id: "preferences",
      name: "Préférences",
      icon: Settings,
    },
    {
      id: "security",
      name: "Sécurité",
      icon: Shield,
    },
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
                Mon profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et préférences
              </p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-amani-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-amani-secondary rounded-full flex items-center justify-center text-amani-primary hover:bg-amani-secondary/80 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-amani-primary mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 mb-2">{user?.organization}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {user?.role === "admin"
                    ? "Administrateur"
                    : user?.role === "editeur"
                      ? "Éditeur"
                      : user?.role === "analyste"
                        ? "Analyste"
                        : user?.role === "moderateur"
                          ? "Modérateur"
                          : user?.role === "abonne"
                            ? "Abonné Premium"
                            : "Visiteur"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-amani-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-amani-primary text-amani-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organisation
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={profileData.organization}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      placeholder="Ex: Bamako, Mali"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site web
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedIn"
                      value={profileData.linkedIn}
                      onChange={handleProfileChange}
                      placeholder="@username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    placeholder="Parlez-nous de vous, votre expertise, vos centres d'intérêt..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Sauvegarder
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Secteurs d'intérêt
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => handleSectorToggle(sector)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          preferences.sectors.includes(sector)
                            ? "bg-amani-primary text-white border-amani-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-amani-primary"
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Pays suivis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {countries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountryToggle(country)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          preferences.countries.includes(country)
                            ? "bg-amani-primary text-white border-amani-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:border-amani-primary"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "newsletter",
                        label: "Newsletter hebdomadaire",
                        description: "Recevez notre résumé hebdomadaire",
                      },
                      {
                        key: "alerts",
                        label: "Alertes personnalisées",
                        description: "Notifications sur vos sujets d'intérêt",
                      },
                      {
                        key: "emailNotifications",
                        label: "Notifications par email",
                        description: "Recevez les notifications par email",
                      },
                      {
                        key: "pushNotifications",
                        label: "Notifications push",
                        description:
                          "Notifications directes sur votre navigateur",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={item.key}
                            checked={
                              preferences[
                                item.key as keyof typeof preferences
                              ] as boolean
                            }
                            onChange={handlePreferenceChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      name="timezone"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    >
                      <option value="Africa/Bamako">
                        Africa/Bamako (GMT+0)
                      </option>
                      <option value="Africa/Ouagadougou">
                        Africa/Ouagadougou (GMT+0)
                      </option>
                      <option value="Africa/Niamey">
                        Africa/Niamey (GMT+1)
                      </option>
                      <option value="Africa/Ndjamena">
                        Africa/Ndjamena (GMT+1)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Sauvegarder
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Sécurité du compte</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Assurez-vous d'utiliser un mot de passe fort et unique pour
                    votre compte.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Changer le mot de passe
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                            errors.currentPassword
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                            errors.newPassword
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      Changer le mot de passe
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations de connexion
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Dernière connexion
                      </span>
                      <span className="text-sm text-gray-600">
                        {user?.lastLogin || "Maintenant"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Membre depuis
                      </span>
                      <span className="text-sm text-gray-600">
                        Janvier 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
