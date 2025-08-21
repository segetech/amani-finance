import {
  LayoutDashboard,
  FileText,
  Mic,
  BarChart3,
  Users,
  Settings,
  Shield,
  LogOut,
  FolderOpen,
  Globe,
  Building,
  DollarSign,
  Lightbulb,
  Cpu,
  Headphones,
  PieChart,
  Activity,
} from "lucide-react";
import { MenuItem, MenuSection } from './types';

export const menuSections: MenuSection[] = [
  {
    title: '🏠 Accueil',
    items: [
      {
        label: 'Tableau de bord',
        path: '/dashboard',
        icon: LayoutDashboard,
        description: "Vue d'ensemble",
        permission: 'view_dashboard',
      },
    ],
  },
  {
    title: '✏️ Création de contenu',
    items: [
      {
        label: 'Articles',
        path: '/dashboard/articles',
        icon: FileText,
        permission: 'view_articles',
        items: [
          { label: 'Tous les articles', path: '/dashboard/articles', icon: FileText, permission: 'view_articles' },
          { label: 'Nouvel article', path: '/dashboard/articles/new', icon: FileText, permission: 'create_articles' },
        ],
      },
      {
        label: 'Podcasts',
        path: '/dashboard/podcasts',
        icon: Headphones,
        permission: 'view_podcasts',
        items: [
          { label: 'Tous les podcasts', path: '/dashboard/podcasts', icon: Headphones, permission: 'view_podcasts' },
          { label: 'Nouveau podcast', path: '/dashboard/podcasts/new', icon: Headphones, permission: 'create_podcasts' },
        ],
      },
      {
        label: 'Indices',
        path: '/dashboard/indices-management',
        icon: BarChart3,
        permission: 'view_indices',
        items: [
          { label: 'Tous les indices', path: '/dashboard/indices-management', icon: BarChart3, permission: 'view_indices' },
          { label: 'Nouvel indice', path: '/dashboard/indices/new', icon: BarChart3, permission: 'create_indices' },
        ],
      },
    ],
  },
  {
    title: '📚 Gestion de contenu',
    items: [
      {
        label: 'Tous les contenus',
        path: '/dashboard/content-management',
        icon: FolderOpen,
        permission: 'view_content_management',
        description: 'Vue unifiée',
      },
    ],
  },
  {
    title: '🌐 Pages publiques',
    items: [
      { label: 'Marché', path: '/dashboard/manage-marche', icon: Globe, permission: 'manage_public_pages' },
      { label: 'Économie', path: '/dashboard/manage-economie', icon: Building, permission: 'manage_public_pages' },
      { label: 'Industrie', path: '/dashboard/manage-industrie', icon: Cpu, permission: 'manage_public_pages' },
      { label: 'Investissement', path: '/dashboard/manage-investissement', icon: DollarSign, permission: 'manage_public_pages' },
      { label: 'Insights', path: '/dashboard/manage-insights', icon: Lightbulb, permission: 'manage_public_pages' },
      { label: 'Tech', path: '/dashboard/manage-tech', icon: Cpu, permission: 'manage_public_pages' },
    ],
  },
  {
    title: '📊 Données',
    items: [
      { label: 'Données marché', path: '/dashboard/market-data', icon: Activity, permission: 'view_market_data' },
      { label: 'Données économie', path: '/dashboard/economic-data', icon: PieChart, permission: 'view_economic_data' },
      { label: 'Matières premières', path: '/dashboard/commodities-management', icon: FolderOpen, permission: 'manage_commodities' },
    ],
  },
  {
    title: '📈 Analyse',
    items: [
      { label: 'Tableaux de bord', path: '/dashboard/analytics', icon: PieChart, permission: 'view_analytics' },
      { label: 'Rapports', path: '/dashboard/reports', icon: Activity, permission: 'view_reports' },
    ],
  },
  {
    title: '🛡️ Modération',
    items: [
      { label: 'Centre de modération', path: '/dashboard/moderation', icon: Shield, permission: 'view_moderation' },
      { label: 'Signalements', path: '/dashboard/reports-moderation', icon: Shield, permission: 'view_moderation_reports' },
    ],
  },
  {
    title: '⚙️ Administration',
    items: [
      { label: 'Utilisateurs', path: '/dashboard/users', icon: Users, permission: 'manage_users' },
      { label: 'Permissions', path: '/dashboard/permissions', icon: Shield, permission: 'manage_permissions' },
      { label: 'Paramètres', path: '/dashboard/settings', icon: Settings, permission: 'manage_settings' },
    ],
  },
  {
    title: '👤 Mon compte',
    items: [
      { label: 'Profil', path: '/dashboard/profile', icon: Users },
      { label: 'Déconnexion', path: '#', icon: LogOut, className: 'text-red-600 hover:bg-red-50' },
    ],
  },
];

export default menuSections;
