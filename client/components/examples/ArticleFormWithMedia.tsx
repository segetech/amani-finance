import React, { useState } from 'react';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { ImageUploader } from '../media/ImageUploader';
import { VideoUploader } from '../media/VideoUploader';
import { MuxVideoPlayer, MuxThumbnail } from '../media/MuxVideoPlayer';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, Eye, FileText, Image, Video } from 'lucide-react';

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  category_id: string;
  tags: string[];
  // Médias
  featured_image?: string;
  uploadthing_image_key?: string;
  mux_asset_id?: string;
  mux_playback_id?: string;
  video_duration?: number;
  video_aspect_ratio?: string;
}

export const ArticleFormWithMedia: React.FC = () => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    summary: '',
    content: '',
    category_id: '',
    tags: [],
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    imageState,
    videoState,
    uploadImage,
    uploadVideo,
    deleteImage,
    deleteVideo,
    isUploading,
  } = useMediaUpload();

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        featured_image: result.url,
        uploadthing_image_key: result.key,
      }));
    } catch (error) {
      console.error('Erreur upload image:', error);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      const result = await uploadVideo(file);
      setFormData(prev => ({
        ...prev,
        mux_asset_id: result.assetId,
        mux_playback_id: result.playbackId,
        video_duration: result.duration,
        video_aspect_ratio: result.aspectRatio,
      }));
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.uploadthing_image_key) {
      try {
        await deleteImage(formData.uploadthing_image_key);
      } catch (error) {
        console.error('Erreur suppression image:', error);
      }
    }
    setFormData(prev => ({
      ...prev,
      featured_image: undefined,
      uploadthing_image_key: undefined,
    }));
  };

  const handleRemoveVideo = async () => {
    if (formData.mux_asset_id) {
      try {
        await deleteVideo(formData.mux_asset_id);
      } catch (error) {
        console.error('Erreur suppression vidéo:', error);
      }
    }
    setFormData(prev => ({
      ...prev,
      mux_asset_id: undefined,
      mux_playback_id: undefined,
      video_duration: undefined,
      video_aspect_ratio: undefined,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ici vous intégreriez avec votre hook useArticles
      console.log('Sauvegarde article:', formData);
      
      // Exemple d'appel API
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Article sauvegardé avec succès!');
        // Redirection ou notification de succès
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreview) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Aperçu de l'article</h1>
          <Button onClick={() => setIsPreview(false)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Retour à l'édition
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {formData.featured_image && (
              <img
                src={formData.featured_image}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <h1 className="text-4xl font-bold mb-4">{formData.title || 'Titre de l\'article'}</h1>
            <p className="text-xl text-gray-600 mb-6">{formData.summary || 'Résumé de l\'article'}</p>

            {formData.mux_playback_id && (
              <div className="mb-6">
                <MuxVideoPlayer
                  playbackId={formData.mux_playback_id}
                  title={formData.title}
                  aspectRatio={formData.video_aspect_ratio}
                />
              </div>
            )}

            <div className="prose max-w-none">
              {formData.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Créer un article</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsPreview(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isUploading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu de l'article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Titre de votre article"
                />
              </div>

              <div>
                <Label htmlFor="summary">Résumé</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Résumé de votre article"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Contenu complet de votre article"
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Médias */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Médias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="image" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="video">Vidéo</TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-4">
                  <div>
                    <Label>Image de couverture</Label>
                    {formData.featured_image ? (
                      <div className="mt-2">
                        <img
                          src={formData.featured_image}
                          alt="Image de couverture"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          onClick={handleRemoveImage}
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imageState.isUploading && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${imageState.progress}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Upload: {imageState.progress}%
                            </p>
                          </div>
                        )}
                        {imageState.error && (
                          <p className="text-red-500 text-sm mt-2">{imageState.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  <div>
                    <Label>Vidéo d'accompagnement</Label>
                    {formData.mux_playback_id ? (
                      <div className="mt-2 space-y-2">
                        <MuxThumbnail
                          playbackId={formData.mux_playback_id}
                          width={300}
                          height={169}
                          className="w-full h-32 rounded-lg"
                        />
                        <Button
                          onClick={handleRemoveVideo}
                          variant="destructive"
                          size="sm"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {videoState.isUploading && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${videoState.progress}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {videoState.progress < 100 
                                ? `Upload: ${videoState.progress}%` 
                                : 'Traitement en cours...'}
                            </p>
                          </div>
                        )}
                        {videoState.error && (
                          <p className="text-red-500 text-sm mt-2">{videoState.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
