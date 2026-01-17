import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Volume2, Vibrate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VoiceGender } from "@/types/onboarding";

const VOICE_OPTIONS: { id: VoiceGender; label: string }[] = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "androgynous", label: "Neutral" },
];

const HAPTIC_OPTIONS = [
  { id: "subtle" as const, label: "Subtle" },
  { id: "medium" as const, label: "Medium" },
  { id: "off" as const, label: "Off" },
];

export function VoiceSettingsStep() {
  const { data, updateData, updateNestedData, nextStep, prevStep, isQuickMode } = useOnboarding();

  // Skip this step in quick mode
  if (isQuickMode) {
    nextStep();
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Voice & Sensory
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Customize how SITA sounds and feels
      </p>

      <div className="flex flex-col gap-5 w-full mb-8">
        {/* Voice Gender */}
        <GlassCard className="p-4">
          <span className="text-sm font-medium text-foreground mb-3 block">
            Voice
          </span>
          <div className="flex gap-2">
            {VOICE_OPTIONS.map((option) => {
              const isSelected = data.voiceProfile.gender === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => updateNestedData("voiceProfile", "gender", option.id)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Voice Speed */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Speed</span>
            <span className="text-xs text-muted-foreground">
              {data.voiceProfile.speed.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[data.voiceProfile.speed]}
            onValueChange={([value]) => updateNestedData("voiceProfile", "speed", value)}
            min={0.5}
            max={2.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Slower</span>
            <span className="text-xs text-muted-foreground">Faster</span>
          </div>
        </GlassCard>

        {/* Voice Warmth */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Warmth</span>
            <span className="text-xs text-muted-foreground">
              {data.voiceProfile.warmth}%
            </span>
          </div>
          <Slider
            value={[data.voiceProfile.warmth]}
            onValueChange={([value]) => updateNestedData("voiceProfile", "warmth", value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Professional</span>
            <span className="text-xs text-muted-foreground">Warm</span>
          </div>
        </GlassCard>

        {/* Ambient Sound */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium text-foreground">Ambient Sound</span>
                <p className="text-xs text-muted-foreground">Subtle background hum</p>
              </div>
            </div>
            <button
              onClick={() => updateNestedData("sensoryPrefs", "ambientSound", !data.sensoryPrefs.ambientSound)}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                data.sensoryPrefs.ambientSound ? "bg-primary" : "bg-foreground/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-foreground transition-transform duration-300 ${
                  data.sensoryPrefs.ambientSound ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </GlassCard>

        {/* Haptics */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Vibrate className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Haptics</span>
          </div>
          <div className="flex gap-2">
            {HAPTIC_OPTIONS.map((option) => {
              const isSelected = data.sensoryPrefs.haptics === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => updateNestedData("sensoryPrefs", "haptics", option.id)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

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
