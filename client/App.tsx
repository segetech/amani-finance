import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewArticle from "./pages/NewArticle";
import NewPodcast from "./pages/NewPodcast";
import NewIndice from "./pages/NewIndice";
import Analytics from "./pages/Analytics";
import Moderation from "./pages/Moderation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import NewUser from "./pages/NewUser";
import EditUser from "./pages/EditUser";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/articles/new" element={<NewArticle />} />
              <Route path="/dashboard/podcasts/new" element={<NewPodcast />} />
              <Route path="/dashboard/indices/new" element={<NewIndice />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/moderation" element={<Moderation />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/users/new" element={<NewUser />} />
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
              <Route path="/indices" element={<Indices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
