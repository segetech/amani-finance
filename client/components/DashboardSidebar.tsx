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
  LogOut,
  FolderOpen,
  AlertTriangle,
  Plus,
  Eye,
  Globe,
  Building,
  DollarSign,
  Lightbulb,
  Cpu,
  Headphones,
  PieChart,
  Activity,
} from "lucide-react";

export default function DashboardSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Structure simplifiée avec sections claires
  const menuSections = [
    {
      title: "🏠 ACCUEIL",
      items: [
        {
          label: "Tableau de bord",
          path: "/dashboard",
          icon: LayoutDashboard,
          description: "Vue d'ensemble",
        },
      ],
    },
    {
      title: "✏️ CRÉER DU CONTENU",
      items: [
        {
          label: "Nouvel Article",
          path: "/dashboard/articles/new",
          icon: FileText,
          permission: "create_articles",
        },
        {
          label: "Nouveau Podcast",
          path: "/dashboard/podcasts/new",
          icon: Mic,
          permission: "create_podcasts",
        },
        {
          label: "Nouvel Indice",
          path: "/dashboard/indices/new",
          icon: BarChart3,
          permission: "create_indices",
        },
      ],
    },
    {
      title: "📋 GÉRER LE CONTENU",
      items: [
        {
          label: "Tous les Contenus",
          path: "/dashboard/content-management",
          icon: FolderOpen,
          permission: "create_articles",
          description: "Vue unifiée",
        },
        {
          label: "Articles",
          path: "/dashboard/articles",
          icon: FileText,
          permission: "view_analytics",
        },
        {
          label: "Podcasts",
          path: "/dashboard/podcasts",
          icon: Headphones,
          permission: "view_analytics",
        },
        {
          label: "Indices Économiques",
          path: "/dashboard/indices-management",
          icon: BarChart3,
          permission: "create_indices",
        },
      ],
    },
    {
      title: "🌐 GÉRER LES PAGES PUBLIQUES",
      items: [
        {
          label: "Page Marché",
          path: "/dashboard/manage-marche",
          icon: TrendingUp,
          permission: "create_indices",
          description: "Cotations & données",
        },
        {
          label: "Page Économie",
          path: "/dashboard/manage-economie",
          icon: PieChart,
          permission: "create_economic_reports",
          description: "Indicateurs économiques",
        },
        {
          label: "Page Industrie",
          path: "/dashboard/manage-industrie",
          icon: Building,
          permission: "create_articles",
          description: "Secteur industriel",
        },
        {
          label: "Page Investissement",
          path: "/dashboard/manage-investissement",
          icon: DollarSign,
          permission: "create_articles",
          description: "Opportunités & conseils",
        },
        {
          label: "Page Insights",
          path: "/dashboard/manage-insights",
          icon: Lightbulb,
          permission: "create_articles",
          description: "Analyses approfondies",
        },
        {
          label: "Page Tech",
          path: "/dashboard/manage-tech",
          icon: Cpu,
          permission: "create_articles",
          description: "Technologie & innovation",
        },
        {
          label: "Page Podcast Public",
          path: "/dashboard/manage-podcast-public",
          icon: Mic,
          permission: "create_podcasts",
          description: "Vitrine podcasts",
        },
      ],
    },
    {
      title: "📊 DONNÉES & SOURCES",
      items: [
        {
          label: "Données de Marché",
          path: "/dashboard/market-data",
          icon: TrendingUp,
          permission: "create_indices",
          description: "Cotations temps réel",
        },
        {
          label: "Données Économiques",
          path: "/dashboard/economic-data",
          icon: PieChart,
          permission: "create_economic_reports",
          description: "Indicateurs macro",
        },
        {
          label: "Matières Premières",
          path: "/dashboard/commodities-management",
          icon: Globe,
          permission: "create_indices",
          description: "Commodités",
        },
      ],
    },
    {
      title: "📈 ANALYTICS",
      items: [
        {
          label: "Analytics",
          path: "/dashboard/analytics",
          icon: Activity,
          permission: "view_analytics",
          description: "Statistiques détaillées",
        },
        {
          label: "Rapports",
          path: "/dashboard/reports",
          icon: FileText,
          permission: "create_economic_reports",
          description: "Rapports économiques",
        },
      ],
    },
    {
      title: "🛡️ MODÉRATION",
      condition: () =>
        hasPermission("moderate_comments") ||
        hasPermission("manage_user_reports"),
      items: [
        {
          label: "Centre de Modération",
          path: "/dashboard/moderation",
          icon: Shield,
          permission: "moderate_comments",
        },
        {
          label: "Signalements",
          path: "/dashboard/reports-moderation",
          icon: AlertTriangle,
          permission: "manage_user_reports",
          badge: "3",
        },
      ],
    },
    {
      title: "⚙️ ADMINISTRATION",
      condition: () =>
        hasPermission("manage_users") || hasPermission("system_settings"),
      items: [
        {
          label: "Utilisateurs",
          path: "/dashboard/users",
          icon: Users,
          permission: "manage_users",
        },
        {
          label: "Permissions",
          path: "/dashboard/permissions",
          icon: Shield,
          permission: "manage_permissions",
        },
        {
          label: "Paramètres",
          path: "/dashboard/settings",
          icon: Settings,
          permission: "system_settings",
        },
      ],
    },
    {
      title: "👤 PERSONNEL",
      items: [
        {
          label: "Mon Profil",
          path: "/dashboard/profile",
          icon: User,
          description: "Mes informations",
        },
      ],
    },
  ];

  const isItemActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item: any) => {
    const hasAccess = !item.permission || hasPermission(item.permission);
    if (!hasAccess) return null;

    const active = isItemActive(item.path);

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <item.icon
            className={`w-4 h-4 ${active ? "text-white" : "text-gray-600 group-hover:text-blue-600"}`}
          />
          <div className="flex-1">
            <span className="font-medium text-sm">{item.label}</span>
            {item.description && (
              <div
                className={`text-xs ${
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
    if (user?.role === "admin") return "👑 Admin";
    if (user?.role === "editeur") return "✏️ Éditeur";
    if (user?.role === "analyste") return "📊 Analyste";
    if (user?.role === "moderateur") return "🛡️ Modérateur";
    return user?.role || "👤 Utilisateur";
  };

  return (
    <div className="w-80 bg-white h-screen sticky top-0 shadow-2xl border-r border-gray-200 flex flex-col overflow-hidden">
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section) => {
          // Vérifier si la section a une condition et si elle est remplie
          if (section.condition && !section.condition()) {
            return null;
          }

          // Vérifier si l'utilisateur a accès à au moins un item de la section
          const hasAccessToSection = section.items.some(
            (item) => !item.permission || hasPermission(item.permission),
          );

          if (!hasAccessToSection) {
            return null;
          }

          return (
            <div key={section.title}>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map(renderMenuItem)}
              </div>
            </div>
          );
        })}
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
