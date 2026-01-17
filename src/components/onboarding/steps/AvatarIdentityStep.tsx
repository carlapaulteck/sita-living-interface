import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Sparkles, User, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitaOrb3D } from "@/components/SitaOrb3D";
import { AvatarStyle, PresenceStyle } from "@/types/onboarding";

const AVATAR_STYLES: { id: AvatarStyle; label: string; icon: typeof Circle }[] = [
  { id: "orb", label: "Orb", icon: Circle },
  { id: "human", label: "Human", icon: User },
  { id: "abstract", label: "Abstract", icon: Sparkles },
];

const PRESENCE_STYLES: { id: PresenceStyle; label: string; desc: string }[] = [
  { id: "calm", label: "Calm", desc: "Serene and composed" },
  { id: "sharp", label: "Sharp", desc: "Focused and precise" },
  { id: "playful", label: "Playful", desc: "Light and creative" },
  { id: "mysterious", label: "Mysterious", desc: "Enigmatic presence" },
];

export function AvatarIdentityStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Your SITA Identity
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Customize how SITA appears and feels
      </p>

      {/* Avatar Preview */}
      <div className="w-40 h-40 mb-6">
        <SitaOrb3D state="idle" />
      </div>

      {/* Avatar Style */}
      <div className="w-full mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">Avatar Style</span>
        <div className="flex gap-2">
          {AVATAR_STYLES.map((style) => {
            const isSelected = data.avatarStyle === style.id;
            const Icon = style.icon;
            return (
              <button
                key={style.id}
                onClick={() => updateData("avatarStyle", style.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Presence Style */}
      <div className="w-full mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">Presence</span>
        <div className="grid grid-cols-2 gap-2">
          {PRESENCE_STYLES.map((style) => {
            const isSelected = data.presenceStyle === style.id;
            return (
              <GlassCard
                key={style.id}
                className={`p-3 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-secondary shadow-glow-cyan"
                    : "hover:border-secondary/30"
                }`}
                onClick={() => updateData("presenceStyle", style.id)}
              >
                <span className="font-medium text-foreground text-sm">{style.label}</span>
                <p className="text-xs text-muted-foreground">{style.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Morning Ritual */}
      <GlassCard className="w-full p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">Morning Ritual</span>
            <p className="text-xs text-muted-foreground">Daily personalized check-in</p>
          </div>
          <button
            onClick={() => updateData("morningRitual", !data.morningRitual)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              data.morningRitual ? "bg-primary" : "bg-foreground/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-foreground transition-transform duration-300 ${
                data.morningRitual ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
