import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
// Fonction d'authentification - à adapter selon votre système d'auth
const auth = (req: any) => ({ id: "fakeId" }); // TODO: Remplacer par votre auth réelle
 
export const ourFileRouter = {
  // Route pour les images d'articles
  articleImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Vérifier l'authentification
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé pour userId:", metadata.userId);
      console.log("URL du fichier:", file.url);
      
      // Ici vous pouvez sauvegarder l'URL en base si nécessaire
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Route pour les images de couverture de podcasts
  podcastCoverUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Couverture podcast uploadée:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // Route pour les fichiers audio de podcasts (optionnel si vous préférez Mux)
  podcastAudioUploader: f({ audio: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio podcast uploadé:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
