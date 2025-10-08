import React from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface MuxVideoPlayerProps {
  playbackId: string;
  title?: string;
  poster?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onLoadedData?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export const MuxVideoPlayer: React.FC<MuxVideoPlayerProps> = ({
  playbackId,
  title = 'Vidéo',
  poster,
  aspectRatio = '16:9',
  autoPlay = false,
  muted = false,
  controls = true,
  className = '',
  onLoadedData,
  onError,
  onEnded,
  onPlay,
  onPause,
}) => {
  // Calculer la hauteur basée sur l'aspect ratio
  const getAspectRatioStyle = () => {
    if (aspectRatio) {
      const [width, height] = aspectRatio.split(':').map(Number);
      const paddingTop = (height / width) * 100;
      return { paddingTop: `${paddingTop}%` };
    }
    return { paddingTop: '56.25%' }; // 16:9 par défaut
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative" style={getAspectRatioStyle()}>
        <MuxPlayer
          playbackId={playbackId}
          metadata={{
            video_title: title,
          }}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          onLoadedData={onLoadedData}
          onError={onError}
          onEnded={onEnded}
          onPlay={onPlay}
          onPause={onPause}
          className="absolute inset-0 w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

// Composant pour afficher une thumbnail Mux
interface MuxThumbnailProps {
  playbackId: string;
  time?: number;
  width?: number;
  height?: number;
  fitMode?: 'preserve' | 'crop' | 'pad';
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export const MuxThumbnail: React.FC<MuxThumbnailProps> = ({
  playbackId,
  time = 0,
  width = 640,
  height = 360,
  fitMode = 'crop',
  alt = 'Thumbnail vidéo',
  className = '',
  onClick,
}) => {
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}&width=${width}&height=${height}&fit_mode=${fitMode}`;

  return (
    <img
      src={thumbnailUrl}
      alt={alt}
      className={`object-cover ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      loading="lazy"
    />
  );
};

// Composant pour afficher les informations d'une vidéo Mux
interface MuxVideoInfoProps {
  assetId: string;
  playbackId: string;
  duration?: number;
  aspectRatio?: string;
  className?: string;
}

export const MuxVideoInfo: React.FC<MuxVideoInfoProps> = ({
  assetId,
  playbackId,
  duration,
  aspectRatio,
  className = '',
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Durée inconnue';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gray-50 p-4 rounded-lg space-y-2 ${className}`}>
      <h4 className="font-medium text-gray-900">Informations vidéo</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Asset ID:</span>
          <p className="font-mono text-xs break-all">{assetId}</p>
        </div>
        <div>
          <span className="text-gray-600">Playback ID:</span>
          <p className="font-mono text-xs break-all">{playbackId}</p>
        </div>
        {duration && (
          <div>
            <span className="text-gray-600">Durée:</span>
            <p>{formatDuration(duration)}</p>
          </div>
        )}
        {aspectRatio && (
          <div>
            <span className="text-gray-600">Format:</span>
            <p>{aspectRatio}</p>
          </div>
        )}
      </div>
    </div>
  );
};
