import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { 
  ChevronRight, 
  Moon, 
  Sun, 
  Sparkles, 
  Watch,
  Smartphone,
  Heart,
  Home,
  User,
  Check
} from "lucide-react";
import { SitaOrb3D } from "./SitaOrb3D";
import avatarImage from "@/assets/avatar.jpg";

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  complete: () => void;
}

interface OnboardingData {
  theme: "dark" | "light" | "auto";
  devices: string[];
  avatarStyle: string;
  name: string;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

// Step 1: Welcome
function WelcomeStep() {
  const { setStep } = useOnboarding();
  
  return (
    <motion.div 
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="w-64 h-64 mb-8">
        <SitaOrb3D state="idle" />
      </div>
      
      <h1 className="text-4xl font-display font-medium text-foreground mb-4">
        Welcome to SITA
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Your personal AI companion for wealth, health, and life optimization.
        Let's set up your living interface.
      </p>
      
      <Button 
        onClick={() => setStep(1)}
        className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 text-lg"
      >
        Begin Setup
        <ChevronRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}

// Step 2: Theme Selection
function ThemeStep() {
  const { setStep, data, updateData } = useOnboarding();
  
  const themes = [
    { id: "dark", label: "Dark Mode", icon: Moon, desc: "Optimal for focus" },
    { id: "light", label: "Light Mode", icon: Sun, desc: "Classic brightness" },
    { id: "auto", label: "Auto", icon: Sparkles, desc: "Follows system" },
  ] as const;
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2">
        Choose Your Theme
      </h2>
      <p className="text-muted-foreground mb-8">
        Select your preferred visual experience
      </p>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {themes.map((theme) => (
          <GlassCard
            key={theme.id}
            className={`p-6 cursor-pointer flex flex-col items-center gap-3 transition-all duration-300 ${
              data.theme === theme.id 
                ? "ring-2 ring-primary shadow-glow-gold" 
                : ""
            }`}
            onClick={() => updateData({ theme: theme.id })}
          >
            <div className="p-3 rounded-xl bg-foreground/5">
              <theme.icon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{theme.label}</span>
            <span className="text-xs text-muted-foreground">{theme.desc}</span>
          </GlassCard>
        ))}
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(0)}>
          Back
        </Button>
        <Button 
          onClick={() => setStep(2)}
          className="gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// Step 3: Device Connection
function DevicesStep() {
  const { setStep, data, updateData } = useOnboarding();
  
  const devices = [
    { id: "oura", label: "Oura Ring", icon: Watch },
    { id: "apple-health", label: "Apple Health", icon: Heart },
    { id: "smart-home", label: "Smart Home", icon: Home },
    { id: "phone", label: "Mobile Sync", icon: Smartphone },
  ];
  
  const toggleDevice = (deviceId: string) => {
    const current = data.devices;
    if (current.includes(deviceId)) {
      updateData({ devices: current.filter(d => d !== deviceId) });
    } else {
      updateData({ devices: [...current, deviceId] });
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2">
        Connect Your Devices
      </h2>
      <p className="text-muted-foreground mb-8">
        Select devices to integrate with SITA
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        {devices.map((device) => {
          const isSelected = data.devices.includes(device.id);
          return (
            <GlassCard
              key={device.id}
              className={`p-5 cursor-pointer flex items-center gap-3 transition-all duration-300 ${
                isSelected 
                  ? "ring-2 ring-secondary shadow-glow-cyan" 
                  : ""
              }`}
              onClick={() => toggleDevice(device.id)}
            >
              <div className={`p-2 rounded-xl ${isSelected ? "bg-secondary/20" : "bg-foreground/5"}`}>
                <device.icon className={`h-6 w-6 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
              </div>
              <span className="text-sm font-medium text-foreground">{device.label}</span>
              {isSelected && (
                <Check className="h-4 w-4 text-secondary ml-auto" />
              )}
            </GlassCard>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground mb-6">
        You can connect more devices later in settings
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)}
          className="gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// Step 4: Avatar/Name
function AvatarStep() {
  const { setStep, data, updateData, complete } = useOnboarding();
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2">
        Personalize SITA
      </h2>
      <p className="text-muted-foreground mb-8">
        What should SITA call you?
      </p>
      
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 blur-lg opacity-60 animate-pulse-glow" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/40">
          <img 
            src={avatarImage} 
            alt="SITA" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <GlassCard className="p-1 mb-8">
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter your name"
          className="w-64 px-4 py-3 bg-transparent text-center text-lg outline-none placeholder:text-muted-foreground/50"
        />
      </GlassCard>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button 
          onClick={complete}
          disabled={!data.name.trim()}
          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          Complete Setup
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    theme: "dark",
    devices: [],
    avatarStyle: "executive",
    name: "",
  });
  
  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };
  
  const complete = () => {
    localStorage.setItem("sita_onboarded", "true");
    localStorage.setItem("sita_user_name", data.name);
    onComplete(data);
  };
  
  const steps = [WelcomeStep, ThemeStep, DevicesStep, AvatarStep];
  const CurrentStep = steps[step];
  
  return (
    <OnboardingContext.Provider value={{ step, setStep, data, updateData, complete }}>
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        {/* Progress dots */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step 
                  ? "bg-primary w-6" 
                  : i < step 
                    ? "bg-primary/50" 
                    : "bg-foreground/20"
              }`}
            />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <CurrentStep key={step} />
        </AnimatePresence>
      </div>
    </OnboardingContext.Provider>
  );
}
