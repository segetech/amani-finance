# Configuration des médias - UploadThing & Mux

## 🖼️ Configuration UploadThing (Images)

### 1. Créer un compte UploadThing
1. Allez sur [uploadthing.com](https://uploadthing.com)
2. Créez un compte ou connectez-vous
3. Créez une nouvelle application

### 2. Récupérer les clés API
1. Dans votre dashboard UploadThing
2. Allez dans **Settings** > **API Keys**
3. Copiez votre `Secret Key` et `App ID`

### 3. Configurer les variables d'environnement
Remplacez dans votre `.env` :
```env
UPLOADTHING_SECRET=sk_live_VOTRE_CLE_SECRETE_ICI
UPLOADTHING_APP_ID=VOTRE_APP_ID_ICI
```

### 4. Configuration des endpoints
Les endpoints sont déjà configurés dans `server/uploadthing.ts` :
- `articleImageUploader` : Images d'articles (max 4MB)
- `podcastCoverUploader` : Couvertures de podcasts (max 2MB)
- `podcastAudioUploader` : Audio de podcasts (max 32MB)

## 🎥 Configuration Mux (Vidéos)

### 1. Créer un compte Mux
1. Allez sur [mux.com](https://mux.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau environnement

### 2. Récupérer les tokens API
1. Dans votre dashboard Mux
2. Allez dans **Settings** > **Access Tokens**
3. Créez un nouveau token avec les permissions :
   - `Video` : Read, Write
   - `Data` : Read (optionnel)

### 3. Configurer les variables d'environnement
Remplacez dans votre `.env` :
```env
MUX_TOKEN_ID=VOTRE_TOKEN_ID_ICI
MUX_TOKEN_SECRET=VOTRE_TOKEN_SECRET_ICI
```

## 🚀 Utilisation dans l'application

### Composants disponibles

1. **ImageUploader** - Upload d'images via UploadThing
```tsx
import { ImageUploader } from '@/components/media/ImageUploader';

<ImageUploader
  onUploadComplete={(url) => console.log('Image uploadée:', url)}
  onUploadError={(error) => console.error('Erreur:', error)}
  currentImage={imageUrl}
  onRemove={() => setImageUrl(undefined)}
/>
```

2. **VideoUploader** - Upload de vidéos via Mux
```tsx
import { VideoUploader } from '@/components/media/VideoUploader';

<VideoUploader
  onUploadComplete={(assetId, playbackId) => {
    console.log('Vidéo uploadée:', { assetId, playbackId });
  }}
  onUploadError={(error) => console.error('Erreur:', error)}
  currentVideo={{ assetId: 'asset_id', playbackId: 'playback_id' }}
  onRemove={() => setVideoData({})}
/>
```

3. **ArticleMediaForm** - Formulaire complet pour les médias
```tsx
import { ArticleMediaForm } from '@/components/forms/ArticleMediaForm';

<ArticleMediaForm
  onSave={(data) => {
    console.log('Médias sauvegardés:', data);
    // data.featuredImage - URL de l'image UploadThing
    // data.videoAssetId - ID de l'asset Mux
    // data.videoPlaybackId - ID de lecture Mux
  }}
  initialData={{
    featuredImage: 'https://utfs.io/f/...',
    videoAssetId: 'asset_123',
    videoPlaybackId: 'playback_456'
  }}
/>
```

## 📊 Intégration avec la base de données

### Mise à jour du schéma de contenu

Ajoutez ces champs à votre table `contents` :

```sql
-- Pour les images UploadThing
ALTER TABLE contents ADD COLUMN uploadthing_image_url TEXT;
ALTER TABLE contents ADD COLUMN uploadthing_image_key TEXT;

-- Pour les vidéos Mux
ALTER TABLE contents ADD COLUMN mux_asset_id TEXT;
ALTER TABLE contents ADD COLUMN mux_playback_id TEXT;
ALTER TABLE contents ADD COLUMN video_duration INTEGER; -- en secondes
ALTER TABLE contents ADD COLUMN video_aspect_ratio TEXT;
```

### Exemple d'utilisation dans useArticles

```typescript
const createArticle = async (articleData: ArticleData) => {
  const article = {
    ...articleData,
    // Image UploadThing
    featured_image: articleData.uploadthing_image_url,
    uploadthing_image_key: articleData.uploadthing_image_key,
    
    // Vidéo Mux
    article_data: {
      ...articleData.article_data,
      mux_asset_id: articleData.mux_asset_id,
      mux_playback_id: articleData.mux_playback_id,
      video_duration: articleData.video_duration,
    }
  };
  
  // Insérer en base...
};
```

## 🎯 Avantages de cette configuration

### UploadThing
- ✅ Upload direct depuis le client
- ✅ Optimisation automatique des images
- ✅ CDN global pour des performances optimales
- ✅ Gestion automatique des formats (WebP, AVIF)
- ✅ Redimensionnement à la volée

### Mux
- ✅ Encodage vidéo adaptatif (HLS)
- ✅ Streaming optimisé selon la bande passante
- ✅ Thumbnails automatiques
- ✅ Analytics vidéo détaillées
- ✅ Protection contre le hotlinking
- ✅ Lecteur vidéo optimisé

## 🔧 Prochaines étapes

1. **Configurez vos comptes** UploadThing et Mux
2. **Ajoutez vos clés API** dans le fichier `.env`
3. **Testez les uploads** avec les composants fournis
4. **Intégrez dans vos formulaires** d'articles et podcasts
5. **Mettez à jour votre schéma de base** si nécessaire

## 🛠️ Dépannage

### Erreurs communes UploadThing
- **"Unauthorized"** : Vérifiez votre `UPLOADTHING_SECRET`
- **"File too large"** : Ajustez `maxFileSize` dans la configuration
- **CORS errors** : Vérifiez la configuration des domaines autorisés

### Erreurs communes Mux
- **"Invalid credentials"** : Vérifiez `MUX_TOKEN_ID` et `MUX_TOKEN_SECRET`
- **"Asset not found"** : L'asset peut encore être en cours de traitement
- **Upload timeout** : Les gros fichiers peuvent prendre du temps à traiter

## 📞 Support

- **UploadThing** : [Documentation](https://docs.uploadthing.com)
- **Mux** : [Documentation](https://docs.mux.com)
- **Issues** : Créez une issue dans le repo du projet
