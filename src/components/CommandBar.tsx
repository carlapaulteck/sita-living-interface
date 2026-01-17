import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Sparkles, Command } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { VoiceWaveform } from "./VoiceWaveform";

interface CommandBarProps {
  onSubmit: (text: string) => void;
}

export function CommandBar({ onSubmit }: CommandBarProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    interimTranscript,
    toggleListening,
    isSupported,
  } = useVoiceRecognition({
    onResult: (transcript) => {
      setInput(transcript);
      if (transcript.trim()) {
        setTimeout(() => {
          onSubmit(transcript);
          setInput("");
        }, 500);
      }
    },
    onInterimResult: (interim) => {
      if (interim) {
        setInput(interim);
      }
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 pb-6">
        <form onSubmit={handleSubmit}>
          <motion.div
            className={`relative flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ${
              isFocused || isListening
                ? "bg-card/90 border border-primary/50 shadow-lg shadow-primary/10"
                : "bg-card/70 border border-border/50"
            } backdrop-blur-xl`}
            animate={{
              boxShadow: isListening
                ? "0 0 30px rgba(var(--primary), 0.3)"
                : isFocused
                ? "0 10px 40px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {isSupported && (
              <motion.button
                type="button"
                onClick={toggleListening}
                className={`relative p-3 rounded-xl transition-colors ${
                  isListening
                    ? "bg-primary/30 text-primary"
                    : "bg-foreground/5 hover:bg-foreground/10 text-muted-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Mic className="h-5 w-5" />
                )}
                
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-xl bg-primary/30"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Speak or type a command..."}
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50 py-2 px-1"
              />
              
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <VoiceWaveform isActive={isListening} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-foreground/5 text-muted-foreground/50 text-xs">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>

            <motion.button
              type="submit"
              disabled={!input.trim()}
              className={`p-3 rounded-xl transition-colors ${
                input.trim()
                  ? "bg-primary/20 hover:bg-primary/30 text-primary"
                  : "bg-foreground/5 text-muted-foreground/50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {input.trim() ? (
                <Send className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>
        </form>

        <AnimatePresence>
          {isFocused && !input && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 p-3 rounded-xl bg-card/90 border border-border/50 backdrop-blur-xl"
            >
              <p className="text-xs text-muted-foreground mb-2">Quick commands</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Show business pulse",
                  "Open inbox",
                  "Check revenue",
                  "Start focus mode",
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setInput(cmd);
                      onSubmit(cmd);
                      setInput("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs text-muted-foreground transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
