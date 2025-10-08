import Mux from '@mux/mux-node';

// Configuration Mux
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export interface MuxAsset {
  id: string;
  status: 'waiting' | 'preparing' | 'ready' | 'errored';
  playback_ids: Array<{
    id: string;
    policy: 'public' | 'signed';
  }>;
  duration?: number;
  aspect_ratio?: string;
  created_at: string;
}

export interface MuxUploadUrl {
  id: string;
  url: string;
  status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';
}

// Créer une URL d'upload direct pour les vidéos
export const createMuxUploadUrl = async (options?: {
  cors_origin?: string;
  new_asset_settings?: {
    playback_policy?: Array<'public' | 'signed'>;
    encoding_tier?: 'baseline' | 'smart';
  };
}): Promise<MuxUploadUrl> => {
  try {
    const upload = await mux.video.uploads.create({
      cors_origin: options?.cors_origin || '*',
      new_asset_settings: {
        playback_policy: options?.new_asset_settings?.playback_policy || ['public'],
        encoding_tier: options?.new_asset_settings?.encoding_tier || 'baseline',
      },
    });

    return {
      id: upload.id!,
      url: upload.url!,
      status: upload.status as any,
    };
  } catch (error) {
    console.error('Erreur création URL upload Mux:', error);
    throw new Error('Impossible de créer l\'URL d\'upload Mux');
  }
};

// Récupérer les informations d'un asset Mux
export const getMuxAsset = async (assetId: string): Promise<MuxAsset> => {
  try {
    const asset = await mux.video.assets.retrieve(assetId);
    
    return {
      id: asset.id!,
      status: asset.status as any,
      playback_ids: asset.playback_ids?.map(pb => ({
        id: pb.id!,
        policy: pb.policy as any,
      })) || [],
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      created_at: asset.created_at!,
    };
  } catch (error) {
    console.error('Erreur récupération asset Mux:', error);
    throw new Error('Impossible de récupérer l\'asset Mux');
  }
};

// Supprimer un asset Mux
export const deleteMuxAsset = async (assetId: string): Promise<void> => {
  try {
    await mux.video.assets.delete(assetId);
  } catch (error) {
    console.error('Erreur suppression asset Mux:', error);
    throw new Error('Impossible de supprimer l\'asset Mux');
  }
};

// Générer l'URL de lecture pour un playback_id
export const getMuxPlaybackUrl = (playbackId: string, options?: {
  token?: string;
  thumbnail_time?: number;
}): string => {
  const baseUrl = `https://stream.mux.com/${playbackId}.m3u8`;
  
  if (options?.token) {
    return `${baseUrl}?token=${options.token}`;
  }
  
  return baseUrl;
};

// Générer l'URL de thumbnail
export const getMuxThumbnailUrl = (playbackId: string, options?: {
  width?: number;
  height?: number;
  fit_mode?: 'preserve' | 'crop' | 'pad';
  time?: number;
}): string => {
  const params = new URLSearchParams();
  
  if (options?.width) params.set('width', options.width.toString());
  if (options?.height) params.set('height', options.height.toString());
  if (options?.fit_mode) params.set('fit_mode', options.fit_mode);
  if (options?.time) params.set('time', options.time.toString());
  
  const queryString = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
};

export { mux };
