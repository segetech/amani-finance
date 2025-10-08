import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Upload, Video, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';

interface VideoUploaderProps {
  onUploadComplete: (assetId: string, playbackId: string) => void;
  onUploadError?: (error: Error) => void;
  currentVideo?: {
    assetId: string;
    playbackId: string;
    status?: 'waiting' | 'preparing' | 'ready' | 'errored';
  };
  onRemove?: () => void;
  className?: string;
}

interface MuxUploadResponse {
  success: boolean;
  data?: {
    id: string;
    url: string;
    status: string;
  };
  error?: string;
}

interface MuxAssetResponse {
  success: boolean;
  data?: {
    id: string;
    status: 'waiting' | 'preparing' | 'ready' | 'errored';
    playback_ids: Array<{
      id: string;
      policy: 'public' | 'signed';
    }>;
    duration?: number;
  };
  error?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  currentVideo,
  onRemove,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [assetStatus, setAssetStatus] = useState<string>('waiting');

  // Créer une URL d'upload Mux
  const createUploadUrl = useCallback(async (): Promise<string> => {
    const response = await fetch('/api/mux/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cors_origin: window.location.origin,
        encoding_tier: 'baseline',
      }),
    });

    const result: MuxUploadResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Impossible de créer l\'URL d\'upload');
    }

    setUploadId(result.data.id);
    return result.data.url;
  }, []);

  // Uploader le fichier vers Mux
  const uploadToMux = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Créer l'URL d'upload
      const uploadUrl = await createUploadUrl();

      // Upload du fichier avec suivi de progression
      const xhr = new XMLHttpRequest();
      
      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200 || xhr.status === 201) {
            // Commencer à vérifier le statut de l'asset
            if (uploadId) {
              pollAssetStatus(uploadId);
            }
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
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  }, [uploadId, createUploadUrl]);

  // Vérifier le statut de l'asset Mux
  const pollAssetStatus = useCallback(async (assetId: string) => {
    const checkStatus = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/mux/asset/${assetId}`);
        const result: MuxAssetResponse = await response.json();

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Impossible de récupérer le statut');
        }

        const asset = result.data;
        setAssetStatus(asset.status);

        if (asset.status === 'ready' && asset.playback_ids.length > 0) {
          const playbackId = asset.playback_ids[0].id;
          setIsUploading(false);
          onUploadComplete(asset.id, playbackId);
        } else if (asset.status === 'errored') {
          setIsUploading(false);
          onUploadError?.(new Error('Erreur lors du traitement de la vidéo'));
        } else {
          // Continuer à vérifier le statut
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        setIsUploading(false);
        onUploadError?.(error as Error);
      }
    };

    checkStatus();
  }, [onUploadComplete, onUploadError]);

  // Gérer la sélection de fichier
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifications basiques
    if (!file.type.startsWith('video/')) {
      onUploadError?.(new Error('Veuillez sélectionner un fichier vidéo'));
      return;
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB max
      onUploadError?.(new Error('Le fichier est trop volumineux (max 500MB)'));
      return;
    }

    try {
      await uploadToMux(file);
    } catch (error) {
      onUploadError?.(error as Error);
    }
  }, [uploadToMux, onUploadError]);

  const getStatusIcon = () => {
    switch (assetStatus) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'errored':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (assetStatus) {
      case 'ready':
        return 'Vidéo prête';
      case 'errored':
        return 'Erreur de traitement';
      case 'preparing':
        return 'Traitement en cours...';
      default:
        return 'En attente...';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentVideo?.playbackId ? (
        <div className="relative group">
          <MuxPlayer
            playbackId={currentVideo.playbackId}
            metadata={{
              video_title: "Vidéo uploadée",
            }}
            className="w-full rounded-lg"
            style={{ height: '300px' }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {isUploading ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <>
                  <p className="text-sm text-gray-600 mb-2">Upload: {uploadProgress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </>
              )}
              
              {uploadProgress === 100 && assetStatus === 'preparing' && (
                <p className="text-sm text-gray-600">
                  Upload terminé. Traitement de la vidéo en cours...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Glissez une vidéo ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Formats acceptés: MP4, MOV, AVI (max 500MB)
              </p>
              
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              
              <label htmlFor="video-upload">
                <Button asChild className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choisir une vidéo
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
