import React, { useState } from 'react';
import { ArticleFormWithMedia } from '../components/examples/ArticleFormWithMedia';
import { ImageUploader } from '../components/media/ImageUploader';
import { VideoUploader } from '../components/media/VideoUploader';
import { MuxVideoPlayer } from '../components/media/MuxVideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Upload, Image, Video, FileText, CheckCircle, Database } from 'lucide-react';
import { CategoriesDebug } from '../components/debug/CategoriesDebug';

export default function TestMedia() {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedVideo, setUploadedVideo] = useState<{
    assetId: string;
    playbackId: string;
  } | null>(null);
  const [testResults, setTestResults] = useState<{
    uploadthing: boolean;
    mux: boolean;
  }>({ uploadthing: false, mux: false });

  const handleImageUpload = (url: string) => {
    setUploadedImage(url);
    setTestResults(prev => ({ ...prev, uploadthing: true }));
  };

  const handleVideoUpload = (assetId: string, playbackId: string) => {
    setUploadedVideo({ assetId, playbackId });
    setTestResults(prev => ({ ...prev, mux: true }));
  };

  const testApiEndpoints = async () => {
    try {
      // Test ping
      const pingResponse = await fetch('/api/ping');
      const pingData = await pingResponse.json();
      console.log('Ping test:', pingData);

      // Test UploadThing endpoint
      const utResponse = await fetch('/api/uploadthing');
      const utData = await utResponse.json();
      console.log('UploadThing endpoint test:', utData);

      // Test Mux upload endpoint
      const muxResponse = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cors_origin: window.location.origin })
      });
      const muxData = await muxResponse.json();
      console.log('Mux upload endpoint test:', muxData);

    } catch (error) {
      console.error('Erreur test API:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test des médias - UploadThing & Mux
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Testez l'upload d'images et de vidéos pour votre application Amani Finance
          </p>
          
          {/* Status indicators */}
          <div className="flex justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              testResults.uploadthing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {testResults.uploadthing ? <CheckCircle className="w-4 h-4" /> : <Image className="w-4 h-4" />}
              UploadThing {testResults.uploadthing ? 'OK' : 'En attente'}
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              testResults.mux ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {testResults.mux ? <CheckCircle className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              Mux {testResults.mux ? 'OK' : 'En attente'}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button onClick={testApiEndpoints} variant="outline">
              Tester les endpoints API
            </Button>
            <Button 
              onClick={() => window.open('/test-article-form', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Test formulaire article
            </Button>
          </div>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Tests individuels</TabsTrigger>
            <TabsTrigger value="complete">Formulaire complet</TabsTrigger>
            <TabsTrigger value="debug">Debug catégories</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test UploadThing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Test UploadThing (Images)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    onUploadComplete={handleImageUpload}
                    onUploadError={(error) => {
                      console.error('Erreur UploadThing:', error);
                      alert('Erreur UploadThing: ' + error.message);
                    }}
                    currentImage={uploadedImage}
                    onRemove={() => setUploadedImage('')}
                  />
                  
                  {uploadedImage && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">✅ Image uploadée avec succès !</p>
                      <p className="text-xs text-green-600 mt-1 break-all">
                        URL: {uploadedImage}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Test Mux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Test Mux (Vidéos)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoUploader
                    onUploadComplete={handleVideoUpload}
                    onUploadError={(error) => {
                      console.error('Erreur Mux:', error);
                      alert('Erreur Mux: ' + error.message);
                    }}
                    currentVideo={uploadedVideo ? {
                      assetId: uploadedVideo.assetId,
                      playbackId: uploadedVideo.playbackId,
                    } : undefined}
                    onRemove={() => setUploadedVideo(null)}
                  />
                  
                  {uploadedVideo && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">✅ Vidéo uploadée avec succès !</p>
                      <p className="text-xs text-green-600 mt-1">
                        Asset ID: {uploadedVideo.assetId}
                      </p>
                      <p className="text-xs text-green-600">
                        Playback ID: {uploadedVideo.playbackId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lecteur vidéo si vidéo uploadée */}
            {uploadedVideo && (
              <Card>
                <CardHeader>
                  <CardTitle>Lecteur vidéo Mux</CardTitle>
                </CardHeader>
                <CardContent>
                  <MuxVideoPlayer
                    playbackId={uploadedVideo.playbackId}
                    title="Vidéo de test"
                    className="max-w-2xl mx-auto"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="complete">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Formulaire d'article complet avec médias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleFormWithMedia />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debug">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Debug des catégories Supabase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Vérifiez que les catégories se chargent correctement depuis Supabase
                  </p>
                  <CategoriesDebug />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Test UploadThing (Images)</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Glissez une image ou cliquez pour sélectionner</li>
                <li>• Formats supportés: JPG, PNG, WebP (max 4MB)</li>
                <li>• L'image sera uploadée sur UploadThing CDN</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Test Mux (Vidéos)</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Sélectionnez un fichier vidéo (MP4, MOV, AVI)</li>
                <li>• Taille max: 500MB</li>
                <li>• La vidéo sera encodée automatiquement par Mux</li>
                <li>• Le lecteur apparaîtra une fois l'encodage terminé</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Intégration dans vos articles</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Utilisez les composants dans vos formulaires d'articles</li>
                <li>• Sauvegardez les URLs/IDs dans votre base de données</li>
                <li>• Affichez les médias dans vos pages d'articles</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
