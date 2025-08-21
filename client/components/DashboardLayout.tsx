import { ReactNode } from "react";
import DashboardSidebar from "./sidebar/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Bell, Search, Settings, ChevronDown } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#E5DDD2] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-amani-primary">
                    {title}
                  </h1>
                  {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-amani-primary hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                className="p-2 text-gray-600 hover:text-amani-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-amani-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Actions */}
              {actions && (
                <div className="flex items-center gap-2">{actions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
