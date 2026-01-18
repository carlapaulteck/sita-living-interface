import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { X, Send, Mic, Loader2, Volume2, VolumeX } from "lucide-react";
import { SitaOrb3D } from "./SitaOrb3D";
import { VoiceWaveform } from "./VoiceWaveform";
import { SpeechWaveformVisualizer } from "./SpeechWaveformVisualizer";
import { PersonalityModeSelector } from "./PersonalityModeSelector";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAvatarStateSafe } from "@/contexts/AvatarStateContext";
import { usePersonalitySafe } from "@/contexts/PersonalityContext";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import avatarImage from "@/assets/avatar.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageReceived?: (message: string) => void;
}

export function ConversationConsole({ isOpen, onClose, onMessageReceived }: ConversationConsoleProps) {
  const personality = usePersonalitySafe();
  const initialGreeting = personality?.config.greeting || 
    "Good morning. I've reviewed your metrics. Your business is performing well—revenue up 8% this week. Shall we discuss growth strategies or review your focus schedule?";
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialGreeting }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "speaking">("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [simulatedAudioLevel, setSimulatedAudioLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Avatar state context for global avatar animations
  const avatarState = useAvatarStateSafe();
  
  // Audio analyzer for real lip-sync
  const { audioLevel, frequencyData, isAnalyzing } = useAudioAnalyzer();

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech({ voice: "nova", speed: 1.0 });

  const {
    isListening,
    toggleListening,
    isSupported,
  } = useVoiceRecognition({
    onResult: (transcript) => {
      setInput(transcript);
      // Auto-submit after voice
      if (transcript.trim()) {
        setTimeout(() => {
          setOrbState("listening");
          const userMessage: Message = { role: "user", content: transcript.trim() };
          setMessages(prev => [...prev, userMessage]);
          setInput("");
        }, 300);
      }
    },
    onInterimResult: (interim) => {
      if (interim) setInput(interim);
    },
  });

  // Update orb state and global avatar state based on speaking
  useEffect(() => {
    if (isSpeaking) {
      setOrbState("speaking");
      avatarState?.setState("speaking");
    } else if (isListening) {
      setOrbState("listening");
      avatarState?.setState("listening");
    } else if (!isLoading) {
      setOrbState("idle");
      avatarState?.setState("idle");
    }
  }, [isSpeaking, isListening, isLoading, avatarState]);

  // Simulate audio level when speaking for waveform visualization
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setSimulatedAudioLevel(Math.random() * 0.6 + 0.2);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setSimulatedAudioLevel(0);
    }
  }, [isSpeaking]);

  // Use real audio level if available, otherwise use simulated
  const effectiveAudioLevel = isAnalyzing ? audioLevel : simulatedAudioLevel;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setOrbState("listening");

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      setOrbState("speaking");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, put back and wait
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Speak the response if voice is enabled
      if (voiceEnabled && assistantContent) {
        speak(assistantContent);
      }
      
      // Notify parent of received message for emotion detection
      onMessageReceived?.(assistantContent);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
      if (!isSpeaking) setOrbState("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl"
      >
        <div className="h-full max-w-4xl mx-auto flex flex-col p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40">
                <img src={avatarImage} alt="SITA" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                  SITA Console
                  {personality && (
                    <span className="text-sm font-normal text-muted-foreground">
                      • {personality.config.icon} {personality.config.name}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">The Living Interface</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PersonalityModeSelector variant="compact" className="hidden sm:flex" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Speech Waveform Visualization when speaking */}
          <AnimatePresence>
            {(isSpeaking || isListening) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <SpeechWaveformVisualizer
                    audioLevel={effectiveAudioLevel}
                    frequencyData={frequencyData}
                    isActive={isSpeaking || isListening}
                    variant="bars"
                    colorScheme="gradient"
                    size="md"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orb visualization */}
          <div className="flex-shrink-0 h-48 mb-4">
            <SitaOrb3D state={orbState} />
          </div>

          {/* Messages */}
          <GlassCard className="flex-1 overflow-hidden flex flex-col" hover={false}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary/20 text-foreground"
                        : "bg-foreground/5 text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                      {message.role === "assistant" && isLoading && index === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 bg-secondary ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-foreground/10">
              <div className="flex items-center gap-3">
                {isSupported && (
                  <motion.button 
                    onClick={toggleListening}
                    className={`p-2 rounded-xl border transition-colors relative ${
                      isListening 
                        ? "border-primary/50 bg-primary/20" 
                        : "border-foreground/10 hover:border-primary/50"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Mic className="h-5 w-5 text-primary" />
                      </motion.div>
                    ) : (
                      <Mic className="h-5 w-5 text-muted-foreground" />
                    )}
                    {isListening && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-primary/20"
                        animate={{ opacity: [0.5, 0], scale: [1, 1.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </motion.button>
                )}
                
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening..." : "Ask SITA anything..."}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
                    disabled={isLoading}
                  />
                  {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <VoiceWaveform isActive={isListening} />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-primary/20 hover:bg-primary/30 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 text-primary" />
                  )}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
