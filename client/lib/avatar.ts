import { supabase } from './supabase';

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Télécharger le fichier dans le bucket 'avatars'
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  // Obtenir l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Mettre à jour le profil utilisateur avec la nouvelle URL d'avatar
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (updateError) {
    throw updateError;
  }

  return publicUrl;
};

export const getAvatarUrl = (userId: string, path?: string | null) => {
  if (!path) return null;
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (path.startsWith('http')) {
    return path;
  }
  
  // Sinon, construire l'URL à partir du chemin de stockage
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
    
  return publicUrl;
};
