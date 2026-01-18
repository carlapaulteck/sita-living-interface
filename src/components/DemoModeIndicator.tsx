import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  X,
  LogOut,
  Shield,
  User,
  HelpCircle,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface DemoModeIndicatorProps {
  onStartTutorial?: () => void;
}

export function DemoModeIndicator({ onStartTutorial }: DemoModeIndicatorProps) {
  const { isDemoMode, demoMode, exitDemoMode } = useAuth();
  const navigate = useNavigate();
  const [showPanel, setShowPanel] = useState(false);

  if (!isDemoMode) return null;

  const handleExit = () => {
    exitDemoMode();
    navigate("/auth");
  };

  return (
    <>
      {/* Floating Demo Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed bottom-24 left-4 z-50"
      >
        <Button
          onClick={() => setShowPanel(!showPanel)}
          variant="outline"
          className={`gap-2 shadow-lg backdrop-blur-xl border-2 ${
            demoMode === "admin"
              ? "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
              : "bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
          }`}
        >
          <Eye className="h-4 w-4" />
          Demo Mode
          <Badge
            variant="secondary"
            className={`text-[10px] ${
              demoMode === "admin" ? "bg-amber-500/30" : "bg-blue-500/30"
            }`}
          >
            {demoMode === "admin" ? "Admin" : "Client"}
          </Badge>
        </Button>
      </motion.div>

      {/* Demo Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-36 left-4 z-50 w-80"
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {demoMode === "admin" ? (
                    <Shield className="h-5 w-5 text-amber-400" />
                  ) : (
                    <User className="h-5 w-5 text-blue-400" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Demo Mode Active
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Viewing as {demoMode === "admin" ? "Administrator" : "Client"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {/* Tutorial Button */}
                {onStartTutorial && (
                  <Button
                    variant="outline"
                    className="w-full justify-between gap-2"
                    onClick={() => {
                      setShowPanel(false);
                      onStartTutorial();
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Start Tutorial
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}

                {/* Help Guide */}
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2"
                  onClick={() => {
                    setShowPanel(false);
                    document.dispatchEvent(new CustomEvent("openHelpGuide"));
                  }}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-secondary" />
                    Help Guide
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Features Info */}
                <div className="p-3 rounded-lg bg-foreground/5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Demo Features
                      </p>
                      <ul className="space-y-1">
                        <li>• Explore all {demoMode === "admin" ? "admin" : "client"} features</li>
                        <li>• No data is saved</li>
                        <li>• Full UI experience</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Exit Button */}
                <Button
                  variant="destructive"
                  className="w-full gap-2 mt-2"
                  onClick={handleExit}
                >
                  <LogOut className="h-4 w-4" />
                  Exit Demo Mode
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
