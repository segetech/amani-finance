import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
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

  // Check permissions
  if (!user || !hasPermission("system_settings")) {
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
      </DashboardLayout>
    );
  }

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success(
      "Paramètres sauvegardés",
      `Les paramètres ${settingsType} ont été mis à jour avec succès.`,
    );
    setIsSaving(false);
  };

  const handleImportSettings = () => {
    warning(
      "Import terminé",
      "Les paramètres ont été importés. Vérifiez les modifications.",
    );
  };

  const handleExportSettings = () => {
    success(
      "Export terminé",
      "Les paramètres ont été exportés avec succès.",
    );
  };

  const tabs = [
    { id: "general", label: "Général", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "content", label: "Contenu", icon: FileText },
    { id: "system", label: "Système", icon: Database },
  ];

  return (
    <DashboardLayout
      title="Paramètres système"
      subtitle="Configurez les paramètres de la plateforme"
      actions={
        <>
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
        </>
      }
    >
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-amani-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-amani-primary">
                    Paramètres généraux
                  </h2>
                  <button
                    onClick={() => handleSave("généraux")}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
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
                        setGeneralSettings({
                          ...generalSettings,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du site
                    </label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    >
                      <option value="Africa/Bamako">Africa/Bamako</option>
                      <option value="Africa/Ouagadougou">Africa/Ouagadougou</option>
                      <option value="Africa/Niamey">Africa/Niamey</option>
                      <option value="Africa/Ndjamena">Africa/Ndjamena</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          language: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode maintenance</h3>
                    <p className="text-sm text-gray-600">
                      Activer le mode maintenance pour la plateforme
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          maintenanceMode: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-amani-primary">
                    Paramètres de notifications
                  </h2>
                  <button
                    onClick={() => handleSave("de notifications")}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Notifications par email" },
                    { key: "pushNotifications", label: "Notifications push" },
                    { key: "newsletterEnabled", label: "Newsletter activée" },
                    { key: "alertsEnabled", label: "Alertes activées" },
                    { key: "moderationNotifications", label: "Notifications de modération" },
                    { key: "systemNotifications", label: "Notifications système" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{setting.label}</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [setting.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-amani-primary">
                    Paramètres de sécurité
                  </h2>
                  <button
                    onClick={() => handleSave("de sécurité")}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée de session (heures)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longueur minimale du mot de passe
                    </label>
                    <input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "twoFactorRequired", label: "Authentification à deux facteurs obligatoire" },
                    { key: "passwordRequireSpecial", label: "Caractères spéciaux obligatoires" },
                    { key: "passwordRequireNumbers", label: "Chiffres obligatoires" },
                    { key: "passwordRequireUppercase", label: "Majuscules obligatoires" },
                    { key: "allowRegistration", label: "Autoriser les inscriptions" },
                    { key: "requireEmailVerification", label: "Vérification email obligatoire" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{setting.label}</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings[setting.key as keyof typeof securitySettings] as boolean}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              [setting.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-amani-primary">
                    Paramètres de contenu
                  </h2>
                  <button
                    onClick={() => handleSave("de contenu")}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Articles par page
                    </label>
                    <input
                      type="number"
                      value={contentSettings.articlesPerPage}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          articlesPerPage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille max upload (MB)
                    </label>
                    <input
                      type="number"
                      value={contentSettings.maxUploadSize}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          maxUploadSize: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "allowComments", label: "Autoriser les commentaires" },
                    { key: "moderateComments", label: "Modérer les commentaires" },
                    { key: "autoPublish", label: "Publication automatique" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{setting.label}</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contentSettings[setting.key as keyof typeof contentSettings] as boolean}
                          onChange={(e) =>
                            setContentSettings({
                              ...contentSettings,
                              [setting.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amani-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amani-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-amani-primary">
                    Informations système
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Version</h3>
                    <p className="text-gray-600">Amani Platform v2.1.0</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Base de données</h3>
                    <p className="text-gray-600">PostgreSQL 14.9</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Stockage utilisé</h3>
                    <p className="text-gray-600">2.4 GB / 10 GB</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Dernière sauvegarde</h3>
                    <p className="text-gray-600">15 Jan 2024, 03:00</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">
                        Maintenance programmée
                      </h3>
                      <p className="text-amber-700 text-sm">
                        Une maintenance est programmée le 20 janvier 2024 de 02:00 à 04:00 UTC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
