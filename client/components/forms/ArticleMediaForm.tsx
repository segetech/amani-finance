import React, { useState } from 'react';
import { ImageUploader } from '../media/ImageUploader';
import { VideoUploader } from '../media/VideoUploader';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Image, Video, FileText } from 'lucide-react';

interface ArticleMediaFormProps {
  onSave: (data: {
    featuredImage?: string;
    videoAssetId?: string;
    videoPlaybackId?: string;
  }) => void;
  initialData?: {
    featuredImage?: string;
    videoAssetId?: string;
    videoPlaybackId?: string;
  };
}

export const ArticleMediaForm: React.FC<ArticleMediaFormProps> = ({
  onSave,
  initialData
}) => {
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(
    initialData?.featuredImage
  );
  const [videoData, setVideoData] = useState<{
    assetId?: string;
    playbackId?: string;
  }>({
    assetId: initialData?.videoAssetId,
    playbackId: initialData?.videoPlaybackId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (url: string) => {
    setFeaturedImage(url);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleImageError = (error: Error) => {
    setErrors(prev => ({ ...prev, image: error.message }));
  };

  const handleVideoUpload = (assetId: string, playbackId: string) => {
    setVideoData({ assetId, playbackId });
    setErrors(prev => ({ ...prev, video: '' }));
  };

  const handleVideoError = (error: Error) => {
    setErrors(prev => ({ ...prev, video: error.message }));
  };

  const handleSave = () => {
    onSave({
      featuredImage,
      videoAssetId: videoData.assetId,
      videoPlaybackId: videoData.playbackId,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Médias de l'article
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image de couverture
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vidéo (optionnel)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Image de couverture</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ajoutez une image de couverture pour votre article. Elle sera affichée 
                  dans les listes d'articles et en haut de l'article.
                </p>
                
                <ImageUploader
                  onUploadComplete={handleImageUpload}
                  onUploadError={handleImageError}
                  currentImage={featuredImage}
                  onRemove={() => setFeaturedImage(undefined)}
                  maxFileSize="4MB"
                />
                
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Vidéo d'accompagnement</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ajoutez une vidéo pour enrichir votre article. La vidéo sera hébergée 
                  sur Mux pour une lecture optimale.
                </p>
                
                <VideoUploader
                  onUploadComplete={handleVideoUpload}
                  onUploadError={handleVideoError}
                  currentVideo={videoData.playbackId ? {
                    assetId: videoData.assetId!,
                    playbackId: videoData.playbackId,
                  } : undefined}
                  onRemove={() => setVideoData({})}
                />
                
                {errors.video && (
                  <p className="text-red-500 text-sm mt-2">{errors.video}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sauvegarder les médias
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des médias sélectionnés */}
      {(featuredImage || videoData.playbackId) && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des médias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredImage && (
              <div>
                <h4 className="font-medium mb-2">Image de couverture</h4>
                <img
                  src={featuredImage}
                  alt="Aperçu image de couverture"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <p className="text-sm text-gray-600 mt-1">
                  URL: {featuredImage}
                </p>
              </div>
            )}
            
            {videoData.playbackId && (
              <div>
                <h4 className="font-medium mb-2">Vidéo</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Asset ID:</strong> {videoData.assetId}
                  </p>
                  <p className="text-sm">
                    <strong>Playback ID:</strong> {videoData.playbackId}
                  </p>
                  <p className="text-sm text-gray-600">
                    La vidéo sera intégrée dans l'article avec le lecteur Mux.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
