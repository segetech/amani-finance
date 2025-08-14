import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BarChart3,
  Users,
  Settings,
  TrendingUp,
  User,
  Shield,
  Bell,
  Activity,
  Globe,
  LogOut,
  FolderOpen,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  PieChart,
  Database,
  Headphones,
  Video,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string;
  description?: string;
}

export default function DashboardSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu simplifié et organisé logiquement
  const menuItems: MenuItem[] = [
    // Accueil
    {
      label: "🏠 Tableau de bord",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "Vue d'ensemble",
    },

    // Création de contenu
    {
      label: "📝 Créer un Article",
      path: "/dashboard/articles/new",
      icon: Plus,
      permission: "create_articles",
      description: "Rédiger un nouvel article",
    },
    {
      label: "🎙️ Créer un Podcast",
      path: "/dashboard/podcasts/new",
      icon: Mic,
      permission: "create_podcasts",
      description: "Audio ou vidéo",
    },
    {
      label: "📊 Créer un Indice",
      path: "/dashboard/indices/new",
      icon: Plus,
      permission: "create_indices",
      description: "Nouvel indice économique",
    },

    // Gestion du contenu
    {
      label: "📄 Gérer Articles",
      path: "/dashboard/articles",
      icon: FileText,
      permission: "view_analytics",
      description: "Tous les articles",
    },
    {
      label: "🎧 Gérer Podcasts",
      path: "/dashboard/podcasts",
      icon: Headphones,
      permission: "view_analytics",
      description: "Tous les podcasts",
    },
    {
      label: "📈 Gérer Indices",
      path: "/dashboard/indices-management",
      icon: BarChart3,
      permission: "create_indices",
      description: "Indices économiques",
    },
    {
      label: "🗂️ Vue d'ensemble",
      path: "/dashboard/content-management",
      icon: FolderOpen,
      permission: "create_articles",
      description: "Tout le contenu",
    },

    // Données dynamiques
    {
      label: "📊 Données de Marché",
      path: "/dashboard/market-data",
      icon: TrendingUp,
      permission: "create_indices",
      description: "Cotations temps réel",
    },
    {
      label: "💰 Données Économiques",
      path: "/dashboard/economic-data",
      icon: PieChart,
      permission: "create_economic_reports",
      description: "Indicateurs économiques",
    },
    {
      label: "🌾 Matières Premières",
      path: "/dashboard/commodities-management",
      icon: Globe,
      permission: "create_indices",
      description: "Commodités",
    },

    // Analytics et rapports
    {
      label: "📈 Analytics",
      path: "/dashboard/analytics",
      icon: Activity,
      permission: "view_analytics",
      description: "Statistiques détaillées",
    },
    {
      label: "📋 Rapports",
      path: "/dashboard/reports",
      icon: Database,
      permission: "create_economic_reports",
      description: "Rapports économiques",
    },

    // Modération (pour modérateurs/admins)
    {
      label: "🛡️ Modération",
      path: "/dashboard/moderation",
      icon: Shield,
      permission: "moderate_comments",
      description: "Modérer le contenu",
    },
    {
      label: "⚠️ Signalements",
      path: "/dashboard/reports-moderation",
      icon: AlertTriangle,
      permission: "manage_user_reports",
      badge: "3",
      description: "Gérer les signalements",
    },

    // Administration (pour admins)
    {
      label: "👥 Utilisateurs",
      path: "/dashboard/users",
      icon: Users,
      permission: "manage_users",
      description: "Gérer les utilisateurs",
    },
    {
      label: "🔒 Permissions",
      path: "/dashboard/permissions",
      icon: Shield,
      permission: "manage_permissions",
      description: "Gérer les droits",
    },
    {
      label: "⚙️ Paramètres",
      path: "/dashboard/settings",
      icon: Settings,
      permission: "system_settings",
      description: "Configuration système",
    },

    // Personnel
    {
      label: "👤 Mon Profil",
      path: "/dashboard/profile",
      icon: User,
      description: "Mes informations",
    },
  ];

  const isItemActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasAccess = !item.permission || hasPermission(item.permission);
    if (!hasAccess) return null;

    const active = isItemActive(item.path);

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <item.icon
            className={`w-5 h-5 ${active ? "text-white" : "text-gray-600 group-hover:text-blue-600"}`}
          />
          <div className="flex-1">
            <span className="font-medium text-sm leading-tight">
              {item.label}
            </span>
            {item.description && (
              <div
                className={`text-xs leading-tight ${
                  active
                    ? "text-blue-100"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              >
                {item.description}
              </div>
            )}
          </div>
        </div>

        {item.badge && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              active ? "bg-white/20 text-white" : "bg-red-500 text-white"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const getUserRole = () => {
    if (user?.role === "admin") return "👑 Administrateur";
    if (user?.role === "editeur") return "✏️ Éditeur";
    if (user?.role === "analyste") return "📊 Analyste";
    if (user?.role === "moderateur") return "🛡️ Modérateur";
    return user?.role || "👤 Utilisateur";
  };

  // Grouper les items par catégorie pour un affichage plus organisé
  const groupedItems = {
    main: menuItems.slice(0, 1), // Tableau de bord
    create: menuItems.slice(1, 4), // Création
    manage: menuItems.slice(4, 8), // Gestion
    data: menuItems.slice(8, 11), // Données
    analytics: menuItems.slice(11, 13), // Analytics
    moderation: menuItems.slice(13, 15), // Modération
    admin: menuItems.slice(15, 18), // Administration
    personal: menuItems.slice(18), // Personnel
  };

  return (
    <div className="w-72 bg-white h-screen sticky top-0 shadow-2xl border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa7441c9084eb43e6855cf7e960c5c609%2F6ebebc1a91e8447db48a68aa5b391a28?format=webp&width=800"
            alt="Amani"
            className="h-8 w-auto"
          />
          <div>
            <div className="font-bold text-blue-700 text-lg">Dashboard</div>
            <div className="text-xs text-blue-600">Amani Finance</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate text-sm">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-blue-600 font-medium">
              {getUserRole()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation simplifiée */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Accueil */}
        <div>{groupedItems.main.map(renderMenuItem)}</div>

        {/* Création rapide */}
        {groupedItems.create.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              ⚡ Création Rapide
            </h3>
            <div className="space-y-1">
              {groupedItems.create.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Gestion */}
        {groupedItems.manage.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              📋 Gestion
            </h3>
            <div className="space-y-1">
              {groupedItems.manage.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Données */}
        {groupedItems.data.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              📊 Données & Sources
            </h3>
            <div className="space-y-1">
              {groupedItems.data.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Analytics */}
        {groupedItems.analytics.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              📈 Analytics
            </h3>
            <div className="space-y-1">
              {groupedItems.analytics.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Modération */}
        {groupedItems.moderation.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              🛡️ Modération
            </h3>
            <div className="space-y-1">
              {groupedItems.moderation.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Administration */}
        {groupedItems.admin.some(
          (item) => !item.permission || hasPermission(item.permission),
        ) && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              ⚙️ Administration
            </h3>
            <div className="space-y-1">
              {groupedItems.admin.map(renderMenuItem)}
            </div>
          </div>
        )}

        {/* Personnel */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            👤 Personnel
          </h3>
          <div className="space-y-1">
            {groupedItems.personal.map(renderMenuItem)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
