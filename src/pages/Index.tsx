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
import bgParticles from "@/assets/bg-particles.jpg";
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
  const handleCommand = (text: string) => {
    console.log("Command:", text);
  };

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
              Good morning, Alex.
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
              {/* Avatar Area */}
              <GlassCard 
                className="p-8 flex flex-col items-center justify-center min-h-[380px] animate-fade-in-up"
                hover={false}
                style={{ animationDelay: "200ms" }}
              >
                <AvatarHero />
                
                {/* Metric Rings */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
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
                <ModuleTile 
                  title="Wealth"
                  icon={Coins}
                  delay={400}
                />
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
      <AvatarBubble />
    </div>
  );
};

export default Index;
