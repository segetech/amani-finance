import React from 'react';
import { useContentCategories } from '../../hooks/useContentCategories';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const CategoriesDebug: React.FC = () => {
  const { categories, loading, error } = useContentCategories();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
          {!loading && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
          Debug des catégories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* État du chargement */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium">Chargement</div>
            <Badge variant={loading ? "default" : "secondary"}>
              {loading ? "En cours" : "Terminé"}
            </Badge>
          </div>
          <div className="text-center">
            <div className="font-medium">Erreur</div>
            <Badge variant={error ? "destructive" : "secondary"}>
              {error ? "Oui" : "Non"}
            </Badge>
          </div>
          <div className="text-center">
            <div className="font-medium">Nombre</div>
            <Badge variant="outline">
              {categories.length}
            </Badge>
          </div>
        </div>

        {/* Affichage de l'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Erreur détectée :</h4>
            <p className="text-red-700 text-sm">{error.message}</p>
          </div>
        )}

        {/* Liste des catégories */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Catégories chargées :</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-600">/{category.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {category.content_types.join(", ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium">Aucune catégorie trouvée</p>
            <p className="text-sm">Vérifiez votre base de données Supabase</p>
          </div>
        )}

        {/* Informations de débogage */}
        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-gray-700">
            Informations techniques
          </summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
            <div><strong>Hook:</strong> useContentCategories</div>
            <div><strong>Table:</strong> content_categories</div>
            <div><strong>Timestamp:</strong> {new Date().toLocaleString()}</div>
            {categories.length > 0 && (
              <div className="mt-2">
                <strong>Exemple de catégorie:</strong>
                <pre className="mt-1 text-xs">
                  {JSON.stringify(categories[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  );
};
