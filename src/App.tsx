
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrayerProvider } from "@/contexts/prayer";
import { NavigationProvider } from "@/contexts/NavigationContext";
import PrayerSelection from "./pages/PrayerSelection";
import MosqueList from "./pages/MosqueList";
import Favorites from "./pages/Favorites";
import MosqueDetailPage from "./pages/MosqueDetailPage";
import SalahTimes from "./pages/SalahTimes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PrayerProvider>
        <NavigationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PrayerSelection />} />
              <Route path="/mosques" element={<MosqueList />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/mosque/:id" element={<MosqueDetailPage />} />
              <Route path="/salah-times" element={<SalahTimes />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NavigationProvider>
      </PrayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
