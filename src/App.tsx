import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessGrowth from "./pages/BusinessGrowth";
import LifeHealth from "./pages/LifeHealth";
import MindGrowth from "./pages/MindGrowth";
import Sovereignty from "./pages/Sovereignty";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/business-growth" element={<BusinessGrowth />} />
          <Route path="/life-health" element={<LifeHealth />} />
          <Route path="/mind-growth" element={<MindGrowth />} />
          <Route path="/sovereignty" element={<Sovereignty />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
