import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GlassCard } from "@/components/GlassCard";
import { QuickStatCard } from "@/components/QuickStatCard";
import { ModuleTile } from "@/components/ModuleTile";
import { MetricRing } from "@/components/MetricRing";
import { DeviceIntegration } from "@/components/DeviceIntegration";
import { InsightsFeed } from "@/components/InsightsFeed";
import { CommandBar } from "@/components/CommandBar";
import { AvatarBubble } from "@/components/AvatarBubble";
import { AvatarHero } from "@/components/AvatarHero";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { ConversationConsole } from "@/components/ConversationConsole";
import bgParticles from "@/assets/bg-particles.jpg";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Moon, 
  Brain, 
  Smartphone,
  Coins,
  Heart,
  Lightbulb,
  Shield
} from "lucide-react";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [userName, setUserName] = useState("Alex");
  const navigate = useNavigate();

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

  const handleOnboardingComplete = (data: any) => {
    setUserName(data.name);
    setShowOnboarding(false);
  };

  const handleCommand = (text: string) => {
    setShowConsole(true);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with particle effect */}
      <div 
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      {/* Gradient overlay matching brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-secondary/5 via-background/80 to-primary/5" />
      
      {/* Animated glow orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Greeting */}
          <div className="text-center mt-6 sm:mt-8 mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-foreground">
              Good morning, {userName}.
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Systems stable. No action required.</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-3 lg:gap-6">
            {/* Left Column - Quick Stats */}
            <div className="col-span-12 lg:col-span-3 space-y-3 order-2 lg:order-1">
              <QuickStatCard 
                title="Wealth Portfolio"
                value="+8.2%"
                subtitle="This Week"
                icon={TrendingUp}
                delay={100}
              />
              <QuickStatCard 
                title="Life Balance"
                value="7.5"
                subtitle="Hrs"
                icon={Moon}
                delay={200}
              />
              <QuickStatCard 
                title="Mind State"
                value="12"
                subtitle="Min"
                icon={Brain}
                delay={300}
              />
              <QuickStatCard 
                title="Connected Devices"
                value="5"
                subtitle="Active"
                icon={Smartphone}
                delay={400}
              />
            </div>

            {/* Center Column - Avatar & Metrics */}
            <div className="col-span-12 lg:col-span-6 space-y-4 sm:space-y-6 order-1 lg:order-2">
              {/* Avatar Area with glowing halo */}
              <GlassCard 
                className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] animate-fade-in-up cursor-pointer relative overflow-visible"
                hover={false}
                style={{ animationDelay: "200ms" }}
                onClick={() => setShowConsole(true)}
              >
                {/* Glow effect behind avatar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-b from-secondary/30 via-accent/20 to-primary/30 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <AvatarHero />
                </div>
                
                {/* Metric Rings */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 mt-6 relative z-10">
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

              {/* Module Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div onClick={() => handleModuleClick("Wealth")}>
                  <ModuleTile 
                    title="Wealth"
                    icon={Coins}
                    delay={400}
                    variant="gold"
                  />
                </div>
                <div onClick={() => handleModuleClick("Life & Health")}>
                  <ModuleTile 
                    title="Life & Health"
                    icon={Heart}
                    delay={500}
                    variant="gold"
                  />
                </div>
                <div onClick={() => handleModuleClick("Mind & Growth")}>
                  <ModuleTile 
                    title="Mind & Growth"
                    icon={Lightbulb}
                    delay={600}
                    variant="purple"
                  />
                </div>
                <div onClick={() => handleModuleClick("Sovereignty")}>
                  <ModuleTile 
                    title="Sovereignty"
                    icon={Shield}
                    delay={700}
                    variant="gold"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Integrations & Insights */}
            <div className="col-span-12 lg:col-span-3 space-y-3 order-3">
              <DeviceIntegration />
              <InsightsFeed />
            </div>
          </div>
        </div>
      </div>

      {/* Command Bar */}
      <CommandBar onSubmit={handleCommand} />

      {/* AI Assistant Bubble */}
      <div onClick={() => setShowConsole(true)}>
        <AvatarBubble />
      </div>

      {/* Conversation Console */}
      <ConversationConsole 
        isOpen={showConsole} 
        onClose={() => setShowConsole(false)} 
      />
    </div>
  );
};

export default Index;
