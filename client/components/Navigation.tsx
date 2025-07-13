import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, LogIn } from "lucide-react";

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="text-2xl lg:text-3xl font-bold text-amani-primary group-hover:text-amani-primary/80 transition-colors">
                Amani
              </div>
              <div className="ml-3 text-xs lg:text-sm text-gray-600 hidden md:block leading-tight">
                <div>African Market &</div>
                <div>News Insights</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1 xl:space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 xl:px-4 py-2 text-sm xl:text-base font-medium transition-all duration-300 rounded-lg relative overflow-hidden group ${
                    isActive(item.href)
                      ? "text-amani-primary bg-amani-secondary/50"
                      : "text-gray-700 hover:text-amani-primary hover:bg-amani-secondary/30"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amani-primary"></div>
                  )}
                </Link>
              ))}

              {/* Login Button */}
              <div className="ml-6 flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amani-primary border border-amani-primary rounded-lg hover:bg-amani-primary hover:text-white transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amani-primary rounded-lg hover:bg-amani-primary/90 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-amani-primary hover:bg-amani-secondary/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amani-primary transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              </span>
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
                  aria-hidden="true"
                />
                <X
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
          {navigationItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 transform ${
                isActive(item.href)
                  ? "text-amani-primary bg-amani-secondary/50 shadow-sm scale-105"
                  : "text-gray-700 hover:text-amani-primary hover:bg-amani-secondary/30 hover:scale-105"
              }`}
              style={{
                animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Login Buttons */}
          <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-amani-primary border border-amani-primary rounded-xl hover:bg-amani-primary hover:text-white transition-all duration-200"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-white bg-amani-primary rounded-xl hover:bg-amani-primary/90 transition-all duration-200"
            >
              <User className="w-4 h-4" />
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
