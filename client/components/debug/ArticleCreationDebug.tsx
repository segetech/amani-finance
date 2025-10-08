import React, { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../context/AuthContext';
import { useContentCategories } from '../../hooks/useContentCategories';
import { CategoriesDebug } from '../debug/CategoriesDebug';
import { QuickLogin } from '../debug/QuickLogin';
import { MockAuth } from '../debug/MockAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Loader2, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export const ArticleCreationDebug: React.FC = () => {
  const { user } = useAuth();
  const { createArticle, loading, error } = useArticles();
  const { categories, loading: categoriesLoading } = useContentCategories();
  
  const [formData, setFormData] = useState({
    title: 'Article de test',
    summary: 'Ceci est un résumé de test pour vérifier la création d\'articles',
    category_id: '',
    status: 'draft' as 'draft' | 'published'
  });
  
  const [creationLog, setCreationLog] = useState<string[]>([]);
  const [lastCreatedArticle, setLastCreatedArticle] = useState<any>(null);
  const [mockUser, setMockUser] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setCreationLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleCreate = async () => {
    if (!formData.category_id) {
      addLog('❌ Aucune catégorie sélectionnée');
      return;
    }

    setCreationLog([]);
    setLastCreatedArticle(null);
    
    addLog('🚀 Début de la création d\'article...');
    addLog(`📝 Titre: ${formData.title}`);
    addLog(`📋 Résumé: ${formData.summary}`);
    addLog(`🏷️ Catégorie ID: ${formData.category_id}`);
    const currentUser = user || mockUser;
    addLog(`👤 Utilisateur: ${currentUser?.email || 'Non connecté'}`);

    if (!currentUser) {
      addLog('❌ Aucun utilisateur connecté (réel ou simulé)');
      return;
    }

    try {
      const articleData = {
        type: 'article' as const,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        summary: formData.summary,
        description: formData.summary,
        content: `<p>${formData.summary}</p>`,
        status: formData.status,
        category_id: formData.category_id,
        author_id: currentUser.id,
        country: 'mali',
        tags: ['test'],
        meta_title: formData.title,
        meta_description: formData.summary,
        featured_image: null,
        featured_image_alt: null,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        article_data: {}
      };

      addLog('📤 Envoi des données à createArticle...');
      
      const result = await createArticle(articleData);
      
      addLog('✅ Article créé avec succès !');
      addLog(`🆔 ID: ${result.id}`);
      setLastCreatedArticle(result);
      
    } catch (err: any) {
      addLog(`❌ Erreur: ${err.message}`);
      console.error('Erreur création article:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test de création d'article
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de l'article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Résumé</label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Résumé de l'article"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Catégorie {categoriesLoading && <Loader2 className="w-4 h-4 inline animate-spin ml-2" />}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          <Button 
            onClick={handleCreate} 
            disabled={loading || !formData.category_id || (!user && !mockUser)}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer l\'article de test'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Authentification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuickLogin />
        <MockAuth 
          currentUser={mockUser} 
          onUserChange={setMockUser}
        />
      </div>

      {/* Logs de création */}
      {creationLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logs de création</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {creationLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erreur globale */}
      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Erreur détectée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Message d'erreur :</p>
              <p className="text-red-700 mt-2">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Article créé */}
      {lastCreatedArticle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Article créé avec succès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">ID</div>
                  <div className="text-gray-600 font-mono">{lastCreatedArticle.id}</div>
                </div>
                <div>
                  <div className="font-medium">Titre</div>
                  <div className="text-gray-600">{lastCreatedArticle.title}</div>
                </div>
                <div>
                  <div className="font-medium">Slug</div>
                  <div className="text-gray-600">{lastCreatedArticle.slug}</div>
                </div>
                <div>
                  <div className="font-medium">Statut</div>
                  <Badge variant={lastCreatedArticle.status === 'published' ? "default" : "secondary"}>
                    {lastCreatedArticle.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
