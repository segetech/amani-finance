import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Loader2, User, LogIn, LogOut } from 'lucide-react';

export const QuickLogin: React.FC = () => {
  const { user, login, logout, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: 'admin@amani.com',
    password: 'admin123'
  });
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        console.log('✅ Connexion réussie');
      } else {
        console.log('❌ Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Vérification de l'authentification...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Connexion rapide (Test)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          // Utilisateur connecté
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Connecté</Badge>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>ID:</strong> <code className="text-xs">{user.id}</code></div>
                {user.role && <div><strong>Rôle:</strong> {user.role}</div>}
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </Button>
          </div>
        ) : (
          // Utilisateur non connecté
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Badge variant="destructive">Non connecté</Badge>
              <p className="text-sm text-red-700 mt-2">
                Vous devez être connecté pour créer des articles.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@amani.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                />
              </div>

              <Button 
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full flex items-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Se connecter
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <strong>Comptes de test :</strong>
              <br />• admin@amani.com / admin123
              <br />• editor@amani.com / editor123
              <br />• analyst@amani.com / analyst123
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
