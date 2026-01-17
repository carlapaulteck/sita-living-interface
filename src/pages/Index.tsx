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
import { SitaOrb3D } from "@/components/SitaOrb3D";
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
    if (module === "Wealth" || module === "Business Growth") {
      navigate("/business-growth");
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      <div className="fixed inset-0 bg-background/60" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header />

          {/* Greeting */}
          <div className="text-center mt-8 mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-3xl font-display font-medium text-foreground">
              Good morning, {userName}.
            </h1>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Left Column - Quick Stats */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
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
            <div className="col-span-12 lg:col-span-6 space-y-6">
              {/* 3D Orb Area */}
              <GlassCard 
                className="p-8 flex flex-col items-center justify-center min-h-[380px] animate-fade-in-up cursor-pointer"
                hover={false}
                style={{ animationDelay: "200ms" }}
                onClick={() => setShowConsole(true)}
              >
                <div className="w-full h-48 mb-4">
                  <SitaOrb3D state="idle" />
                </div>
                
                {/* Metric Rings */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 mt-4">
                  <MetricRing 
                    label="Readiness"
                    value="82%"
                    percentage={82}
                    color="cyan"
                    size={90}
                  />
                  <MetricRing 
                    label="Earnings"
                    value="$5,420"
                    percentage={75}
                    color="gold"
                    size={110}
                  />
                  <MetricRing 
                    label="Focus Index"
                    value="74%"
                    percentage={74}
                    color="cyan"
                    size={90}
                  />
                </div>
              </GlassCard>

              {/* Module Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div onClick={() => handleModuleClick("Wealth")}>
                  <ModuleTile 
                    title="Wealth"
                    icon={Coins}
                    delay={400}
                  />
                </div>
                <ModuleTile 
                  title="Life & Health"
                  icon={Heart}
                  delay={500}
                />
                <ModuleTile 
                  title="Mind & Growth"
                  icon={Lightbulb}
                  delay={600}
                />
                <ModuleTile 
                  title="Sovereignty"
                  icon={Shield}
                  delay={700}
                />
              </div>
            </div>

            {/* Right Column - Integrations & Insights */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
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
