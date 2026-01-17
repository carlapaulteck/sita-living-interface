import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
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
}

export function ModuleLayout({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  children,
}: ModuleLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      <div className="fixed inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
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
    </div>
  );
}
