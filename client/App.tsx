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
import NewPodcast from "./pages/NewPodcast";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardMain /></ProtectedRoute>} />
              <Route path="/dashboard/articles" element={<Articles />} />
              <Route path="/dashboard/articles/new" element={<NewArticle />} />
              <Route path="/dashboard/podcasts" element={<PodcastsManager />} />
              <Route path="/dashboard/podcasts/new" element={<NewPodcast />} />
              <Route path="/dashboard/indices" element={<IndicesManager />} />
              <Route path="/dashboard/indices/new" element={<NewIndice />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/moderation" element={<Moderation />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route
                path="/dashboard/permissions"
                element={<PermissionsManager />}
              />
              <Route path="/dashboard/users" element={<Users />} />
              <Route
                path="/dashboard/users/new"
                element={<NewUserAdvanced />}
              />
              <Route
                path="/dashboard/user-activity"
                element={<UserActivity />}
              />
              <Route path="/dashboard/reports" element={<ReportsManager />} />
              <Route path="/dashboard/banned-users" element={<BannedUsers />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/logs" element={<Logs />} />
              <Route
                path="/dashboard/integrations"
                element={<Integrations />}
              />
              <Route
                path="/dashboard/users/edit/:userId"
                element={<EditUser />}
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
