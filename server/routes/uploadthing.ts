import { createUploadthing } from "uploadthing/server";
import { RequestHandler } from "express";
import { ourFileRouter } from "../uploadthing";

// Adapter UploadThing pour Express
export const handleUploadThing: RequestHandler = async (req, res) => {
  try {
    // Pour l'instant, retourner une réponse simple
    // L'intégration complète nécessiterait plus de configuration
    res.json({ 
      message: "UploadThing endpoint - configuration en cours",
      method: req.method 
    });
  } catch (error) {
    console.error('Erreur UploadThing:', error);
    res.status(500).json({ error: 'Erreur serveur UploadThing' });
  }
};
