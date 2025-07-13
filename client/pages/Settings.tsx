import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Mail,
  Database,
  Palette,
  Upload,
  Download,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Lock,
  Users,
  FileText,
  BarChart,
} from "lucide-react";

export default function Settings() {
  const { user, hasPermission } = useAuth();
  const { success, error, warning } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Amani - African Market & News Insights",
    siteDescription:
      "Plateforme d'information économique pour la région du Sahel et le Tchad",
    contactEmail: "contact@amani.demo",
    supportEmail: "support@amani.demo",
    timezone: "Africa/Bamako",
    language: "fr",
    maintenanceMode: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newsletterEnabled: true,
    alertsEnabled: true,
    moderationNotifications: true,
    systemNotifications: true,
    emailProvider: "smtp",
    smtpHost: "smtp.amani.demo",
    smtpPort: "587",
    smtpUser: "noreply@amani.demo",
    smtpPassword: "••••••••",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: false,
    sessionTimeout: "24",
    passwordMinLength: "8",
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: "5",
    accountLockoutDuration: "30",
    allowRegistration: true,
    requireEmailVerification: true,
  });

  const [contentSettings, setContentSettings] = useState({
    articlesPerPage: "10",
    allowComments: true,
    moderateComments: true,
    autoPublish: false,
    maxUploadSize: "10",
    allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx",
    defaultCategory: "economie",
    featuredArticlesCount: "5",
  });

  const handleSave = async (settingsType: string) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success(
      "Paramètres sauvegardés",
      `Les paramètres ${settingsType} ont été mis à jour avec succès.`,
    );
    setIsSaving(false);
  };

  const handleImportSettings = () => {
    // Simulate import
    warning(
      "Import terminé",
      "Les paramètres ont été importés. Vérifiez les modifications.",
    );
  };

  const handleExportSettings = () => {
    // Simulate export
    success("Export réussi", "Les paramètres ont été exportés avec succès.");
  };

  const handleTestEmail = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    success("Test envoyé", "Email de test envoyé avec succès.");
    setIsSaving(false);
  };

  const tabs = [
    {
      id: "general",
      name: "Général",
      icon: SettingsIcon,
      description: "Configuration générale du site",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      description: "Paramètres d'email et notifications",
    },
    {
      id: "security",
      name: "Sécurité",
      icon: Shield,
      description: "Authentification et sécurité",
    },
    {
      id: "content",
      name: "Contenu",
      icon: FileText,
      description: "Gestion du contenu et médias",
    },
  ];

  // Check permissions
  if (!user || !hasPermission("system_settings")) {
    return (
      <div className="min-h-screen bg-[#E5DDD2] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-amani-primary mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder aux
            paramètres système.
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

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Paramètres système
              </h1>
              <p className="text-gray-600">
                Configurez les paramètres de la plateforme Amani
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleImportSettings}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importer
              </button>
              <button
                onClick={handleExportSettings}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="font-semibold text-amani-primary mb-4">
                Catégories
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-amani-secondary/20 text-amani-primary border-l-4 border-amani-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tab.name}</div>
                        <div className="text-xs text-gray-500">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-white/50">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <SettingsIcon className="w-6 h-6 text-amani-primary" />
                    <h2 className="text-xl font-semibold text-amani-primary">
                      Paramètres généraux
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          value={generalSettings.siteName}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              siteName: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={generalSettings.contactEmail}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              contactEmail: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuseau horaire
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              timezone: e.target.value,
                            }))
                          }
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Langue par défaut
                        </label>
                        <select
                          value={generalSettings.language}
                          onChange={(e) =>
                            setGeneralSettings((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description du site
                      </label>
                      <textarea
                        rows={3}
                        value={generalSettings.siteDescription}
                        onChange={(e) =>
                          setGeneralSettings((prev) => ({
                            ...prev,
                            siteDescription: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Mode maintenance
                          </h3>
                          <p className="text-sm text-gray-500">
                            Activer le mode maintenance pour les mises à jour
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.maintenanceMode}
                            onChange={(e) =>
                              setGeneralSettings((prev) => ({
                                ...prev,
                                maintenanceMode: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave("généraux")}
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
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-amani-primary" />
                    <h2 className="text-xl font-semibold text-amani-primary">
                      Paramètres de notification
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Types de notifications
                        </h3>
                        {[
                          {
                            key: "emailNotifications",
                            label: "Notifications par email",
                          },
                          {
                            key: "pushNotifications",
                            label: "Notifications push",
                          },
                          { key: "newsletterEnabled", label: "Newsletter" },
                          { key: "alertsEnabled", label: "Alertes" },
                          {
                            key: "moderationNotifications",
                            label: "Notifications de modération",
                          },
                          {
                            key: "systemNotifications",
                            label: "Notifications système",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">
                              {item.label}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  notificationSettings[
                                    item.key as keyof typeof notificationSettings
                                  ] as boolean
                                }
                                onChange={(e) =>
                                  setNotificationSettings((prev) => ({
                                    ...prev,
                                    [item.key]: e.target.checked,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Configuration SMTP
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Serveur SMTP
                          </label>
                          <input
                            type="text"
                            value={notificationSettings.smtpHost}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                smtpHost: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Port
                          </label>
                          <input
                            type="text"
                            value={notificationSettings.smtpPort}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                smtpPort: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Utilisateur SMTP
                          </label>
                          <input
                            type="email"
                            value={notificationSettings.smtpUser}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                smtpUser: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleTestEmail}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                          Tester l'email
                        </button>
                        <button
                          onClick={() => handleSave("de notification")}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-amani-primary" />
                    <h2 className="text-xl font-semibold text-amani-primary">
                      Paramètres de sécurité
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Authentification
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Double authentification obligatoire
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.twoFactorRequired}
                              onChange={(e) =>
                                setSecuritySettings((prev) => ({
                                  ...prev,
                                  twoFactorRequired: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durée de session (heures)
                          </label>
                          <input
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) =>
                              setSecuritySettings((prev) => ({
                                ...prev,
                                sessionTimeout: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tentatives de connexion max
                          </label>
                          <input
                            type="number"
                            value={securitySettings.maxLoginAttempts}
                            onChange={(e) =>
                              setSecuritySettings((prev) => ({
                                ...prev,
                                maxLoginAttempts: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Politique des mots de passe
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longueur minimale
                          </label>
                          <input
                            type="number"
                            value={securitySettings.passwordMinLength}
                            onChange={(e) =>
                              setSecuritySettings((prev) => ({
                                ...prev,
                                passwordMinLength: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                          />
                        </div>
                        {[
                          {
                            key: "passwordRequireSpecial",
                            label: "Caractères spéciaux requis",
                          },
                          {
                            key: "passwordRequireNumbers",
                            label: "Chiffres requis",
                          },
                          {
                            key: "passwordRequireUppercase",
                            label: "Majuscules requises",
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">
                              {item.label}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  securitySettings[
                                    item.key as keyof typeof securitySettings
                                  ] as boolean
                                }
                                onChange={(e) =>
                                  setSecuritySettings((prev) => ({
                                    ...prev,
                                    [item.key]: e.target.checked,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSave("de sécurité")}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Settings */}
              {activeTab === "content" && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-amani-primary" />
                    <h2 className="text-xl font-semibold text-amani-primary">
                      Paramètres de contenu
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Articles par page
                        </label>
                        <input
                          type="number"
                          value={contentSettings.articlesPerPage}
                          onChange={(e) =>
                            setContentSettings((prev) => ({
                              ...prev,
                              articlesPerPage: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie par défaut
                        </label>
                        <select
                          value={contentSettings.defaultCategory}
                          onChange={(e) =>
                            setContentSettings((prev) => ({
                              ...prev,
                              defaultCategory: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        >
                          <option value="economie">Économie</option>
                          <option value="marche">Marché</option>
                          <option value="industrie">Industrie</option>
                          <option value="tech">Tech</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Taille max upload (MB)
                        </label>
                        <input
                          type="number"
                          value={contentSettings.maxUploadSize}
                          onChange={(e) =>
                            setContentSettings((prev) => ({
                              ...prev,
                              maxUploadSize: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Articles en vedette
                        </label>
                        <input
                          type="number"
                          value={contentSettings.featuredArticlesCount}
                          onChange={(e) =>
                            setContentSettings((prev) => ({
                              ...prev,
                              featuredArticlesCount: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Types de fichiers autorisés
                      </label>
                      <input
                        type="text"
                        value={contentSettings.allowedFileTypes}
                        onChange={(e) =>
                          setContentSettings((prev) => ({
                            ...prev,
                            allowedFileTypes: e.target.value,
                          }))
                        }
                        placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          key: "allowComments",
                          label: "Autoriser les commentaires",
                        },
                        {
                          key: "moderateComments",
                          label: "Modérer les commentaires",
                        },
                        {
                          key: "autoPublish",
                          label: "Publication automatique",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700">
                            {item.label}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                contentSettings[
                                  item.key as keyof typeof contentSettings
                                ] as boolean
                              }
                              onChange={(e) =>
                                setContentSettings((prev) => ({
                                  ...prev,
                                  [item.key]: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSave("de contenu")}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
