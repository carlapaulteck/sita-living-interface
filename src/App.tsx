import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BusinessGrowth from "./pages/BusinessGrowth";
import LifeHealth from "./pages/LifeHealth";
import MindGrowth from "./pages/MindGrowth";
import Settings from "./pages/Settings";
import Sovereignty from "./pages/Sovereignty";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { MobileBottomNav } from "./components/MobileBottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        {/* Aurora background effect */}
        <div className="aurora-bg" aria-hidden="true" />
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              path="/business-growth"
              element={
                <ProtectedRoute>
                  <BusinessGrowth />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
