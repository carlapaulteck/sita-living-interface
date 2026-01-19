import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CognitiveProvider } from "@/contexts/CognitiveContext";
import { AdaptationProvider } from "@/contexts/AdaptationContext";
import { AvatarStateProvider } from "@/contexts/AvatarStateContext";
import { PersonalityProvider } from "@/contexts/PersonalityContext";
import { WakeWordProvider } from "@/contexts/WakeWordContext";
import { AdaptationIndicator } from "@/components/TrustSafeguards";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BottomDock } from "./components/BottomDock";
import { CursorTrail, EnhancedCommandPalette, useCommandPalette } from "./components/effects";
import { useTimeOfDayTheme } from "./hooks/useTimeOfDayTheme";
import { PageSkeleton } from "./components/ui/page-skeleton";
import { lazy, Suspense } from "react";

// Eager load critical pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for code splitting
const BusinessGrowth = lazy(() => import("./pages/BusinessGrowth"));
const LifeHealth = lazy(() => import("./pages/LifeHealth"));
const MindGrowth = lazy(() => import("./pages/MindGrowth"));
const Settings = lazy(() => import("./pages/Settings"));
const Sovereignty = lazy(() => import("./pages/Sovereignty"));
const Automations = lazy(() => import("./pages/Automations"));
const Family = lazy(() => import("./pages/Family"));
const HomeIntelligence = lazy(() => import("./pages/HomeIntelligence"));
const Finance = lazy(() => import("./pages/Finance"));
const Healthcare = lazy(() => import("./pages/Healthcare"));
const Agents = lazy(() => import("./pages/Agents"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const BioOS = lazy(() => import("./pages/BioOS"));
const Academy = lazy(() => import("./pages/Academy"));
const PersonalAssistant = lazy(() => import("./pages/PersonalAssistant"));
const HealthFitness = lazy(() => import("./pages/HealthFitness"));
const Mindset = lazy(() => import("./pages/Mindset"));

// Lazy load admin pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminSubscriptionsPage = lazy(() => import("./pages/admin/AdminSubscriptionsPage"));
const AdminTicketsPage = lazy(() => import("./pages/admin/AdminTicketsPage"));
const AdminAnnouncementsPage = lazy(() => import("./pages/admin/AdminAnnouncementsPage"));
const AdminErrorLogsPage = lazy(() => import("./pages/admin/AdminErrorLogsPage"));
const AdminAuditLogsPage = lazy(() => import("./pages/admin/AdminAuditLogsPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminFeatureFlagsPage = lazy(() => import("./pages/admin/AdminFeatureFlagsPage"));

// Optimized query client with stale times
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy route wrapper for consistent loading
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      {children}
    </Suspense>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isAdminPage = location.pathname.startsWith("/admin");
  const commandPalette = useCommandPalette();
  
  // Initialize time-of-day theming
  useTimeOfDayTheme();

  return (
    <>
      {/* Enhanced Command Palette */}
      <EnhancedCommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
      
      {/* Cursor Trail Effect */}
      {!isAuthPage && <CursorTrail />}
      
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <LazyRoute>
                <AdminLayout />
              </LazyRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<LazyRoute><AdminDashboardPage /></LazyRoute>} />
          <Route path="users" element={<LazyRoute><AdminUsersPage /></LazyRoute>} />
          <Route path="subscriptions" element={<LazyRoute><AdminSubscriptionsPage /></LazyRoute>} />
          <Route path="tickets" element={<LazyRoute><AdminTicketsPage /></LazyRoute>} />
          <Route path="announcements" element={<LazyRoute><AdminAnnouncementsPage /></LazyRoute>} />
          <Route path="errors" element={<LazyRoute><AdminErrorLogsPage /></LazyRoute>} />
          <Route path="audit" element={<LazyRoute><AdminAuditLogsPage /></LazyRoute>} />
          <Route path="settings" element={<LazyRoute><AdminSettingsPage /></LazyRoute>} />
          <Route path="feature-flags" element={<LazyRoute><AdminFeatureFlagsPage /></LazyRoute>} />
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
              <LazyRoute><BusinessGrowth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-growth"
          element={
            <ProtectedRoute>
              <LazyRoute><BusinessGrowth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/life"
          element={
            <ProtectedRoute>
              <LazyRoute><LifeHealth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/life-health"
          element={
            <ProtectedRoute>
              <LazyRoute><LifeHealth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mind"
          element={
            <ProtectedRoute>
              <LazyRoute><MindGrowth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mind-growth"
          element={
            <ProtectedRoute>
              <LazyRoute><MindGrowth /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LazyRoute><Settings /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sovereignty"
          element={
            <ProtectedRoute>
              <LazyRoute><Sovereignty /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/automations"
          element={
            <ProtectedRoute>
              <LazyRoute><Automations /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/family"
          element={
            <ProtectedRoute>
              <LazyRoute><Family /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LazyRoute><HomeIntelligence /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <LazyRoute><Finance /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/healthcare"
          element={
            <ProtectedRoute>
              <LazyRoute><Healthcare /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <LazyRoute><Agents /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence"
          element={
            <ProtectedRoute>
              <LazyRoute><Intelligence /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bio-os"
          element={
            <ProtectedRoute>
              <LazyRoute><BioOS /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/academy"
          element={
            <ProtectedRoute>
              <LazyRoute><Academy /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <LazyRoute><PersonalAssistant /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <LazyRoute><HealthFitness /></LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mindset"
          element={
            <ProtectedRoute>
              <LazyRoute><Mindset /></LazyRoute>
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
            <PersonalityProvider>
              <WakeWordProvider>
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
              </WakeWordProvider>
            </PersonalityProvider>
          </AvatarStateProvider>
        </AdaptationProvider>
      </CognitiveProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
