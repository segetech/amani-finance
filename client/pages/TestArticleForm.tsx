import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedContentForm from '../components/UnifiedContentForm';
import { CategoriesDebug } from '../components/debug/CategoriesDebug';
import { ArticleCreationDebug } from '../components/debug/ArticleCreationDebug';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, FileText, Database, Bug } from 'lucide-react';

export default function TestArticleForm() {
  const navigate = useNavigate();

  const handleSave = async (formData: any) => {
    console.log('📝 Données du formulaire article:', formData);
    alert('Formulaire soumis ! Vérifiez la console pour voir les données.');
  };

  const handleCancel = () => {
    navigate('/test-media');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test du formulaire d'article
            </h1>
            <p className="text-gray-600">
              Testez le formulaire de création d'article avec les catégories Supabase
            </p>
          </div>
          <Button 
            onClick={() => navigate('/test-media')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux tests
          </Button>
        </div>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Formulaire complet</TabsTrigger>
            <TabsTrigger value="debug">Test simple</TabsTrigger>
            <TabsTrigger value="categories">Debug catégories</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Formulaire principal */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Formulaire d'article complet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UnifiedContentForm
                      type="article"
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Debug sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Debug
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoriesDebug />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debug" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Test de création d'article simplifié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleCreationDebug />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Debug des catégories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoriesDebug />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Vérifiez les catégories</h4>
              <p className="text-sm text-gray-600">
                Dans le panneau de debug à droite, vérifiez que les catégories se chargent 
                correctement depuis Supabase.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Testez le formulaire</h4>
              <p className="text-sm text-gray-600">
                Remplissez le formulaire d'article et vérifiez que le menu déroulant 
                des catégories affiche bien les catégories de votre base de données.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Soumettez le formulaire</h4>
              <p className="text-sm text-gray-600">
                Cliquez sur "Sauvegarder" pour voir les données dans la console. 
                Vérifiez que category_id contient bien l'UUID de la catégorie sélectionnée.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
