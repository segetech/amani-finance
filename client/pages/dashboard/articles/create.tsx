import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import DashboardLayout from '../../../components/DashboardLayout';
import UnifiedContentForm from '../../../components/UnifiedContentForm';
import { ContentType } from '../../../types/database';
import { supabase } from '../../../lib/supabase';

export default function CreateArticle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: any) => {
    if (!user) {
      showError('Vous devez être connecté pour créer un article');
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données pour l'insertion
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content || '',
        type: 'article' as ContentType,
        status: formData.status,
        category_id: formData.category,
        author_id: user.id,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.summary?.substring(0, 160),
        featured_image_alt: formData.featured_image_alt || formData.title,
        tags: formData.tags || [],
        article_data: {
          // Ajoutez ici les champs spécifiques aux articles si nécessaire
        }
      };

      // Insérer l'article dans la base de données
      const { data, error } = await supabase
        .from('contents')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;

      success('Article créé avec succès !');
      navigate(`/dashboard/articles/${data.slug || data.id}`);
    } catch (err) {
      console.error('Erreur lors de la création de l\'article:', err);
      showError('Une erreur est survenue lors de la création de l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout 
      title="Nouvel article" 
      subtitle="Créez un nouvel article pour votre blog"
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <UnifiedContentForm
          type="article"
          onSave={handleSave}
          onCancel={() => navigate('/dashboard/articles')}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}
