import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  Shield,
  Database,
  Bell,
  PieChart,
  Activity,
  Globe,
  Headphones,
  Edit,
  UserCheck,
  FileSpreadsheet,
  Building,
  ChevronDown,
  ChevronRight,
  LogOut,
  FolderOpen,
  CheckSquare,
  HelpCircle,
  Plus,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string;
  children?: SidebarItem[];
}

export default function DashboardSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "main",
    "content",
    "analytics",
    "moderation",
    "admin"
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const sidebarSections: {
    title: string;
    key: string;
    items: SidebarItem[];
  }[] = [
    {
      title: "Principal",
      key: "main",
      items: [
        {
          label: "Tableau de bord",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Gestion de Contenu",
          path: "/dashboard/content-management",
          icon: FolderOpen,
          permission: "create_articles",
        },
      ],
    },
    {
      title: "Contenu",
      key: "content",
      items: [
        {
          label: "Articles",
          path: "/dashboard/articles",
          icon: FileText,
          permission: "create_articles",
          children: [
            {
              label: "Tous les articles",
              path: "/dashboard/articles",
              icon: Eye,
              permission: "view_analytics",
            },
            {
              label: "Créer un article",
              path: "/dashboard/articles/new",
              icon: Plus,
              permission: "create_articles",
            },
          ],
        },
        {
          label: "Podcasts",
          path: "/dashboard/podcasts",
          icon: Mic,
          permission: "create_podcasts",
          children: [
            {
              label: "Tous les podcasts",
              path: "/dashboard/podcasts",
              icon: Headphones,
              permission: "view_analytics",
            },
            {
              label: "Créer un podcast",
              path: "/dashboard/podcasts/new",
              icon: Plus,
              permission: "create_podcasts",
            },
          ],
        },
        {
          label: "Indices économiques",
          path: "/dashboard/indices-management",
          icon: BarChart3,
          permission: "create_indices",
          children: [
            {
              label: "Gestion des indices",
              path: "/dashboard/indices-management",
              icon: Settings,
              permission: "create_indices",
            },
            {
              label: "Créer un indice",
              path: "/dashboard/indices/new",
              icon: Plus,
              permission: "create_indices",
            },
            {
              label: "Matières premières",
              path: "/dashboard/commodities-management",
              icon: Globe,
              permission: "create_indices",
            },
          ],
        },
      ],
    },
    {
      title: "Analytics",
      key: "analytics",
      items: [
        {
          label: "Analytics",
          path: "/dashboard/analytics",
          icon: BarChart3,
          permission: "view_analytics",
        },
        {
          label: "Rapports",
          path: "/dashboard/reports",
          icon: FileSpreadsheet,
          permission: "create_economic_reports",
        },
        {
          label: "Activité utilisateurs",
          path: "/dashboard/user-activity",
          icon: Activity,
          permission: "view_user_activity",
        },
      ],
    },
    {
      title: "Modération",
      key: "moderation",
      items: [
        {
          label: "Centre de modération",
          path: "/dashboard/moderation",
          icon: Shield,
          permission: "moderate_comments",
          badge: "3", // Exemple de signalements en attente
        },
        {
          label: "Signalements",
          path: "/dashboard/reports-moderation",
          icon: AlertTriangle,
          permission: "manage_user_reports",
        },
        {
          label: "Utilisateurs bannis",
          path: "/dashboard/banned-users",
          icon: UserCheck,
          permission: "ban_users",
        },
      ],
    },
    {
      title: "Administration",
      key: "admin",
      items: [
        {
          label: "Utilisateurs",
          path: "/dashboard/users",
          icon: Users,
          permission: "manage_users",
          children: [
            {
              label: "Tous les utilisateurs",
              path: "/dashboard/users",
              icon: Users,
              permission: "manage_users",
            },
            {
              label: "Créer utilisateur",
              path: "/dashboard/users/new",
              icon: Plus,
              permission: "create_users",
            },
          ],
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
  ];

  const isItemActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const hasAccessToSection = (items: SidebarItem[]): boolean => {
    return items.some((item) => {
      if (!item.permission || hasPermission(item.permission)) {
        return true;
      }
      if (item.children) {
        return hasAccessToSection(item.children);
      }
      return false;
    });
  };

  const renderMenuItem = (item: SidebarItem, isChild = false) => {
    const hasAccess = !item.permission || hasPermission(item.permission);
    if (!hasAccess) return null;

    const active = isItemActive(item.path);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleSection(item.path)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
              active
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            } ${isChild ? "ml-4" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {expandedSections.includes(item.path) ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.includes(item.path) && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
          active
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        } ${isChild ? "ml-4" : ""}`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const getUserRole = () => {
    if (user?.role === "admin") return "Administrateur";
    if (user?.role === "editeur") return "Éditeur";
    if (user?.role === "analyste") return "Analyste";
    if (user?.role === "moderateur") return "Modérateur";
    return user?.role || "Utilisateur";
  };

  return (
    <div className="w-64 bg-white h-screen sticky top-0 shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa7441c9084eb43e6855cf7e960c5c609%2F6ebebc1a91e8447db48a68aa5b391a28?format=webp&width=800"
            alt="Amani"
            className="h-8 w-auto"
          />
          <div>
            <div className="font-bold text-blue-700">Dashboard</div>
            <div className="text-xs text-blue-600">Amani Finance</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
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
        {sidebarSections.map((section) => {
          const hasAccess = hasAccessToSection(section.items);
          if (!hasAccess) return null;

          return (
            <div key={section.key}>
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider group-hover:text-blue-700">
                  {section.title}
                </h3>
                <div className="text-gray-400 group-hover:text-blue-600">
                  {expandedSections.includes(section.key) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </div>
              </button>
              {expandedSections.includes(section.key) && (
                <div className="space-y-1">
                  {section.items.map((item) => renderMenuItem(item))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
