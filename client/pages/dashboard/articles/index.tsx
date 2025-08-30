import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../../../hooks/useArticles';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Eye, Edit, Clock, Calendar, ArrowRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ArticlesList() {
  const [status, setStatus] = useState<'published' | 'draft' | 'all'>('published');
  const { articles, loading, error } = useArticles({ status: status === 'all' ? 'all' : status });
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Erreur lors du chargement des articles : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des articles</h1>
          <p className="text-muted-foreground">
            Gérez et publiez vos article
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/articles/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={status === 'all' ? 'default' : 'outline'}
          onClick={() => setStatus('all')}
        >
          Tous les articles
        </Button>
        <Button
          variant={status === 'published' ? 'default' : 'outline'}
          onClick={() => setStatus('published')}
        >
          Publiés
        </Button>
        <Button
          variant={status === 'draft' ? 'default' : 'outline'}
          onClick={() => setStatus('draft')}
        >
          Brouillons
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Aucun article trouvé</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard/articles/new')}>
            Créer votre premier article
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col h-full">
              {article.featured_image && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt || article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <Badge
                    variant={article.status === 'published' ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {article.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{article.views} vues</span>
                  </div>
                  {article.read_time && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.read_time} min</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.published_at
                    ? format(new Date(article.published_at), 'PPP', { locale: fr })
                    : 'Non publié'}
                </div>
                {article.category_info?.name && (
                  <Badge variant="outline" className="mt-3">
                    {article.category_info.name}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/dashboard/articles/${article.slug}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
