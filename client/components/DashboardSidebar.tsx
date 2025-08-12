import { Link, useLocation } from "react-router-dom";
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
  Calendar,
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
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: SidebarItem[];
}

export default function DashboardSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "content",
    "analytics",
  ]);

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
      title: "Vue d'ensemble",
      key: "overview",
      items: [
        {
          label: "Tableau de bord",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Mon profil",
          path: "/dashboard/profile",
          icon: User,
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
              icon: FileText,
              permission: "view_analytics",
            },
            {
              label: "Nouvel article",
              path: "/dashboard/articles/new",
              icon: Edit,
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
              label: "Nouveau podcast",
              path: "/dashboard/podcasts/new",
              icon: Mic,
              permission: "create_podcasts",
            },
          ],
        },
        {
          label: "Indices économiques",
          path: "/dashboard/indices",
          icon: BarChart3,
          permission: "create_indices",
          children: [
            {
              label: "Tous les indices",
              path: "/dashboard/indices",
              icon: TrendingUp,
              permission: "view_indices",
            },
            {
              label: "Nouvel indice",
              path: "/dashboard/indices/new",
              icon: BarChart3,
              permission: "create_indices",
            },
          ],
        },
      ],
    },
    {
      title: "Analytics & Rapports",
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
          label: "Centre de mod��ration",
          path: "/dashboard/moderation",
          icon: Shield,
          permission: "moderate_comments",
        },
        {
          label: "Signalements",
          path: "/dashboard/reports",
          icon: MessageSquare,
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
      title: "Gestion",
      key: "management",
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
              label: "Nouvel utilisateur",
              path: "/dashboard/users/new",
              icon: User,
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
          label: "Organisations",
          path: "/dashboard/organizations",
          icon: Building,
          permission: "system_settings",
        },
      ],
    },
    {
      title: "Système",
      key: "system",
      items: [
        {
          label: "Paramètres",
          path: "/dashboard/settings",
          icon: Settings,
          permission: "system_settings",
        },
        {
          label: "Notifications",
          path: "/dashboard/notifications",
          icon: Bell,
          permission: "system_settings",
        },
        {
          label: "Logs système",
          path: "/dashboard/logs",
          icon: Database,
          permission: "access_logs",
        },
        {
          label: "Intégrations",
          path: "/dashboard/integrations",
          icon: Globe,
          permission: "manage_integrations",
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
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
              active
                ? "bg-amani-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            } ${isChild ? "ml-6" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
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
        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
          active
            ? "bg-amani-primary text-white"
            : "text-gray-700 hover:bg-gray-100"
        } ${isChild ? "ml-6" : ""}`}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white h-full shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa7441c9084eb43e6855cf7e960c5c609%2F6ebebc1a91e8447db48a68aa5b391a28?format=webp&width=800"
            alt="Amani"
            className="h-8 w-auto"
          />
          <div>
            <div className="font-semibold text-amani-primary">Dashboard</div>
            <div className="text-xs text-gray-500">Amani Platform</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amani-primary rounded-full flex items-center justify-center text-white font-bold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {user?.roles && user.roles.length > 1
                ? `${user.roles.length} rôles`
                : user?.role}
            </div>
          </div>
        </div>
        {user?.roles && user.roles.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {user.roles.slice(0, 3).map((role) => (
              <span
                key={role}
                className="text-xs bg-amani-secondary/20 text-amani-primary px-2 py-1 rounded-full"
              >
                {role}
              </span>
            ))}
            {user.roles.length > 3 && (
              <span className="text-xs text-gray-500">
                +{user.roles.length - 3}
              </span>
            )}
          </div>
        )}
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
              className="w-full flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-gray-700">
                {section.title}
              </h3>
              <div className="text-gray-400 group-hover:text-gray-600">
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
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
