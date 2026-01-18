import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map, Sunrise } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandBar } from "./CommandBar";
import { AvatarBubble } from "./AvatarBubble";
import { ConversationConsole } from "./ConversationConsole";
import { WarRoom } from "./WarRoom";
import { WakeUpReceipt } from "./WakeUpReceipt";
import bgParticles from "@/assets/bg-particles.jpg";

interface Tab {
  id: string;
  label: string;
}

interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function ModuleLayout({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  children,
  actions,
}: ModuleLayoutProps) {
  const navigate = useNavigate();
  const [showConsole, setShowConsole] = useState(false);
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("war") || lower.includes("map") || lower.includes("system")) {
      setShowWarRoom(true);
    } else if (lower.includes("receipt") || lower.includes("wake") || lower.includes("morning")) {
      setShowReceipt(true);
    } else if (lower.includes("home")) {
      navigate("/");
    } else if (lower.includes("business") || lower.includes("revenue")) {
      navigate("/business-growth");
    } else if (lower.includes("health") || lower.includes("sleep")) {
      navigate("/life-health");
    } else if (lower.includes("mind") || lower.includes("focus")) {
      navigate("/mind-growth");
    } else if (lower.includes("sovereign") || lower.includes("privacy")) {
      navigate("/sovereignty");
    } else if (lower.includes("settings")) {
      navigate("/settings");
    } else {
      setShowConsole(true);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-secondary/5 via-background/80 to-primary/5" />
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen pb-32">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display font-medium text-foreground"
                  >
                    {title}
                  </motion.h1>
                  {subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-muted-foreground"
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </div>
              </div>
              {actions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {actions}
                </motion.div>
              )}
            </div>

            {/* Tabs */}
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.nav>
          </div>
        </header>

        {/* Tab Content */}
        <main className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-30">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setShowReceipt(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm hover:scale-105 transition-transform"
          title="Wake-Up Receipt"
        >
          <Sunrise className="h-5 w-5 text-primary" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => setShowWarRoom(true)}
          className="p-3 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform"
          title="War Room"
        >
          <Map className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Command Bar */}
      <CommandBar onSubmit={handleCommand} />

      {/* Avatar Bubble */}
      <div onClick={() => setShowConsole(true)}>
        <AvatarBubble />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showConsole && <ConversationConsole isOpen={showConsole} onClose={() => setShowConsole(false)} />}
        {showWarRoom && <WarRoom isOpen={showWarRoom} onClose={() => setShowWarRoom(false)} />}
        {showReceipt && <WakeUpReceipt isOpen={showReceipt} onClose={() => setShowReceipt(false)} />}
      </AnimatePresence>
    </div>
  );
}
