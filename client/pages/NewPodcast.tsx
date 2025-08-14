import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import UnifiedContentForm from "../components/UnifiedContentForm";
import { ArrowLeft, Mic, AlertCircle } from "lucide-react";

export default function NewPodcast() {
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Check permissions
  if (!user || !hasPermission("create_podcasts")) {
    return (
      <DashboardLayout
        title="Accès refusé"
        subtitle="Vous n'avez pas les permissions nécessaires"
      >
        <div className="flex items-center justify-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès refusé
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour créer des
              podcasts.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Données du podcast:", formData);

      success(
        "Podcast créé",
        `Le podcast "${formData.title}" a été créé avec succès.`
      );

      navigate("/dashboard/podcasts");
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      error("Erreur", "Une erreur est survenue lors de la création du podcast.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/podcasts");
  };

  return (
    <DashboardLayout
      title="Créer un nouveau podcast"
      subtitle="Partagez vos analyses audio en utilisant des liens externes"
      actions={
        <button
          onClick={() => navigate("/dashboard/podcasts")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      }
    >
      <div className="max-w-4xl mx-auto">
        {/* En-tête avec informations */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nouveau Podcast
              </h2>
              <p className="text-purple-700">
                Utilisez des liens externes (Anchor, Spotify, etc.)
              </p>
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              💡 Comment ça marche ?
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Hébergez votre podcast sur Anchor, Spotify, ou une autre plateforme</li>
              <li>• Copiez les liens de vos épisodes</li>
              <li>• Ajoutez le résumé obligatoire pour l'extrait</li>
              <li>• Le contenu complet est optionnel</li>
            </ul>
          </div>
        </div>

        {/* Formulaire unifié pour podcasts */}
        <UnifiedContentForm
          type="podcast"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}
