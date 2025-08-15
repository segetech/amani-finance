// Code à utiliser dans client/pages/Profile.tsx après l'exécution de la migration SQL

// Remplacer la fonction handleSaveProfile par :
const handleSaveProfile = async () => {
  if (!user?.id) {
    error("Erreur", "Utilisateur non connecté.");
    return;
  }

  try {
    setIsSaving(true);
    
    // Mettre à jour le profil dans Supabase (toutes les colonnes après migration)
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        organization: profileData.organization,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        website: profileData.website,
        linkedin: profileData.linkedIn,
        twitter: profileData.twitter,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour du profil:', updateError);
      error("Erreur", "Une erreur est survenue lors de la sauvegarde.");
      return;
    }

    // Mettre à jour l'email si nécessaire
    if (profileData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email
      });

      if (emailError) {
        console.error('Erreur lors de la mise à jour de l\'email:', emailError);
        error("Erreur", "Une erreur est survenue lors de la mise à jour de l'email.");
        return;
      }
    }

    success(
      "Profil mis à jour",
      "Vos informations ont été sauvegardées avec succès.",
    );
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err);
    error("Erreur", "Une erreur inattendue est survenue.");
  } finally {
    setIsSaving(false);
  }
};

// Remplacer la fonction handleSavePreferences par :
const handleSavePreferences = async () => {
  if (!user?.id) {
    error("Erreur", "Utilisateur non connecté.");
    return;
  }

  try {
    setIsSaving(true);
    
    // Mettre à jour les préférences dans Supabase (après migration)
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour des préférences:', updateError);
      error("Erreur", "Une erreur est survenue lors de la sauvegarde des préférences.");
      return;
    }

    success(
      "Préférences mises à jour",
      "Vos préférences ont été sauvegardées avec succès.",
    );
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des préférences:', err);
    error("Erreur", "Une erreur inattendue est survenue.");
  } finally {
    setIsSaving(false);
  }
};
