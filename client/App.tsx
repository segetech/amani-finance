import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardMain from "./pages/DashboardMain";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle";
import NewPodcast from "./pages/NewPodcast";
import EditPodcast from "./pages/EditPodcast";
import PodcastsManager from "./pages/PodcastsManager";
import NewIndice from "./pages/NewIndice";
import IndicesManager from "./pages/IndicesManager";
import Analytics from "./pages/Analytics";
import Moderation from "./pages/Moderation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import PermissionsManager from "./pages/PermissionsManager";
import Users from "./pages/Users";
import UserActivity from "./pages/UserActivity";
import ReportsManager from "./pages/ReportsManager";
import NewUser from "./pages/NewUser";
import NewUserAdvanced from "./pages/NewUserAdvanced";
import EditUser from "./pages/EditUser";
import Integrations from "./pages/Integrations";
import Articles from "./pages/Articles";
import BannedUsers from "./pages/BannedUsers";
import Notifications from "./pages/Notifications";
import Logs from "./pages/Logs";
import Marche from "./pages/Marche";
import Economie from "./pages/Economie";
import EconomieNews from "./pages/EconomieNews";
import Industrie from "./pages/Industrie";
import Investissement from "./pages/Investissement";
import Insights from "./pages/Insights";
import Tech from "./pages/Tech";
import Podcast from "./pages/Podcast";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Newsletter from "./pages/Newsletter";
import Indices from "./pages/Indices";
import Calculateur from "./pages/Calculateur";
import GuideDebutant from "./pages/GuideDebutant";
import Actualites from "./pages/Actualites";
import ScrollToTop from "./components/ScrollToTop";
import IndicesManagement from "./pages/IndicesManagement";
import CommoditiesManagement from "./pages/CommoditiesManagement";
import EditIndice from "./pages/EditIndice";
import IndicesHelp from "./pages/IndicesHelp";
import NotFound from "./pages/NotFound";
import ContentManagement from "./pages/ContentManagement";
import TasksPermissions from "./pages/TasksPermissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/content-management"
                element={
                  <ProtectedRoute>
                    <ContentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tasks-permissions"
                element={
                  <ProtectedRoute>
                    <TasksPermissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/articles"
                element={
                  <ProtectedRoute>
                    <Articles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/articles/new"
                element={
                  <ProtectedRoute>
                    <NewArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/articles/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/podcasts"
                element={
                  <ProtectedRoute>
                    <PodcastsManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/podcasts/new"
                element={
                  <ProtectedRoute>
                    <NewPodcast />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/podcasts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPodcast />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/podcasts/:id/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/indices"
                element={
                  <ProtectedRoute>
                    <IndicesManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/indices/new"
                element={
                  <ProtectedRoute>
                    <NewIndice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/indices/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditIndice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/indices/:id/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/indices-management"
                element={
                  <ProtectedRoute>
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
              <Route
                path="/dashboard/moderation"
                element={
                  <ProtectedRoute>
                    <Moderation />
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
              <Route path="/calculateur" element={<Calculateur />} />
              <Route path="/guides/debutant" element={<GuideDebutant />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
let root = (container as any)._reactRoot;

if (!root) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
}

root.render(<App />);
