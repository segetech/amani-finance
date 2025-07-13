export interface DemoUser {
  id: string;
  email: string;
  password: string;
  role: "admin" | "editeur" | "analyste" | "moderateur" | "abonne" | "visiteur";
  firstName: string;
  lastName: string;
  organization: string;
  permissions: string[];
  lastLogin: string;
  country?: string;
  preferences: {
    sectors: string[];
    countries: string[];
    newsletter: boolean;
    alerts: boolean;
  };
}

export const demoAccounts: DemoUser[] = [
  {
    id: "admin-001",
    email: "admin@amani.demo",
    password: "admin123",
    role: "admin",
    firstName: "Amadou",
    lastName: "Sanogo",
    organization: "Amani Platform",
    lastLogin: "2024-01-15 09:30",
    permissions: [
      "create_articles",
      "edit_articles",
      "delete_articles",
      "manage_users",
      "manage_indices",
      "manage_podcasts",
      "view_analytics",
      "export_data",
      "moderate_comments",
      "manage_categories",
      "system_settings",
    ],
    preferences: {
      sectors: ["all"],
      countries: ["all"],
      newsletter: true,
      alerts: true,
    },
  },
  {
    id: "editeur-001",
    email: "editeur@amani.demo",
    password: "editeur123",
    role: "editeur",
    firstName: "Fatou",
    lastName: "Diallo",
    organization: "Journal du Mali",
    lastLogin: "2024-01-15 08:45",
    permissions: [
      "create_articles",
      "edit_articles",
      "create_podcasts",
      "edit_podcasts",
      "manage_categories",
      "view_analytics",
    ],
    preferences: {
      sectors: ["Économie", "Marché", "Politique"],
      countries: ["Mali", "Burkina Faso", "Niger"],
      newsletter: true,
      alerts: true,
    },
  },
  {
    id: "analyste-001",
    email: "analyste@amani.demo",
    password: "analyste123",
    role: "analyste",
    firstName: "Ibrahim",
    lastName: "Touré",
    organization: "BCEAO",
    lastLogin: "2024-01-15 07:20",
    permissions: [
      "create_indices",
      "edit_indices",
      "view_indices",
      "export_indices",
      "create_economic_reports",
      "view_analytics",
    ],
    preferences: {
      sectors: ["Marché", "Économie", "Investissement"],
      countries: ["UEMOA", "Mali", "Burkina Faso", "Niger", "Sénégal"],
      newsletter: true,
      alerts: true,
    },
  },
  {
    id: "moderateur-001",
    email: "moderateur@amani.demo",
    password: "moderateur123",
    role: "moderateur",
    firstName: "Aïcha",
    lastName: "Koné",
    organization: "Amani Platform",
    lastLogin: "2024-01-15 10:15",
    permissions: [
      "moderate_comments",
      "review_content",
      "manage_user_reports",
      "view_content_stats",
    ],
    preferences: {
      sectors: ["all"],
      countries: ["all"],
      newsletter: false,
      alerts: true,
    },
  },
  {
    id: "abonne-001",
    email: "abonne@amani.demo",
    password: "abonne123",
    role: "abonne",
    firstName: "Moussa",
    lastName: "Traoré",
    organization: "Banque Atlantique",
    lastLogin: "2024-01-15 11:30",
    permissions: [
      "view_premium_content",
      "save_favorites",
      "create_alerts",
      "download_reports",
      "access_podcast_archives",
    ],
    preferences: {
      sectors: ["Marché", "Investissement", "Économie"],
      countries: ["Mali", "Burkina Faso"],
      newsletter: true,
      alerts: true,
    },
  },
  {
    id: "visiteur-001",
    email: "visiteur@amani.demo",
    password: "visiteur123",
    role: "visiteur",
    firstName: "Mariam",
    lastName: "Ba",
    organization: "Université de Bamako",
    lastLogin: "2024-01-15 14:20",
    permissions: [
      "view_public_content",
      "view_basic_indices",
      "listen_public_podcasts",
    ],
    preferences: {
      sectors: ["Économie", "Tech"],
      countries: ["Mali"],
      newsletter: false,
      alerts: false,
    },
  },
];

export const getRoleDisplayName = (role: string): string => {
  const roleNames = {
    admin: "Administrateur",
    editeur: "Éditeur",
    analyste: "Analyste",
    moderateur: "Modérateur",
    abonne: "Abonné Premium",
    visiteur: "Visiteur",
  };
  return roleNames[role as keyof typeof roleNames] || role;
};

export const getRoleColor = (role: string): string => {
  const roleColors = {
    admin: "bg-red-100 text-red-800",
    editeur: "bg-blue-100 text-blue-800",
    analyste: "bg-green-100 text-green-800",
    moderateur: "bg-yellow-100 text-yellow-800",
    abonne: "bg-purple-100 text-purple-800",
    visiteur: "bg-gray-100 text-gray-800",
  };
  return (
    roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
  );
};
