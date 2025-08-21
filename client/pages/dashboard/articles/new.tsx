import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

type FormData = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category_id: string;
  status: 'draft' | 'published';
};

export default function NewArticle() {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      status: 'draft',
    },
  });

  // Vérifier les permissions
  useEffect(() => {
    if (user && !hasPermission('create_articles')) {
      navigate('/dashboard/articles');
    }
  }, [user, hasPermission, navigate]);

  // Générer le slug à partir du titre
  const title = watch('title');
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      setValue('slug', slug);
    }
  }, [title, setValue]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Soumettre le formulaire
  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour créer un article');
      }

      const { error } = await supabase.from('contents').insert([
        {
          type: 'article',
          title: formData.title,
          slug: formData.slug,
          summary: formData.summary,
          content: formData.content,
          category_id: formData.category_id,
          status: formData.status,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
          author_id: currentUser.id,
        },
      ]);

      if (error) throw error;
      
      navigate('/dashboard/articles');
    } catch (err) {
      console.error('Erreur lors de la création de l\'article:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Une erreur est survenue lors de la création de l\'article'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !hasPermission('create_articles')) {
    return (
      <DashboardLayout title="Accès refusé" subtitle="Vous n'avez pas les permissions nécessaires">
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour créer des articles.
            </p>
            <Button onClick={() => navigate('/dashboard/articles')}>
              Retour aux articles
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Nouvel article" 
      subtitle="Rédigez un nouvel article pour votre blog"
      actions={
        <Button variant="outline" onClick={() => navigate('/dashboard/articles')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux articles
        </Button>
      }
    >
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title">Titre de l'article *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Le titre est requis' })}
                placeholder="Titre de l'article"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="slug">URL personnalisée *</Label>
              <Input
                id="slug"
                {...register('slug', { required: 'Le slug est requis' })}
                placeholder="url-personnalisee"
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor="summary">Résumé *</Label>
              <Textarea
                id="summary"
                {...register('summary', { required: 'Le résumé est requis' })}
                placeholder="Résumé de l'article"
                rows={3}
              />
              {errors.summary && <p className="text-sm text-red-500">{errors.summary.message}</p>}
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                {...register('content', { required: 'Le contenu est requis' })}
                placeholder="Contenu de l'article"
                rows={10}
                className="font-mono"
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Statut</Label>
              <select
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            <div>
              <Label>Catégorie *</Label>
              <select
                {...register('category_id', { required: 'La catégorie est requise' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
