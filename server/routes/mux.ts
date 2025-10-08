import { RequestHandler } from 'express';
import { createMuxUploadUrl, getMuxAsset, deleteMuxAsset } from '../lib/mux';

// Créer une URL d'upload pour une vidéo
export const createVideoUploadUrl: RequestHandler = async (req, res) => {
  try {
    const { cors_origin, encoding_tier } = req.body;
    
    const uploadUrl = await createMuxUploadUrl({
      cors_origin,
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: encoding_tier || 'baseline',
      },
    });
    
    res.json({
      success: true,
      data: uploadUrl,
    });
  } catch (error) {
    console.error('Erreur création URL upload:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de créer l\'URL d\'upload',
    });
  }
};

// Récupérer le statut d'un asset Mux
export const getAssetStatus: RequestHandler = async (req, res) => {
  try {
    const { assetId } = req.params;
    
    if (!assetId) {
      return res.status(400).json({
        success: false,
        error: 'Asset ID requis',
      });
    }
    
    const asset = await getMuxAsset(assetId);
    
    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    console.error('Erreur récupération asset:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de récupérer l\'asset',
    });
  }
};

// Supprimer un asset Mux
export const deleteAsset: RequestHandler = async (req, res) => {
  try {
    const { assetId } = req.params;
    
    if (!assetId) {
      return res.status(400).json({
        success: false,
        error: 'Asset ID requis',
      });
    }
    
    await deleteMuxAsset(assetId);
    
    res.json({
      success: true,
      message: 'Asset supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression asset:', error);
    res.status(500).json({
      success: false,
      error: 'Impossible de supprimer l\'asset',
    });
  }
};
