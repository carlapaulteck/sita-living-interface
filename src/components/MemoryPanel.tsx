import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  X, 
  Trash2, 
  Edit2, 
  Check, 
  Plus,
  Heart,
  Target,
  Shield,
  Lightbulb,
  Users,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { GlassCard } from "./GlassCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { useConversationMemory, ContextType, ConversationContext } from "@/hooks/useConversationMemory";
import { toast } from "sonner";

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTEXT_ICONS: Record<ContextType, React.ReactNode> = {
  preference: <Heart className="h-4 w-4" />,
  fact: <Lightbulb className="h-4 w-4" />,
  goal: <Target className="h-4 w-4" />,
  boundary: <Shield className="h-4 w-4" />,
  pattern: <Sparkles className="h-4 w-4" />,
  relationship: <Users className="h-4 w-4" />,
};

const CONTEXT_COLORS: Record<ContextType, string> = {
  preference: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  fact: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  goal: "bg-green-500/20 text-green-400 border-green-500/30",
  boundary: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pattern: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  relationship: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const CONTEXT_LABELS: Record<ContextType, string> = {
  preference: "Preferences",
  fact: "Facts",
  goal: "Goals",
  boundary: "Boundaries",
  pattern: "Patterns",
  relationship: "Relationships",
};

export function MemoryPanel({ isOpen, onClose }: MemoryPanelProps) {
  const { contexts, isLoading, addContext, removeContext, updateContext } = useConversationMemory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<ContextType>("preference");
  const [newContent, setNewContent] = useState("");
  const [filterType, setFilterType] = useState<ContextType | "all">("all");

  const filteredContexts = filterType === "all" 
    ? contexts 
    : contexts.filter(ctx => ctx.context_type === filterType);

  const groupedContexts = filteredContexts.reduce((acc, ctx) => {
    const type = ctx.context_type as ContextType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(ctx);
    return acc;
  }, {} as Record<ContextType, ConversationContext[]>);

  const handleDelete = async (id: string) => {
    await removeContext(id);
    toast.success("Memory deleted");
  };

  const handleUpdate = async (id: string, content: string) => {
    await updateContext(id, content);
    setEditingId(null);
    setEditContent("");
    toast.success("Memory updated");
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    await addContext(newType, newContent.trim(), 1.0);
    setNewContent("");
    setShowAddForm(false);
    toast.success("Memory added");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-background/95 backdrop-blur-xl border-l border-border"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Memory Bank</h2>
                  <p className="text-xs text-muted-foreground">
                    {contexts.length} memories stored
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Filter & Add */}
            <div className="flex gap-2 mt-4">
              <Select value={filterType} onValueChange={(v) => setFilterType(v as ContextType | "all")}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {(Object.keys(CONTEXT_LABELS) as ContextType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {CONTEXT_ICONS[type]}
                        {CONTEXT_LABELS[type]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-border overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <Select value={newType} onValueChange={(v) => setNewType(v as ContextType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CONTEXT_LABELS) as ContextType[]).map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {CONTEXT_ICONS[type]}
                            {CONTEXT_LABELS[type]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter memory content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={handleAdd}
                      disabled={!newContent.trim()}
                    >
                      Add Memory
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : contexts.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-2">No memories yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with SITA to build your memory bank, or add memories manually.
                  </p>
                  <Button variant="outline" onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Memory
                  </Button>
                </div>
              ) : (
                Object.entries(groupedContexts).map(([type, items]) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${CONTEXT_COLORS[type as ContextType]}`}>
                        {CONTEXT_ICONS[type as ContextType]}
                      </div>
                      <h3 className="font-medium text-sm">
                        {CONTEXT_LABELS[type as ContextType]}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {items.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map((ctx) => (
                        <motion.div
                          key={ctx.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <GlassCard className="p-3" hover={false}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                {editingId === ctx.id ? (
                                  <div className="flex gap-2">
                                    <Input
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="text-sm"
                                      onKeyDown={(e) => e.key === "Enter" && handleUpdate(ctx.id, editContent)}
                                    />
                                    <Button 
                                      size="icon" 
                                      variant="ghost"
                                      onClick={() => handleUpdate(ctx.id, editContent)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm">{ctx.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="h-1.5 w-16 bg-foreground/10 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary rounded-full"
                                          style={{ width: `${(ctx.confidence || 0.7) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round((ctx.confidence || 0.7) * 100)}% confidence
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingId(ctx.id);
                                    setEditContent(ctx.content);
                                  }}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(ctx.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Memories personalize SITA's responses to you.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}