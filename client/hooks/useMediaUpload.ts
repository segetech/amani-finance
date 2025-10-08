import { useState, useCallback } from 'react';

interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface ImageUploadResult {
  url: string;
  key: string;
}

interface VideoUploadResult {
  assetId: string;
  playbackId: string;
  duration?: number;
  aspectRatio?: string;
}

export const useMediaUpload = () => {
  const [imageState, setImageState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const [videoState, setVideoState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  // Upload d'image via UploadThing
  const uploadImage = useCallback(async (file: File): Promise<ImageUploadResult> => {
    setImageState({ isUploading: true, progress: 0, error: null });

    try {
      // Simulation de l'upload UploadThing
      // Dans la vraie implémentation, ceci utiliserait l'API UploadThing
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploadthing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const result = await response.json();
      
      setImageState({ isUploading: false, progress: 100, error: null });
      
      return {
        url: result.url,
        key: result.key,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setImageState({ isUploading: false, progress: 0, error: errorMessage });
      throw error;
    }
  }, []);

  // Upload de vidéo via Mux
  const uploadVideo = useCallback(async (file: File): Promise<VideoUploadResult> => {
    setVideoState({ isUploading: true, progress: 0, error: null });

    try {
      // 1. Créer une URL d'upload Mux
      const uploadResponse = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cors_origin: window.location.origin,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Impossible de créer l\'URL d\'upload');
      }

      const { data: uploadData } = await uploadResponse.json();
      const { id: uploadId, url: uploadUrl } = uploadData;

      // 2. Upload du fichier vers Mux
      const xhr = new XMLHttpRequest();
      
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setVideoState(prev => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve();
          } else {
            reject(new Error(`Erreur upload: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Erreur réseau lors de l\'upload'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // 3. Attendre que l'asset soit prêt
      let asset;
      let attempts = 0;
      const maxAttempts = 30; // 1 minute max

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const assetResponse = await fetch(`/api/mux/asset/${uploadId}`);
        if (assetResponse.ok) {
          const assetResult = await assetResponse.json();
          asset = assetResult.data;
          
          if (asset.status === 'ready' && asset.playback_ids.length > 0) {
            break;
          } else if (asset.status === 'errored') {
            throw new Error('Erreur lors du traitement de la vidéo');
          }
        }
        
        attempts++;
      }

      if (!asset || asset.status !== 'ready') {
        throw new Error('Timeout lors du traitement de la vidéo');
      }

      setVideoState({ isUploading: false, progress: 100, error: null });

      return {
        assetId: asset.id,
        playbackId: asset.playback_ids[0].id,
        duration: asset.duration,
        aspectRatio: asset.aspect_ratio,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setVideoState({ isUploading: false, progress: 0, error: errorMessage });
      throw error;
    }
  }, []);

  // Supprimer une image UploadThing
  const deleteImage = useCallback(async (key: string): Promise<void> => {
    try {
      const response = await fetch(`/api/uploadthing/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'image');
      }
    } catch (error) {
      console.error('Erreur suppression image:', error);
      throw error;
    }
  }, []);

  // Supprimer une vidéo Mux
  const deleteVideo = useCallback(async (assetId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/mux/asset/${assetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la vidéo');
      }
    } catch (error) {
      console.error('Erreur suppression vidéo:', error);
      throw error;
    }
  }, []);

  // Reset des états
  const resetImageState = useCallback(() => {
    setImageState({ isUploading: false, progress: 0, error: null });
  }, []);

  const resetVideoState = useCallback(() => {
    setVideoState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    // États
    imageState,
    videoState,
    
    // Actions
    uploadImage,
    uploadVideo,
    deleteImage,
    deleteVideo,
    resetImageState,
    resetVideoState,
    
    // Helpers
    isUploading: imageState.isUploading || videoState.isUploading,
    hasError: !!imageState.error || !!videoState.error,
    errors: {
      image: imageState.error,
      video: videoState.error,
    },
  };
};
