import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import UnifiedContentForm from "../components/UnifiedContentForm";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

export default function NewArticle() {
  const { user, hasPermission } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Check permissions
  if (!user || !hasPermission("create_articles")) {
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
              articles.
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Données de l'article:", formData);

      success(
        "Article cré��",
        `L'article "${formData.title}" a été créé avec succès.`,
      );

      navigate("/dashboard/articles");
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      error(
        "Erreur",
        "Une erreur est survenue lors de la création de l'article.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/articles");
  };

  return (
    <DashboardLayout
      title="Créer un nouvel article"
      subtitle="Rédigez un article pour informer votre audience"
      actions={
        <button
          onClick={() => navigate("/dashboard/articles")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      }
    >
      <div className="max-w-4xl mx-auto">
        {/* Formulaire unifié pour articles */}
        <UnifiedContentForm
          type="article"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}
