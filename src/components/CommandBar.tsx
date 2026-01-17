import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Mic, Send } from "lucide-react";

interface CommandBarProps {
  onSubmit?: (text: string) => void;
}

export function CommandBar({ onSubmit }: CommandBarProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
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
          isFocused ? "ring-1 ring-secondary/50 shadow-glow-cyan" : ""
        }`}
        hover={false}
      >
        <button
          className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          aria-label="Voice input"
        >
          <Mic className="h-5 w-5 text-muted-foreground" />
        </button>

        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Speak or type a command..."
        />

        <button
          className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          onClick={handleSubmit}
          aria-label="Send"
        >
          <Mic className="h-5 w-5 text-muted-foreground" />
        </button>
      </GlassCard>
    </div>
  );
}
