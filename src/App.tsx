
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrayerProvider } from "@/contexts/prayer";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PrayerSelection from "./pages/PrayerSelection";
import MosqueList from "./pages/MosqueList";
import Favorites from "./pages/Favorites";
import MosqueDetailPage from "./pages/MosqueDetailPage";
import SalahTimes from "./pages/SalahTimes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  // Function to determine home page route
  const HomeRoute = () => {
    // Check if we have a last visited page in localStorage
    const lastVisitedPage = localStorage.getItem('last-visited-page');
    const selectedPrayer = localStorage.getItem('selected-prayer');
    
    // If there's a selected prayer and last visited page, go there
    if (selectedPrayer && lastVisitedPage && 
        lastVisitedPage !== '/' && 
        lastVisitedPage !== '/login' && 
        lastVisitedPage !== '/register' && 
        lastVisitedPage !== '/verify-otp') {
      return <Navigate to={lastVisitedPage} replace />;
    }
    
    // Default to prayer selection
    return <PrayerSelection />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PrayerProvider>
            <BrowserRouter>
              <NavigationProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<HomeRoute />} />
                  <Route path="/mosques" element={<MosqueList />} />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route path="/mosque/:id" element={<MosqueDetailPage />} />
                  <Route path="/salah-times" element={<SalahTimes />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NavigationProvider>
            </BrowserRouter>
          </PrayerProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
