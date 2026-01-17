import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  User,
  Bot,
  AlertTriangle,
  Check,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface Message {
  id: string;
  from: "customer" | "agent";
  text: string;
  timestamp: string;
  channel: "sms" | "whatsapp" | "email" | "call";
}

interface Thread {
  id: string;
  contactName: string;
  contactEmail: string;
  channel: "sms" | "whatsapp" | "email" | "call";
  lastMessage: string;
  timestamp: string;
  status: "handled" | "needs_review" | "vip" | "at_risk";
  needsHuman: boolean;
  messages: Message[];
  suggestedReply?: string;
}

interface UnifiedInboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoThreads: Thread[] = [
  {
    id: "t1",
    contactName: "Jordan Lee",
    contactEmail: "jordan@example.com",
    channel: "sms",
    lastMessage: "Need a roof inspection. Can you come this week?",
    timestamp: "9:02 AM",
    status: "handled",
    needsHuman: false,
    messages: [
      { id: "m1", from: "customer", text: "Need a roof inspection. Can you come this week?", timestamp: "9:02 AM", channel: "sms" },
      { id: "m2", from: "agent", text: "Absolutely. I can book an inspection this week. What day works best—Tue or Thu?", timestamp: "9:02 AM", channel: "sms" },
    ],
    suggestedReply: "Great, I've scheduled you for Tuesday at 10 AM. You'll receive a confirmation shortly."
  },
  {
    id: "t2",
    contactName: "Sam Rivera",
    contactEmail: "sam@example.com",
    channel: "whatsapp",
    lastMessage: "How much is a trial class?",
    timestamp: "7:45 AM",
    status: "needs_review",
    needsHuman: true,
    messages: [
      { id: "m3", from: "customer", text: "How much is a trial class?", timestamp: "7:45 AM", channel: "whatsapp" },
      { id: "m4", from: "agent", text: "Trial is $19. Want today at 6pm or tomorrow at 7am? If you join after, we credit the $19.", timestamp: "7:45 AM", channel: "whatsapp" },
      { id: "m5", from: "customer", text: "Can I get a discount if I bring a friend?", timestamp: "7:48 AM", channel: "whatsapp" },
    ],
    suggestedReply: "Absolutely! Bring a friend and you both get 20% off your first month."
  },
  {
    id: "t3",
    contactName: "Maya Patel",
    contactEmail: "maya@example.com",
    channel: "email",
    lastMessage: "Following up on my gutter cleaning quote",
    timestamp: "Yesterday",
    status: "vip",
    needsHuman: false,
    messages: [
      { id: "m6", from: "customer", text: "Hi, I'm following up on the quote you sent last week for gutter cleaning. Is that still valid?", timestamp: "Yesterday", channel: "email" },
      { id: "m7", from: "agent", text: "Hi Maya! Yes, your quote for $450 is still valid until the 22nd. Would you like to proceed with booking?", timestamp: "Yesterday", channel: "email" },
    ],
    suggestedReply: "I'd be happy to schedule this for you. We have availability this Thursday morning or Friday afternoon."
  }
];

const channelIcons = {
  sms: MessageSquare,
  whatsapp: MessageSquare,
  email: Mail,
  call: Phone
};

const statusColors = {
  handled: "bg-secondary/20 text-secondary",
  needs_review: "bg-primary/20 text-primary",
  vip: "bg-primary/20 text-primary",
  at_risk: "bg-destructive/20 text-destructive"
};

const statusLabels = {
  handled: "Handled",
  needs_review: "Needs Review",
  vip: "VIP",
  at_risk: "At Risk"
};

export function UnifiedInbox({ isOpen, onClose }: UnifiedInboxProps) {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [filter, setFilter] = useState<"all" | "needs_you" | "vip">("all");
  const [replyText, setReplyText] = useState("");
  const [tone, setTone] = useState<"calm" | "direct" | "warm" | "firm">("calm");
  const [isAutopilot, setIsAutopilot] = useState(true);

  if (!isOpen) return null;

  const filteredThreads = demoThreads.filter(thread => {
    if (filter === "needs_you") return thread.needsHuman;
    if (filter === "vip") return thread.status === "vip";
    return true;
  });

  const handleUseDraft = () => {
    if (selectedThread?.suggestedReply) {
      setReplyText(selectedThread.suggestedReply);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">Inbox</h2>
            <p className="text-sm text-muted-foreground">Only what needs a human.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="pt-20 h-full flex">
        {/* Thread list */}
        <div className="w-96 border-r border-border/50 h-full overflow-y-auto">
          {/* Filters */}
          <div className="p-4 border-b border-border/50">
            <div className="flex gap-2">
              {(["all", "needs_you", "vip"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-foreground/5"
                  }`}
                >
                  {f === "all" ? "All" : f === "needs_you" ? "Needs You" : "VIP"}
                </button>
              ))}
            </div>
          </div>

          {/* Threads */}
          <div className="divide-y divide-border/50">
            {filteredThreads.map((thread) => {
              const ChannelIcon = channelIcons[thread.channel];
              return (
                <motion.div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedThread?.id === thread.id
                      ? "bg-foreground/5"
                      : "hover:bg-foreground/5"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{thread.contactName}</span>
                        <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[thread.status]}`}>
                          {statusLabels[thread.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Thread view */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedThread.contactName}</p>
                    <p className="text-xs text-muted-foreground">{selectedThread.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutopilot(!isAutopilot)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isAutopilot
                        ? "bg-secondary/20 text-secondary border border-secondary/30"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {isAutopilot ? "Return to Autopilot" : "Take Over"}
                  </button>
                </div>
              </div>

              {/* Escalation banner */}
              {selectedThread.needsHuman && (
                <div className="p-3 bg-primary/10 border-b border-primary/20 flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <p className="text-sm text-foreground">Sensitive situation detected. Review recommended.</p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.from === "customer" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.from === "customer"
                        ? "bg-foreground/5 rounded-2xl rounded-tl-sm"
                        : "bg-primary/20 rounded-2xl rounded-tr-sm"
                    }`}>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {message.from === "customer" ? (
                            <User className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Bot className="h-3 w-3 text-primary" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {message.from === "customer" ? selectedThread.contactName : "SITA"} · {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reply area */}
              <div className="p-4 border-t border-border/50 space-y-3">
                {/* AI suggestion */}
                {selectedThread.suggestedReply && (
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      <span className="text-xs text-secondary font-medium">AI Suggested Reply</span>
                    </div>
                    <p className="text-sm text-foreground mb-3">{selectedThread.suggestedReply}</p>
                    <button
                      onClick={handleUseDraft}
                      className="text-xs text-secondary flex items-center gap-1"
                    >
                      Use draft <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Tone selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Make it:</span>
                  {(["calm", "direct", "warm", "firm"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        tone === t
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 rounded-xl bg-foreground/5 border border-border/50 focus:border-primary/50 outline-none text-sm"
                  />
                  <button className="p-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors">
                    <Send className="h-5 w-5 text-primary" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Select a conversation to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
