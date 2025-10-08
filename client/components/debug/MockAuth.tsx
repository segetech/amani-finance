import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { User, Settings } from 'lucide-react';

interface MockUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface MockAuthProps {
  onUserChange: (user: MockUser | null) => void;
  currentUser: MockUser | null;
}

export const MockAuth: React.FC<MockAuthProps> = ({ onUserChange, currentUser }) => {
  const mockUsers: MockUser[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@amani.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'editor@amani.com',
      first_name: 'Editor',
      last_name: 'User',
      role: 'editor'
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'test@amani.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'admin'
    }
  ];

  const handleSelectUser = (user: MockUser) => {
    onUserChange(user);
    console.log('🎭 Utilisateur simulé sélectionné:', user);
  };

  const handleLogout = () => {
    onUserChange(null);
    console.log('🎭 Déconnexion simulée');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Authentification simulée (Test)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUser ? (
          // Utilisateur connecté
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Connecté (Simulé)</Badge>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Email:</strong> {currentUser.email}</div>
                <div><strong>Nom:</strong> {currentUser.first_name} {currentUser.last_name}</div>
                <div><strong>ID:</strong> <code className="text-xs">{currentUser.id}</code></div>
                <div><strong>Rôle:</strong> {currentUser.role}</div>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Se déconnecter (Simulé)
            </Button>
          </div>
        ) : (
          // Sélection d'utilisateur
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Badge variant="secondary">Mode Test</Badge>
              <p className="text-sm text-blue-700 mt-2">
                Sélectionnez un utilisateur simulé pour tester la création d'articles.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Utilisateurs disponibles :</h4>
              {mockUsers.map((user) => (
                <Button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <User className="w-4 h-4 mr-2" />
                  <div>
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-gray-500">{user.email} ({user.role})</div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <strong>Note :</strong> Ceci est une authentification simulée pour les tests uniquement. 
              Les données ne seront pas sauvegardées réellement en base.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
