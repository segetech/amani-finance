import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import { Navigation } from './components/Navigation';

// Public Pages
import Index from './pages/Index';
import Article from './pages/Article';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Podcast from './pages/Podcast';
import Indices from './pages/Indices';
import Calculateur from './pages/Calculateur';
import GuideDebutant from './pages/GuideDebutant';
import Actualites from './pages/Actualites';
import Newsletter from './pages/Newsletter';

// Dashboard Pages
import DashboardMain from './pages/DashboardMain';
import ContentManagement from './pages/ContentManagement';
import Articles from './pages/Articles';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';
import PodcastsManager from './pages/PodcastsManager';
import NewPodcast from './pages/NewPodcast';
import EditPodcast from './pages/EditPodcast';
import IndicesManager from './pages/IndicesManager';
import NewIndice from './pages/NewIndice';
import EditIndice from './pages/EditIndice';
import IndicesManagement from './pages/IndicesManagement';
import CommoditiesManagement from './pages/CommoditiesManagement';
import IndicesHelp from './pages/IndicesHelp';
import Analytics from './pages/Analytics';
import Moderation from './pages/Moderation';
import ReportsModeration from './pages/ReportsModeration';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PermissionsManager from './pages/PermissionsManager';
import Users from './pages/Users';
import NewUser from './pages/NewUser';
import EditUser from './pages/EditUser';
import BannedUsers from './pages/BannedUsers';
import Notifications from './pages/Notifications';
import Logs from './pages/Logs';
import Marche from './pages/Marche';
import Economie from './pages/Economie';
import EconomieNews from './pages/EconomieNews';
import Industrie from './pages/Industrie';
import Investissement from './pages/Investissement';
import Insights from './pages/Insights';
import Tech from './pages/Tech';
import UserActivity from './pages/UserActivity';
import ReportsManager from './pages/ReportsManager';
import NewUserAdvanced from './pages/NewUserAdvanced';
import Integrations from './pages/Integrations';

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
        <Route path="/calculateur" element={<Calculateur />} />
        <Route path="/guide-debutant" element={<GuideDebutant />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/newsletter" element={<Newsletter />} />
              <IndicesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/commodities-management"
          element={
            <ProtectedRoute>
              <CommoditiesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/indices-help"
          element={
            <ProtectedRoute>
              <IndicesHelp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        
        {/* More public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/indices" element={<Indices />} />
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
        
        {/* 404 route */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
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
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Initialize React root
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/moderation"
                element={
                  <ProtectedRoute>
                    <Moderation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports-moderation"
                element={
                  <ProtectedRoute>
                    <ReportsModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/permissions"
                element={
                  <ProtectedRoute>
                    <PermissionsManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users/new"
                element={
                  <ProtectedRoute>
                    <NewUserAdvanced />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/user-activity"
                element={
                  <ProtectedRoute>
                    <UserActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports"
                element={
                  <ProtectedRoute>
                    <ReportsManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/banned-users"
                element={
                  <ProtectedRoute>
                    <BannedUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/logs"
                element={
                  <ProtectedRoute>
                    <Logs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/integrations"
                element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/market-data"
                element={
                  <ProtectedRoute>
                    <MarketDataManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/economic-data"
                element={
                  <ProtectedRoute>
                    <EconomicDataManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-marche"
                element={
                  <ProtectedRoute>
                    <MarcheManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-economie"
                element={
                  <ProtectedRoute>
                    <EconomieManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-industrie"
                element={
                  <ProtectedRoute>
                    <IndustrieManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-investissement"
                element={
                  <ProtectedRoute>
                    <InvestissementManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-insights"
                element={
                  <ProtectedRoute>
                    <InsightsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-tech"
                element={
                  <ProtectedRoute>
                    <TechManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/manage-podcast-public"
                element={
                  <ProtectedRoute>
                    <PodcastPublicManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users/edit/:userId"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route path="/marche" element={<Marche />} />
              <Route path="/economie" element={<Economie />} />
              <Route path="/economie/news" element={<EconomieNews />} />
              <Route path="/industrie" element={<Industrie />} />
              <Route path="/investissement" element={<Investissement />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/tech" element={<Tech />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/indices" element={<Indices />} />

const queryClient = new QueryClient();

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <Navigation />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardMain /></ProtectedRoute>} />
              <Route path="/dashboard/articles" element={<ProtectedRoute><DashboardArticles /></ProtectedRoute>} />
              <Route path="/dashboard/podcasts" element={<ProtectedRoute><DashboardPodcasts /></ProtectedRoute>} />
              <Route path="/dashboard/indices" element={<ProtectedRoute><DashboardIndices /></ProtectedRoute>} />
              <Route path="/dashboard/users" element={<ProtectedRoute><DashboardUsers /></ProtectedRoute>} />
              <Route path="/dashboard/moderation" element={<ProtectedRoute><DashboardModeration /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardAnalytics /></ProtectedRoute>} />
              <Route path="/dashboard/newsletter" element={<ProtectedRoute><DashboardNewsletter /></ProtectedRoute>} />
              <Route path="/dashboard/partners" element={<ProtectedRoute><DashboardPartners /></ProtectedRoute>} />
              <Route path="/dashboard/ads" element={<ProtectedRoute><DashboardAds /></ProtectedRoute>} />
              <Route path="/dashboard/seo" element={<ProtectedRoute><DashboardSeo /></ProtectedRoute>} />
              <Route path="/dashboard/support" element={<ProtectedRoute><DashboardSupport /></ProtectedRoute>} />
              <Route path="/dashboard/billing" element={<ProtectedRoute><DashboardBilling /></ProtectedRoute>} />
              <Route path="/dashboard/team" element={<ProtectedRoute><DashboardTeam /></ProtectedRoute>} />
              <Route path="/dashboard/api" element={<ProtectedRoute><DashboardApi /></ProtectedRoute>} />
              <Route path="/dashboard/notifications" element={<ProtectedRoute><DashboardNotifications /></ProtectedRoute>} />
              <Route path="/dashboard/integrations" element={<ProtectedRoute><DashboardIntegrations /></ProtectedRoute>} />
              <Route path="/dashboard/templates" element={<ProtectedRoute><DashboardTemplates /></ProtectedRoute>} />
              <Route path="/dashboard/widgets" element={<ProtectedRoute><DashboardWidgets /></ProtectedRoute>} />
              <Route path="/dashboard/backup" element={<ProtectedRoute><DashboardBackup /></ProtectedRoute>} />
              <Route path="/dashboard/logs" element={<ProtectedRoute><DashboardLogs /></ProtectedRoute>} />
              <Route path="/dashboard/themes" element={<ProtectedRoute><DashboardThemes /></ProtectedRoute>} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </ToastProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

// Initialize React root
const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
