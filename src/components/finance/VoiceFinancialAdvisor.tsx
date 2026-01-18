import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Brain,
  Sparkles,
  Volume2,
  MessageCircle,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useFinance } from "@/hooks/useFinance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function VoiceFinancialAdvisor() {
  const { transactions, budgets, investments, monthlySpending, monthlyIncome, totalBalance } = useFinance();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInputText(transcript);
    // Auto-submit after voice input
    if (transcript.trim()) {
      handleSubmit(transcript);
    }
  }, []);

  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    isSupported,
    error,
  } = useVoiceRecognition({
    onResult: handleVoiceResult,
    continuous: false,
    language: "en-US",
  });

  // Build financial context for AI
  const buildFinancialContext = () => {
    const categorySpending: Record<string, number> = {};
    transactions.forEach((t) => {
      if (Number(t.amount) < 0) {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(Number(t.amount));
      }
    });

    return `
User's Financial Summary:
- Monthly Income: $${monthlyIncome.toLocaleString()}
- Monthly Spending: $${monthlySpending.toLocaleString()}
- Current Balance: $${totalBalance.toLocaleString()}
- Savings Rate: ${monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome * 100).toFixed(1) : 0}%

Spending by Category:
${Object.entries(categorySpending).map(([cat, amount]) => `- ${cat}: $${amount.toLocaleString()}`).join("\n")}

Budgets:
${budgets.map(b => `- ${b.category}: $${b.spent || 0}/$${b.budget_amount} (${Math.round((b.spent || 0) / Number(b.budget_amount) * 100)}% used)`).join("\n")}

Investments:
${investments.map(i => `- ${i.name} (${i.symbol}): $${Number(i.current_value).toLocaleString()} (${(((Number(i.current_value) - Number(i.cost_basis)) / Number(i.cost_basis)) * 100).toFixed(1)}% return)`).join("\n")}
Total Portfolio Value: $${investments.reduce((a, i) => a + Number(i.current_value), 0).toLocaleString()}
    `;
  };

  const handleSubmit = async (text?: string) => {
    const query = text || inputText.trim();
    if (!query || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);
    setIsExpanded(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are SITA, a sophisticated AI financial advisor. You have access to the user's complete financial data. Answer questions directly and specifically based on their actual data. Be concise but helpful. When giving numbers, be precise. If asked about spending, calculate exact amounts from the data provided.

${buildFinancialContext()}

Guidelines:
- Answer questions about their specific spending, budgets, and investments
- Provide personalized advice based on their actual financial situation
- Use their real numbers in your responses
- Keep responses under 150 words
- Be warm but professional`,
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: "user",
              content: query,
            },
          ],
        },
      });

      if (data?.response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to get response");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const exampleQuestions = [
    "How much did I spend on food this month?",
    "Am I over budget anywhere?",
    "What's my savings rate?",
    "How are my investments performing?",
  ];

  return (
    <GlassCard premium className="p-0 overflow-hidden">
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10" />
        <motion.div
          className="absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className={`relative p-4 rounded-2xl ${
                  isListening
                    ? "bg-gradient-to-br from-accent/30 to-accent/10 border-accent/50"
                    : "bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30"
                } border`}
                animate={
                  isListening
                    ? {
                        boxShadow: [
                          "0 0 20px rgba(100,210,230,0.3)",
                          "0 0 40px rgba(100,210,230,0.5)",
                          "0 0 20px rgba(100,210,230,0.3)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Brain className={`h-8 w-8 ${isListening ? "text-accent" : "text-secondary"}`} />
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-accent"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-foreground font-serif">
                  Voice Financial Advisor
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isListening ? "Listening..." : "Ask me anything about your finances"}
                </p>
              </div>
            </div>

            <Button
              onClick={toggleListening}
              disabled={!isSupported}
              size="lg"
              className={`rounded-full h-14 w-14 ${
                isListening
                  ? "bg-gradient-to-r from-accent to-cyan-500 animate-pulse"
                  : "bg-gradient-to-r from-secondary to-primary"
              } hover:opacity-90`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>

          {/* Voice waveform visualization */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-1 h-16 bg-gradient-to-r from-accent/10 to-cyan-500/10 rounded-xl border border-accent/20">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-accent to-cyan-400"
                      animate={{
                        height: [8, 32, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                {interimTranscript && (
                  <p className="text-center text-sm text-accent mt-2 italic">
                    "{interimTranscript}"
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Example questions */}
          {messages.length === 0 && !isExpanded && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSubmit(q)}
                    className="px-3 py-2 text-sm rounded-full bg-white/[0.03] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    "{q}"
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          <AnimatePresence>
            {isExpanded && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 max-h-80 overflow-y-auto space-y-4 pr-2"
              >
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-tr-sm"
                          : "bg-gradient-to-r from-secondary/20 to-purple-500/10 border border-secondary/30 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/20 to-purple-500/10 border border-secondary/30 rounded-tl-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                        <span className="text-sm text-muted-foreground">Analyzing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text input */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type or speak your question..."
                className="bg-white/[0.03] border-white/[0.08] h-12 pr-12 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!inputText.trim() || isProcessing}
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 mt-2 text-center">{error}</p>
          )}
          {!isSupported && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Voice recognition is not supported in this browser
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
