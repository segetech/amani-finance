import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import Marche from "./pages/Marche";
import Economie from "./pages/Economie";
import Industrie from "./pages/Industrie";
import Investissement from "./pages/Investissement";
import Insights from "./pages/Insights";
import Tech from "./pages/Tech";
import Podcast from "./pages/Podcast";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marche" element={<Marche />} />
          <Route path="/economie" element={<Economie />} />
          <Route path="/industrie" element={<Industrie />} />
          <Route path="/investissement" element={<Investissement />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
