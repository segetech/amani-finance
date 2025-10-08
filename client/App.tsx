import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import { Navigation } from "./components/Navigation";
import DashboardShell from "./components/DashboardShell";

// Pages critiques chargées immédiatement
import Index from "./pages/Index";
import Login from "./pages/Login";

// Pages lazy-loaded pour améliorer les performances
const Article = lazy(() => import("./pages/Article"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Indices = lazy(() => import("./pages/Indices"));
const BrvmLatest = lazy(() => import("./pages/BrvmLatest"));
const Calculateur = lazy(() => import("./pages/Calculateur"));
const GuideDebutant = lazy(() => import("./pages/GuideDebutant"));
const Actualites = lazy(() => import("./pages/Actualites"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Marche = lazy(() => import("./pages/Marche"));
const Economie = lazy(() => import("./pages/Economie"));
const EconomieNews = lazy(() => import("./pages/EconomieNews"));
const Industrie = lazy(() => import("./pages/Industrie"));
const Investissement = lazy(() => import("./pages/Investissement"));
const Insights = lazy(() => import("./pages/Insights"));
const Tech = lazy(() => import("./pages/Tech"));
const TestMedia = lazy(() => import("./pages/TestMedia"));
const TestArticleForm = lazy(() => import("./pages/TestArticleForm"));

// Dashboard Pages - lazy loaded
const DashboardMain = lazy(() => import("./pages/DashboardMain"));
const ContentManagement = lazy(() => import("./pages/ContentManagement"));
const Articles = lazy(() => import("./pages/Articles"));
const NewArticle = lazy(() => import("./pages/NewArticle"));
const EditArticle = lazy(() => import("./pages/EditArticle"));
const PodcastsManager = lazy(() => import("./pages/PodcastsManager"));
const NewPodcast = lazy(() => import("./pages/NewPodcast"));
const EditPodcast = lazy(() => import("./pages/EditPodcast"));
const LegacyIndicesDisabled = lazy(() => import("./pages/LegacyIndicesDisabled"));
const BrvmIndicesManagement = lazy(() => import("./pages/BrvmIndicesManagement"));
const CommoditiesManagement = lazy(() => import("./pages/CommoditiesManagement"));
const IndicesHelp = lazy(() => import("./pages/IndicesHelp"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Moderation = lazy(() => import("./pages/Moderation"));
const ReportsModeration = lazy(() => import("./pages/ReportsModeration"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const PermissionsManager = lazy(() => import("./pages/PermissionsManager"));
const Users = lazy(() => import("./pages/Users"));
const NewUser = lazy(() => import("./pages/NewUser"));
const EditUser = lazy(() => import("./pages/EditUser"));
const BannedUsers = lazy(() => import("./pages/BannedUsers"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Logs = lazy(() => import("./pages/Logs"));
const UserActivity = lazy(() => import("./pages/UserActivity"));
const ReportsManager = lazy(() => import("./pages/ReportsManager"));
const NewUserAdvanced = lazy(() => import("./pages/NewUserAdvanced"));
const Integrations = lazy(() => import("./pages/Integrations"));

// Create a single instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Main App Content Component
const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/indices" element={<Indices />} />
        <Route path="/brvm-latest" element={<BrvmLatest />} />
        <Route path="/calculateur" element={<Calculateur />} />
        <Route path="/guide-debutant" element={<GuideDebutant />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/marche" element={<Marche />} />
        <Route path="/economie" element={<Economie />} />
        <Route path="/economie/news" element={<EconomieNews />} />
        <Route path="/industrie" element={<Industrie />} />
        <Route path="/investissement" element={<Investissement />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/tech" element={<Tech />} />
        <Route path="/test-media" element={<TestMedia />} />
        <Route path="/test-article-form" element={<TestArticleForm />} />

        {/* Protected Dashboard Routes (persistent layout with nested routes) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardMain />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/new" element={<NewArticle />} />
          <Route path="articles/edit/:id" element={<EditArticle />} />
          <Route path="podcasts" element={<PodcastsManager />} />
          <Route path="podcasts/new" element={<NewPodcast />} />
          <Route path="podcasts/edit/:id" element={<EditPodcast />} />
          <Route path="indices" element={<LegacyIndicesDisabled />} />
          <Route path="indices/new" element={<LegacyIndicesDisabled />} />
          <Route path="indices/edit/:id" element={<LegacyIndicesDisabled />} />
          <Route path="indices-management" element={<BrvmIndicesManagement />} />
          <Route path="commodities-management" element={<CommoditiesManagement />} />
          <Route path="indices-help" element={<IndicesHelp />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="reports-moderation" element={<ReportsModeration />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="permissions" element={<PermissionsManager />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<NewUser />} />
          <Route path="users/new-advanced" element={<NewUserAdvanced />} />
          <Route path="users/edit/:userId" element={<EditUser />} />
          <Route path="user-activity" element={<UserActivity />} />
          <Route path="reports" element={<ReportsManager />} />
          <Route path="banned-users" element={<BannedUsers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="logs" element={<Logs />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>

        {/* 404 route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  404
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Page not found
                </p>
              </div>
            </div>
          }
        />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
            <SpeedInsights />
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Initialize React root
const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export default App;
