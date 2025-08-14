import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  Lightbulb, Plus, Edit, Eye, ExternalLink, Brain, Target, TrendingUp, FileText
} from 'lucide-react';

export default function InsightsManagement() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user || !hasPermission('create_articles')) {
    return <DashboardLayout title="Accès refusé"><div className="text-center py-12"><button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded">Retour</button></div></DashboardLayout>;
  }

  const stats = [
    { label: 'Insights Publiés', value: '34', icon: Lightbulb, bg: 'bg-yellow-100' },
    { label: 'Analyses Profondes', value: '18', icon: Brain, bg: 'bg-purple-100' },
    { label: 'Prédictions', value: '12', icon: Target, bg: 'bg-green-100' },
    { label: 'Vues Totales', value: '8.2K', icon: TrendingUp, bg: 'bg-blue-100' },
  ];

  const sections = [
    'Analyses Approfondies', 'Prédictions Économiques', 'Tendances Émergentes', 'Perspectives Sectorielles'
  ];

  return (
    <DashboardLayout
      title="Gestion Page Insights"
      subtitle="Gérez les analyses approfondies et perspectives"
      actions={
        <div className="flex gap-4">
          <button onClick={() => window.open('/insights', '_blank')} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <ExternalLink className="w-4 h-4" />Voir la page
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg">
            <Plus className="w-4 h-4" />Nouvel insight
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-gray-600">{stat.label}</div></div>
                <div className={`p-3 rounded-lg ${stat.bg}`}><stat.icon className="w-6 h-6" /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b"><h2 className="text-xl font-semibold">Sections Insights</h2></div>
          <div className="divide-y">
            {sections.map((section, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Lightbulb className="w-8 h-8 text-yellow-600" />
                  <div><h3 className="font-medium">{section}</h3><p className="text-sm text-gray-600">Analyses et perspectives approfondies</p></div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded"><Edit className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
