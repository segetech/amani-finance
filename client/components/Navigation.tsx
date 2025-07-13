import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigationItems = [
  { name: "Accueil", href: "/" },
  { name: "Marché", href: "/marche" },
  { name: "Économie", href: "/economie" },
  { name: "Industrie", href: "/industrie" },
  { name: "Investissement", href: "/investissement" },
  { name: "Insights", href: "/insights" },
  { name: "Tech", href: "/tech" },
  { name: "Podcast", href: "/podcast" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-amani-primary">Amani</div>
              <div className="ml-2 text-sm text-gray-600 hidden sm:block">
                African Market & News Insights
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-amani-primary border-b-2 border-amani-primary"
                      : "text-gray-700 hover:text-amani-primary hover:border-b-2 hover:border-amani-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-amani-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amani-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-amani-primary bg-amani-secondary rounded-md"
                    : "text-gray-700 hover:text-amani-primary hover:bg-gray-50 rounded-md"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
