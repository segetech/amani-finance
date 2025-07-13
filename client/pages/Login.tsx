import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amani-secondary/20 via-white to-amani-primary/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-4xl font-bold text-amani-primary mb-2">
              Amani
            </div>
            <div className="text-sm text-gray-600">
              African Market & News Insights
            </div>
          </Link>
          <h2 className="mt-8 text-3xl font-bold text-amani-primary">
            Connexion
          </h2>
          <p className="mt-2 text-gray-600">
            Accédez à votre compte pour suivre l'économie du Sahel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-amani-primary hover:text-amani-primary/80 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-amani-primary hover:bg-amani-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amani-primary transition-colors font-medium"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-amani-primary rounded-lg text-amani-primary hover:bg-amani-secondary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amani-primary transition-colors font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Avec votre compte Amani, accédez à :
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-amani-primary">
                Alertes personnalisées
              </div>
              <div>Indices économiques</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-amani-primary">
                Contenu exclusif
              </div>
              <div>Analyses premium</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-amani-primary">Favoris</div>
              <div>Articles sauvegardés</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-amani-primary">Newsletter</div>
              <div>Résumé hebdomadaire</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
