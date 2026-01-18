import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CognitiveProvider } from "@/contexts/CognitiveContext";
import { AdaptationProvider } from "@/contexts/AdaptationContext";
import { AdaptationIndicator } from "@/components/TrustSafeguards";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BusinessGrowth from "./pages/BusinessGrowth";
import LifeHealth from "./pages/LifeHealth";
import MindGrowth from "./pages/MindGrowth";
import Settings from "./pages/Settings";
import Sovereignty from "./pages/Sovereignty";
import Automations from "./pages/Automations";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BottomDock } from "./components/BottomDock";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business"
          element={
            <ProtectedRoute>
              <BusinessGrowth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-growth"
          element={
            <ProtectedRoute>
              <BusinessGrowth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/life"
          element={
            <ProtectedRoute>
              <LifeHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/life-health"
          element={
            <ProtectedRoute>
              <LifeHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mind"
          element={
            <ProtectedRoute>
              <MindGrowth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mind-growth"
          element={
            <ProtectedRoute>
              <MindGrowth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sovereignty"
          element={
            <ProtectedRoute>
              <Sovereignty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/automations"
          element={
            <ProtectedRoute>
              <Automations />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Adaptation state indicator */}
      {!isAuthPage && <AdaptationIndicator />}
      
      {/* Luxury Bottom Navigation Dock - hide on auth page */}
      {!isAuthPage && <BottomDock />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CognitiveProvider>
        <AdaptationProvider>
          <TooltipProvider>
            {/* Aurora background effect */}
            <div className="aurora-bg" aria-hidden="true" />
            
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AdaptationProvider>
      </CognitiveProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
