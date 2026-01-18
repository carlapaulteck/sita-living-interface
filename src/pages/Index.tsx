import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { GlassCard } from "@/components/GlassCard";
import { QuickStatCard } from "@/components/QuickStatCard";
import { ModuleTile } from "@/components/ModuleTile";
import { MetricRing } from "@/components/MetricRing";
import { DeviceIntegration } from "@/components/DeviceIntegration";
import { InsightsFeed } from "@/components/InsightsFeed";
import { CommandBar } from "@/components/CommandBar";
import { AvatarBubble } from "@/components/AvatarBubble";
import { TalkingAvatarMockup } from "@/components/TalkingAvatarMockup";
import { ProactiveAISuggestions } from "@/components/ProactiveAISuggestions";
import { WakeWordIndicator } from "@/components/WakeWordIndicator";
import { useAvatarState } from "@/contexts/AvatarStateContext";
import { useWakeWord } from "@/hooks/useWakeWord";
import { useWakeWordSettingsSafe } from "@/contexts/WakeWordContext";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { ConversationConsole } from "@/components/ConversationConsole";
import { WarRoom } from "@/components/WarRoom";
import { WakeUpReceipt } from "@/components/WakeUpReceipt";
import { MorningBriefing } from "@/components/MorningBriefing";
import { TrustControlsDashboard } from "@/components/TrustControlsDashboard";
import { AdaptationIndicator } from "@/components/TrustSafeguards";
import { RecoveryMode } from "@/components/RecoveryMode";
import { DoNotDisturbPanel } from "@/components/DoNotDisturbPanel";
import { WeeklyInsights } from "@/components/WeeklyInsights";
import { CalendarSync } from "@/components/CalendarSync";
import { HabitTracker } from "@/components/HabitTracker";
import { NotificationBatchingPanel } from "@/components/NotificationBatchingPanel";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ClientDashboard } from "@/components/ClientDashboard";
import { CognitiveBudgetVisualization } from "@/components/CognitiveBudgetVisualization";
import { DemoModeIndicator } from "@/components/DemoModeIndicator";
import { DemoTutorial } from "@/components/DemoTutorial";
import { HelpGuide } from "@/components/HelpGuide";
import { DashboardTour } from "@/components/DashboardTour";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SupportTicketForm } from "@/components/SupportTicketForm";
import { useNavigate } from "react-router-dom";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { useDoNotDisturb } from "@/hooks/useDoNotDisturb";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import {
  TrendingUp, 
  Moon, 
  Brain, 
  Smartphone,
  Coins,
  Heart,
  Lightbulb,
  Shield,
  Map,
  Sunrise,
  Wallet,
  Cpu,
  ShieldCheck,
  BellOff,
  BarChart3,
  CalendarDays,
  CheckSquare,
  Layers,
  HelpCircle
} from "lucide-react";

// Decorative graphics for stat cards
const GoldStarburst = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <g fill="url(#goldGrad)" opacity="0.8">
      <circle cx="32" cy="32" r="8" />
      <path d="M32 8 L34 28 L32 32 L30 28 Z" />
      <path d="M32 56 L34 36 L32 32 L30 36 Z" />
      <path d="M8 32 L28 34 L32 32 L28 30 Z" />
      <path d="M56 32 L36 34 L32 32 L36 30 Z" />
    </g>
  </svg>
);

const CyanOrb = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="cyanGrad" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#00FFFF" />
        <stop offset="100%" stopColor="#008B8B" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="20" fill="url(#cyanGrad)" opacity="0.7" />
    <circle cx="32" cy="32" r="24" stroke="#00FFFF" strokeWidth="1" fill="none" opacity="0.3" />
  </svg>
);

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showTrustControls, setShowTrustControls] = useState(false);
  const [showRecoveryMode, setShowRecoveryMode] = useState(false);
  const [showDNDPanel, setShowDNDPanel] = useState(false);
  const [showWeeklyInsights, setShowWeeklyInsights] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHabitTracker, setShowHabitTracker] = useState(false);
  const [showNotificationBatching, setShowNotificationBatching] = useState(false);
  const [showCognitiveBudget, setShowCognitiveBudget] = useState(false);
  const [showDemoTutorial, setShowDemoTutorial] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showDashboardTour, setShowDashboardTour] = useState(false);
  const [showSupportTicket, setShowSupportTicket] = useState(false);
  const [recoveryAutoActivated, setRecoveryAutoActivated] = useState(false);
  const [userName, setUserName] = useState("Alex");
  const [greeting, setGreeting] = useState("Good morning");
  const navigate = useNavigate();
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation();
  
  // Auth and role hooks
  const { user, isDemoMode } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  
  // Redirect admins to admin panel
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, roleLoading, navigate]);
  
  // Adaptation and DND hooks
  const adaptation = useAdaptationSafe();
  const { dndState } = useDoNotDisturb();
  const avatarState = useAvatarState();
  const wakeWordSettings = useWakeWordSettingsSafe();
  
  // Wake word detection - uses settings from context
  const { 
    isListening: wakeWordListening, 
    isAwake: isWokenByVoice,
    startListening: startWakeWord,
    stopListening: stopWakeWord,
    resetWake: resetWakeWord,
    currentWakeWord,
  } = useWakeWord({
    wakeWord: wakeWordSettings?.currentWakeWord.phrase || "hey sita",
    wakeWordVariations: wakeWordSettings?.currentWakeWord.variations || [],
    sensitivity: wakeWordSettings?.sensitivity || 0.6,
    onWake: () => {
      // Trigger avatar to listening state and open console
      avatarState.setState("listening");
      setShowConsole(true);
    },
    onSleep: () => {
      avatarState.setState("idle");
    },
  });
  
  // Track last AI message for emotion detection
  const [lastAIMessage, setLastAIMessage] = useState<string | null>(null);
  
  // Track if we've already shown recovery mode this session
  const recoveryShownRef = useRef(false);

  // Real-time metrics subscription
  const { isConnected } = useRealtimeSubscription({
    table: 'realtime_metrics',
    enabled: true,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const onboarded = localStorage.getItem("sita_onboarded");
    const savedName = localStorage.getItem("sita_user_name");
    if (!onboarded) {
      setShowOnboarding(true);
    }
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Auto-show demo tutorial for new demo sessions
  useEffect(() => {
    if (isDemoMode) {
      const demoTutorialShown = sessionStorage.getItem("demo_tutorial_shown");
      if (!demoTutorialShown) {
        const timer = setTimeout(() => {
          setShowDemoTutorial(true);
          sessionStorage.setItem("demo_tutorial_shown", "true");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isDemoMode]);

  // Listen for help guide open event from DemoModeIndicator
  useEffect(() => {
    const handleOpenHelp = () => setShowHelpGuide(true);
    document.addEventListener("openHelpGuide", handleOpenHelp);
    return () => document.removeEventListener("openHelpGuide", handleOpenHelp);
  }, []);
  
  // Auto-activate recovery mode when overload is detected
  useEffect(() => {
    if (adaptation?.momentState === "overload" && !recoveryShownRef.current && !showRecoveryMode) {
      // Wait a few seconds before suggesting recovery
      const timer = setTimeout(() => {
        setRecoveryAutoActivated(true);
        setShowRecoveryMode(true);
        recoveryShownRef.current = true;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [adaptation?.momentState, showRecoveryMode]);

  const handleOnboardingComplete = (data: { name: string }) => {
    setUserName(data.name);
    setShowOnboarding(false);
    // Show dashboard tour after onboarding completes
    setTimeout(() => {
      setShowDashboardTour(true);
    }, 800);
  };

  const handleDashboardTourComplete = () => {
    setShowDashboardTour(false);
    localStorage.setItem("sita_dashboard_tour_completed", "true");
  };

  const handleCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("war") || lower.includes("map") || lower.includes("system")) {
      setShowWarRoom(true);
    } else if (lower.includes("briefing") || lower.includes("morning")) {
      setShowBriefing(true);
    } else if (lower.includes("trust") || lower.includes("control") || lower.includes("adapt")) {
      setShowTrustControls(true);
    } else if (lower.includes("receipt") || lower.includes("wake")) {
      setShowReceipt(true);
    } else if (lower.includes("recovery") || lower.includes("break") || lower.includes("rest")) {
      setRecoveryAutoActivated(false);
      setShowRecoveryMode(true);
    } else if (lower.includes("dnd") || lower.includes("disturb") || lower.includes("quiet")) {
      setShowDNDPanel(true);
    } else if (lower.includes("weekly") || lower.includes("insight") || lower.includes("pattern") || lower.includes("trend")) {
      setShowWeeklyInsights(true);
    } else if (lower.includes("calendar") || lower.includes("schedule") || lower.includes("event")) {
      setShowCalendar(true);
    } else if (lower.includes("habit") || lower.includes("streak") || lower.includes("track")) {
      setShowHabitTracker(true);
    } else if (lower.includes("batch") || lower.includes("digest") || lower.includes("notification")) {
      setShowNotificationBatching(true);
    } else if (lower.includes("business") || lower.includes("revenue") || lower.includes("growth")) {
      navigate("/business-growth");
    } else if (lower.includes("health") || lower.includes("sleep") || lower.includes("fitness")) {
      navigate("/life-health");
    } else if (lower.includes("mind") || lower.includes("focus") || lower.includes("learn")) {
      navigate("/mind-growth");
    } else if (lower.includes("sovereign") || lower.includes("privacy") || lower.includes("data")) {
      navigate("/sovereignty");
    } else {
      setShowConsole(true);
    }
  };

  const handleModuleClick = (module: string) => {
    switch (module) {
      case "Wealth":
      case "Business Growth":
        navigate("/business-growth");
        break;
      case "Life & Health":
        navigate("/life-health");
        break;
      case "Mind & Growth":
        navigate("/mind-growth");
        break;
      case "Sovereignty":
        navigate("/sovereignty");
        break;
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden pb-28 md:pb-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a1a 50%, #050505 100%)' }}
    >
      {/* Animated glow orbs - Luxury version */}
      <div className="fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-[#9370DB]/8 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#FFD700]/6 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FFFF]/3 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Announcement Banners */}
          {!isAdmin && <AnnouncementBanner />}

          {/* Role-Based Dashboard Content */}
          {isAdmin && !roleLoading ? (
            <div className="mt-6">
              <AdminDashboard />
            </div>
          ) : (
            <>
              {/* Client Dashboard Quick Access */}
              <div className="mt-6 mb-6">
                <ClientDashboard
                  onOpenCalendar={() => setShowCalendar(true)}
                  onOpenHabits={() => setShowHabitTracker(true)}
                  onOpenNotifications={() => setShowNotificationBatching(true)}
                  onOpenRecovery={() => {
                    setRecoveryAutoActivated(false);
                    setShowRecoveryMode(true);
                  }}
                  onOpenWeeklyInsights={() => setShowWeeklyInsights(true)}
                  onOpenWakeUpReceipt={() => setShowReceipt(true)}
                  onOpenCognitiveBudget={() => setShowCognitiveBudget(true)}
                  onOpenHelp={() => setShowHelpGuide(true)}
                  onOpenSupport={() => setShowSupportTicket(true)}
                />
              </div>

              {/* Greeting */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mt-6 sm:mt-8 mb-4 sm:mb-6"
              >
                <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-medium text-foreground">
                  {greeting}, <span className="text-[#FFD700]">{userName}</span>.
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Systems stable. No action required.</p>
              </motion.div>
            </>
          )}

          {/* Main Grid - Only show for non-admin users */}
          {!isAdmin && (
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {/* Left Column - Quick Stats */}
              <div className="col-span-12 lg:col-span-3 space-y-3 order-2 lg:order-1">
                <QuickStatCard 
                  title="Wealth Portfolio"
                  value="+8.2%"
                  subtitle="This Week"
                  icon={TrendingUp}
                  graphic={<GoldStarburst />}
                  accentColor="gold"
                  isLive
                  isConnected={isConnected}
                  delay={100}
                />
                <QuickStatCard 
                  title="Life Balance"
                  value="7.5"
                  suffix=" Hrs"
                  icon={Moon}
                  graphic={<GoldStarburst />}
                  accentColor="gold"
                  delay={200}
                />
                <QuickStatCard 
                  title="Mind State"
                  value="12"
                  suffix=" Min"
                  icon={Brain}
                  graphic={<CyanOrb />}
                  accentColor="cyan"
                  delay={300}
                />
                <QuickStatCard 
                  title="Connected Devices"
                  value="5"
                  suffix=" Active"
                  icon={Cpu}
                  accentColor="cyan"
                  delay={400}
                />
              </div>

              {/* Center Column - Avatar & Metrics */}
              <div className="col-span-12 lg:col-span-6 space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* Avatar Area with glowing halo */}
                <GlassCard 
                  className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] relative overflow-visible"
                  hover={false}
                  glow="brand"
                  onClick={() => setShowConsole(true)}
                >
                  {/* TalkingAvatarMockup with integrated halo rings */}
                  <div className="relative z-10 mb-4">
                    <TalkingAvatarMockup 
                      onAvatarClick={() => setShowConsole(true)} 
                      lastMessage={lastAIMessage}
                    />
                  </div>
                  
                  {/* Metric Rings - Neon tube style */}
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mt-8 relative z-10">
                    <MetricRing 
                      label="Readiness"
                      value="82%"
                      percentage={82}
                      color="cyan"
                      size={80}
                    />
                    <MetricRing 
                      label="Earnings"
                      value="$5,420"
                      percentage={75}
                      color="gold"
                      size={100}
                    />
                    <MetricRing 
                      label="Focus Index"
                      value="74%"
                      percentage={74}
                      color="cyan"
                      size={80}
                    />
                  </div>
                </GlassCard>

                {/* Module Tiles - Bottom Dock Style */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <ModuleTile 
                    title="Wealth"
                    icon={Coins}
                    delay={400}
                    variant="gold"
                    onClick={() => handleModuleClick("Wealth")}
                  />
                  <ModuleTile 
                    title="Life & Health"
                    icon={Heart}
                    delay={500}
                    variant="gold"
                    onClick={() => handleModuleClick("Life & Health")}
                  />
                  <ModuleTile 
                    title="Mind & Growth"
                    icon={Lightbulb}
                    delay={600}
                    variant="purple"
                    onClick={() => handleModuleClick("Mind & Growth")}
                  />
                  <ModuleTile 
                    title="Sovereignty"
                    icon={Shield}
                    delay={700}
                    accentColor="cyan"
                    onClick={() => handleModuleClick("Sovereignty")}
                  />
                </div>
              </div>

              {/* Right Column - Integrations & Insights */}
              <div className="col-span-12 lg:col-span-3 space-y-3 order-3">
                <DeviceIntegration />
                <InsightsFeed />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adaptation Indicator */}
      <AdaptationIndicator />

      {/* Quick Action Buttons */}
      <div className="fixed bottom-28 md:bottom-24 right-4 flex flex-col gap-2 z-30">
        {/* DND Indicator */}
        {dndState.isActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowDNDPanel(true)}
            className="p-3 rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-xl hover:scale-105 transition-transform"
            title="Do Not Disturb Active"
          >
            <BellOff className="h-5 w-5 text-primary" />
          </motion.button>
        )}
        {/* Calendar Quick Action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setShowCalendar(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-[#00FFFF]/20 to-[#9370DB]/20 border border-[#00FFFF]/30 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Calendar"
        >
          <CalendarDays className="h-5 w-5 text-[#00FFFF]" />
        </motion.button>
        {/* Habits Quick Action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => setShowHabitTracker(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-[#9370DB]/20 to-[#00FFFF]/20 border border-[#9370DB]/30 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Habits"
        >
          <CheckSquare className="h-5 w-5 text-[#9370DB]" />
        </motion.button>
        {/* Notifications Quick Action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setShowNotificationBatching(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#9370DB]/20 border border-[#FFD700]/30 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Smart Notifications"
        >
          <Layers className="h-5 w-5 text-[#FFD700]" />
        </motion.button>
        {/* Recovery Mode */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => {
            setRecoveryAutoActivated(false);
            setShowRecoveryMode(true);
          }}
          className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-[#9370DB]/20 border border-pink-500/30 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Recovery Mode"
        >
          <Moon className="h-5 w-5 text-pink-400" />
        </motion.button>
        {/* Weekly Insights */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          onClick={() => setShowWeeklyInsights(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-[#9370DB]/20 to-[#00FFFF]/20 border border-[#9370DB]/30 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Weekly Insights"
        >
          <BarChart3 className="h-5 w-5 text-[#9370DB]" />
        </motion.button>
        {/* Morning Briefing */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => setShowBriefing(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#9370DB]/20 border border-[#FFD700]/30 backdrop-blur-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.15)]"
          title="Morning Briefing"
        >
          <Sunrise className="h-5 w-5 text-[#FFD700]" />
        </motion.button>
        {/* Wake-Up Receipt */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15 }}
          onClick={() => setShowReceipt(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          title="Wake-Up Receipt"
        >
          <Wallet className="h-5 w-5 text-amber-400" />
        </motion.button>
        {/* Cognitive Budget */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.18 }}
          onClick={() => setShowCognitiveBudget(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/30 backdrop-blur-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(147,112,219,0.2)]"
          title="Cognitive Budget"
        >
          <Brain className="h-5 w-5 text-secondary" />
        </motion.button>
        {/* Trust Controls */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => setShowTrustControls(true)}
          className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Trust Controls"
        >
          <ShieldCheck className="h-5 w-5 text-secondary" />
        </motion.button>
        {/* War Room */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
          onClick={() => setShowWarRoom(true)}
          className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-105 transition-transform"
          title="War Room"
        >
          <Map className="h-5 w-5 text-muted-foreground" />
        </motion.button>
        {/* Help Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          onClick={() => setShowHelpGuide(true)}
          className="p-3 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-xl hover:scale-105 transition-transform"
          title="Help & Guides"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
        </motion.button>
      </div>

      {/* Command Bar */}
      <CommandBar onSubmit={handleCommand} />

      {/* AI Assistant Bubble */}
      <div onClick={() => setShowConsole(true)}>
        <AvatarBubble />
      </div>

      {/* Demo Mode Components */}
      {isDemoMode && (
        <>
          <DemoModeIndicator onStartTutorial={() => setShowDemoTutorial(true)} />
          <DemoTutorial 
            isOpen={showDemoTutorial} 
            onClose={() => setShowDemoTutorial(false)} 
          />
        </>
      )}

      {/* Help Guide */}
      <HelpGuide 
        isOpen={showHelpGuide} 
        onClose={() => setShowHelpGuide(false)} 
      />

      {/* Dashboard Tour - shows after onboarding */}
      <DashboardTour
        isOpen={showDashboardTour}
        onClose={() => setShowDashboardTour(false)}
        onComplete={handleDashboardTourComplete}
      />

      {/* Modals */}
      <AnimatePresence>
        {showConsole && (
          <ConversationConsole 
            isOpen={showConsole} 
            onClose={() => {
              setShowConsole(false);
              resetWakeWord();
            }}
            onMessageReceived={(msg) => setLastAIMessage(msg)}
          />
        )}
        {showWarRoom && <WarRoom isOpen={showWarRoom} onClose={() => setShowWarRoom(false)} />}
        {showReceipt && <WakeUpReceipt isOpen={showReceipt} onClose={() => setShowReceipt(false)} />}
        {showBriefing && <MorningBriefing isOpen={showBriefing} onClose={() => setShowBriefing(false)} />}
        {showTrustControls && <TrustControlsDashboard isOpen={showTrustControls} onClose={() => setShowTrustControls(false)} />}
        {showRecoveryMode && (
          <RecoveryMode 
            isOpen={showRecoveryMode} 
            onClose={() => {
              setShowRecoveryMode(false);
              setRecoveryAutoActivated(false);
            }}
            autoActivated={recoveryAutoActivated}
          />
        )}
        {showDNDPanel && <DoNotDisturbPanel isOpen={showDNDPanel} onClose={() => setShowDNDPanel(false)} />}
        {showWeeklyInsights && <WeeklyInsights isOpen={showWeeklyInsights} onClose={() => setShowWeeklyInsights(false)} />}
        {showCalendar && <CalendarSync isOpen={showCalendar} onClose={() => setShowCalendar(false)} />}
        {showHabitTracker && <HabitTracker isOpen={showHabitTracker} onClose={() => setShowHabitTracker(false)} />}
        {showNotificationBatching && <NotificationBatchingPanel isOpen={showNotificationBatching} onClose={() => setShowNotificationBatching(false)} />}
        {showCognitiveBudget && <CognitiveBudgetVisualization isOpen={showCognitiveBudget} onClose={() => setShowCognitiveBudget(false)} />}
      </AnimatePresence>

      {/* Support Ticket Form */}
      <SupportTicketForm isOpen={showSupportTicket} onClose={() => setShowSupportTicket(false)} />

      {/* Wake Word Indicator */}
      <WakeWordIndicator
        isListening={wakeWordListening}
        isAwake={isWokenByVoice}
        onToggle={() => wakeWordListening ? stopWakeWord() : startWakeWord()}
      />
    </div>
  );
};

export default Index;
