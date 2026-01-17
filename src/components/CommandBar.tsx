import { useState, useEffect } from "react";
import { GlassCard } from "./GlassCard";
import { VoiceWaveform } from "./VoiceWaveform";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Mic, Send, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandBarProps {
  onSubmit?: (text: string) => void;
}

export function CommandBar({ onSubmit }: CommandBarProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { 
    state: voiceState, 
    transcript, 
    isSupported, 
    toggle: toggleVoice,
    isListening 
  } = useVoiceRecognition({
    onFinalTranscript: (finalText) => {
      setText(finalText);
      handleSubmit(finalText);
    },
    onTranscript: (currentTranscript) => {
      setText(currentTranscript);
    },
  });

  const handleSubmit = (submitText?: string) => {
    const textToSubmit = submitText || text;
    if (!textToSubmit.trim()) return;
    onSubmit?.(textToSubmit.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(800px,92vw)] z-50 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
      <GlassCard 
        className={`px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
          isFocused || isListening ? "ring-1 ring-secondary/50 shadow-glow-cyan" : ""
        } ${isListening ? "ring-2 ring-secondary" : ""}`}
        hover={false}
      >
        <motion.button
          onClick={toggleVoice}
          disabled={!isSupported}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-xl border transition-all duration-200 ${
            isListening 
              ? "border-secondary bg-secondary/20 text-secondary" 
              : "border-foreground/10 hover:border-primary/50 hover:bg-primary/5"
          } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <VoiceWaveform isActive={true} barCount={5} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {isSupported ? (
                  <Mic className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <MicOff className="h-5 w-5 text-muted-foreground" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Speak or type a command..."}
          />
          <AnimatePresence>
            {isListening && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-secondary"
              >
                Listening...
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          onClick={() => handleSubmit()}
          aria-label="Send"
        >
          <Send className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </GlassCard>
    </div>
  );
}
