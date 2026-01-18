import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mic, MicOff, Plus, Trash2, Volume2 } from "lucide-react";
import { useWakeWordSettings } from "@/contexts/WakeWordContext";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface WakeWordSettingsProps {
  className?: string;
  compact?: boolean;
}

export function WakeWordSettings({ className = "", compact = false }: WakeWordSettingsProps) {
  const {
    currentWakeWord,
    customWakeWord,
    availableWakeWords,
    setWakeWord,
    setCustomWakeWord,
    isEnabled,
    setEnabled,
    sensitivity,
    setSensitivity
  } = useWakeWordSettings();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [testingWord, setTestingWord] = useState<string | null>(null);

  const handleAddCustom = () => {
    if (customInput.trim()) {
      setCustomWakeWord(customInput.trim());
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  const handleTestWord = (phrase: string) => {
    setTestingWord(phrase);
    // Simulate speech synthesis to test the word
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.onend = () => setTestingWord(null);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setTestingWord(null), 1000);
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={setEnabled}
            id="wake-word-enabled"
          />
          <Label htmlFor="wake-word-enabled" className="text-sm text-muted-foreground">
            Voice activation
          </Label>
        </div>
        {isEnabled && (
          <span className="text-sm text-primary">"{currentWakeWord.phrase}"</span>
        )}
      </div>
    );
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Mic className="w-5 h-5 text-primary" />
          ) : (
            <MicOff className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <h3 className="text-lg font-medium text-foreground">Wake Word Settings</h3>
            <p className="text-sm text-muted-foreground">
              Customize how you activate SITA by voice
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={setEnabled}
        />
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Wake word selection */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Select Wake Phrase</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableWakeWords.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setWakeWord(option.id)}
                  className={`relative p-3 rounded-lg border text-left transition-all ${
                    currentWakeWord.id === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {option.displayName}
                    </span>
                    {currentWakeWord.id === option.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestWord(option.phrase);
                    }}
                    className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Volume2 className={`w-3 h-3 ${testingWord === option.phrase ? "animate-pulse text-primary" : ""}`} />
                    Test
                  </button>
                </motion.button>
              ))}
              
              {/* Add custom button */}
              {!showCustomInput && !customWakeWord && (
                <motion.button
                  onClick={() => setShowCustomInput(true)}
                  className="p-3 rounded-lg border border-dashed border-border/50 hover:border-primary/50 text-center transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Custom</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Custom wake word input */}
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom phrase..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
              />
              <Button onClick={handleAddCustom} disabled={!customInput.trim()}>
                Add
              </Button>
              <Button variant="ghost" onClick={() => setShowCustomInput(false)}>
                Cancel
              </Button>
            </motion.div>
          )}

          {/* Sensitivity slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Detection Sensitivity</Label>
              <span className="text-sm text-primary">{Math.round(sensitivity * 100)}%</span>
            </div>
            <Slider
              value={[sensitivity]}
              onValueChange={([value]) => setSensitivity(value)}
              min={0.3}
              max={0.9}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Strict</span>
              <span>Lenient</span>
            </div>
          </div>

          {/* Current active wake word display */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-foreground">Listening for:</span>
            </div>
            <p className="text-lg text-primary font-medium">
              "{currentWakeWord.phrase}"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Speak clearly and pause briefly before saying the wake phrase
            </p>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}
