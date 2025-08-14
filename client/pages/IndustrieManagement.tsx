import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ExternalLink,
  Factory,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

export default function IndustrieManagement() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user || !hasPermission("create_articles")) {
    return (
      <DashboardLayout title="Accès refusé">
        <div className="text-center py-12">
          <p>Permissions insuffisantes pour gérer la page Industrie.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retour
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      label: "Secteurs suivis",
      value: "8",
      icon: Factory,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Entreprises",
      value: "45",
      icon: Building,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Rapports",
      value: "12",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Emplois",
      value: "2.3K",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const sections = [
    { id: "1", title: "Secteur Minier", type: "mining", status: "active" },
    { id: "2", title: "Industrie Textile", type: "textile", status: "active" },
    { id: "3", title: "Agroalimentaire", type: "agro", status: "active" },
    { id: "4", title: "Énergie & Pétrole", type: "energy", status: "active" },
  ];

  return (
    <DashboardLayout
      title="Gestion Page Industrie"
      subtitle="Gérez le contenu industriel de la page publique"
      actions={
        <div className="flex gap-4">
          <button
            onClick={() => window.open("/industrie", "_blank")}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
            Voir la page
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Plus className="w-4 h-4" />
            Ajouter contenu
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Secteurs Industriels</h2>
          </div>
          <div className="divide-y">
            {sections.map((section) => (
              <div
                key={section.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm text-gray-600">
                      Données et analyses du secteur
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
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
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
