import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CognitiveProvider } from "@/contexts/CognitiveContext";
import { AdaptationProvider } from "@/contexts/AdaptationContext";
import { AvatarStateProvider } from "@/contexts/AvatarStateContext";
import { AdaptationIndicator } from "@/components/TrustSafeguards";
import ErrorBoundary from "@/components/ErrorBoundary";
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

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminSubscriptionsPage,
  AdminTicketsPage,
  AdminAnnouncementsPage,
  AdminErrorLogsPage,
  AdminAuditLogsPage,
  AdminSettingsPage,
  AdminFeatureFlagsPage
} from "./pages/admin";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="errors" element={<AdminErrorLogsPage />} />
          <Route path="audit" element={<AdminAuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="feature-flags" element={<AdminFeatureFlagsPage />} />
        </Route>
        
        {/* Client Routes */}
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
      
      {/* Adaptation state indicator - hide on auth and admin pages */}
      {!isAuthPage && !isAdminPage && <AdaptationIndicator />}
      
      {/* Luxury Bottom Navigation Dock - hide on auth and admin pages */}
      {!isAuthPage && !isAdminPage && <BottomDock />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CognitiveProvider>
        <AdaptationProvider>
          <AvatarStateProvider>
            <TooltipProvider>
              <ErrorBoundary>
                {/* Aurora background effect */}
                <div className="aurora-bg" aria-hidden="true" />
                
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </ErrorBoundary>
            </TooltipProvider>
          </AvatarStateProvider>
        </AdaptationProvider>
      </CognitiveProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
