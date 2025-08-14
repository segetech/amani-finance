import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  DollarSign,
  Plus,
  Edit,
  Eye,
  ExternalLink,
  TrendingUp,
  PieChart,
  Target,
  Users,
} from "lucide-react";

export default function InvestissementManagement() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user || !hasPermission("create_articles")) {
    return (
      <DashboardLayout title="Accès refusé">
        <div className="text-center py-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retour
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Opportunités", value: "23", icon: Target, bg: "bg-green-100" },
    { label: "Portefeuilles", value: "8", icon: PieChart, bg: "bg-blue-100" },
    {
      label: "ROI Moyen",
      value: "12.5%",
      icon: TrendingUp,
      bg: "bg-purple-100",
    },
    { label: "Investisseurs", value: "156", icon: Users, bg: "bg-orange-100" },
  ];

  const sections = [
    "Opportunités d'Investissement",
    "Conseils Financiers",
    "Analyses de Marché",
    "Portefeuilles Recommandés",
  ];

  return (
    <DashboardLayout
      title="Gestion Page Investissement"
      subtitle="Gérez les opportunités et conseils d'investissement"
      actions={
        <div className="flex gap-4">
          <button
            onClick={() => window.open("/investissement", "_blank")}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
            Voir la page
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
            <Plus className="w-4 h-4" />
            Nouvelle opportunité
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Sections Investissement</h2>
          </div>
          <div className="divide-y">
            {sections.map((section, index) => (
              <div
                key={index}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">{section}</h3>
                    <p className="text-sm text-gray-600">
                      Gérer le contenu de cette section
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
