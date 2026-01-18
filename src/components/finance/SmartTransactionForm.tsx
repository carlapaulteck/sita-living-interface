import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Upload, Sparkles, X, Check, 
  RefreshCw, Receipt, Wand2, ArrowRight,
  DollarSign, Tag, Calendar, FileText
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinance } from "@/hooks/useFinance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "Housing", icon: "🏠", color: "from-purple-500/20 to-purple-600/10" },
  { value: "Food & Dining", icon: "🍽️", color: "from-orange-500/20 to-orange-600/10" },
  { value: "Transportation", icon: "🚗", color: "from-blue-500/20 to-blue-600/10" },
  { value: "Entertainment", icon: "🎬", color: "from-pink-500/20 to-pink-600/10" },
  { value: "Utilities", icon: "💡", color: "from-yellow-500/20 to-yellow-600/10" },
  { value: "Healthcare", icon: "🏥", color: "from-red-500/20 to-red-600/10" },
  { value: "Shopping", icon: "🛍️", color: "from-cyan-500/20 to-cyan-600/10" },
  { value: "Income", icon: "💰", color: "from-emerald-500/20 to-emerald-600/10" },
  { value: "Other", icon: "📦", color: "from-gray-500/20 to-gray-600/10" },
];

interface SmartTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmartTransactionForm({ open, onOpenChange }: SmartTransactionFormProps) {
  const { addTransaction } = useFinance();
  const [mode, setMode] = useState<"manual" | "smart" | "scan">("manual");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [smartInput, setSmartInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // AI-powered smart categorization
  const analyzeWithAI = async (input: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are a financial transaction parser. Extract transaction details from user input and return ONLY a JSON object with these fields:
              - name: merchant/description (string)
              - amount: number (negative for expenses, positive for income)
              - category: one of [Housing, Food & Dining, Transportation, Entertainment, Utilities, Healthcare, Shopping, Income, Other]
              - description: brief note (string)
              
              Return ONLY valid JSON, no other text.`
            },
            {
              role: "user",
              content: input
            }
          ]
        }
      });

      if (data?.response) {
        try {
          // Try to parse the JSON from the response
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setFormData({
              name: parsed.name || "",
              amount: String(parsed.amount || ""),
              category: parsed.category || "Other",
              description: parsed.description || "",
              date: new Date().toISOString().split("T")[0],
            });
            setAnalysisComplete(true);
            toast.success("Transaction parsed successfully!");
          }
        } catch (parseError) {
          console.error("Parse error:", parseError);
          toast.error("Could not parse transaction. Please enter manually.");
        }
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Analysis failed. Please enter details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle receipt image (simulated - would need OCR integration)
  const handleReceiptUpload = async (file: File) => {
    setIsAnalyzing(true);
    toast.info("Analyzing receipt...");
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock result - in production, this would use an OCR service
    setFormData({
      name: "Receipt Upload",
      amount: "-45.99",
      category: "Shopping",
      description: "Scanned receipt",
      date: new Date().toISOString().split("T")[0],
    });
    
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    toast.success("Receipt analyzed!");
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleReceiptUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    await addTransaction({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description || null,
      transaction_date: formData.date,
      is_recurring: false,
    });

    // Reset form
    setFormData({ name: "", amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0] });
    setSmartInput("");
    setAnalysisComplete(false);
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({ name: "", amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0] });
    setSmartInput("");
    setAnalysisComplete(false);
    setMode("manual");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted/20 rounded-xl">
          {[
            { id: "manual", icon: FileText, label: "Manual" },
            { id: "smart", icon: Wand2, label: "Smart AI" },
            { id: "scan", icon: Camera, label: "Scan" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id as typeof mode); resetForm(); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                mode === m.id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <m.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Smart AI Mode */}
          {mode === "smart" && (
            <motion.div
              key="smart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="relative">
                <Textarea
                  placeholder="Describe your transaction naturally, e.g., 'Spent $45 on groceries at Whole Foods' or 'Got paid $5000 salary'"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  className="min-h-24 bg-muted/20 border-white/10 focus:border-primary/50 resize-none"
                />
                <Button
                  onClick={() => analyzeWithAI(smartInput)}
                  disabled={!smartInput || isAnalyzing}
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="sm"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Analysis Complete</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="text-foreground font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className={`font-medium ${parseFloat(formData.amount) >= 0 ? "text-emerald-400" : "text-foreground"}`}>
                        ${Math.abs(parseFloat(formData.amount || "0")).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="text-foreground font-medium">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="text-foreground font-medium">{formData.description || "-"}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Scan Mode */}
          {mode === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="p-4 rounded-full bg-primary/20"
                    >
                      <RefreshCw className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-foreground font-medium">Analyzing receipt...</p>
                    <p className="text-sm text-muted-foreground">Using AI to extract transaction details</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-muted/20 mx-auto w-fit mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Upload Receipt</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop or click to upload
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleReceiptUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="pointer-events-none">
                      <Camera className="h-4 w-4 mr-2" />
                      Select Image
                    </Button>
                  </>
                )}
              </div>

              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Receipt Scanned</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Review and edit the extracted details below</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Manual Mode / Edit Form */}
          {(mode === "manual" || analysisComplete) && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Transaction Name */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Transaction Name
                </label>
                <Input
                  placeholder="e.g., Whole Foods Market"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-muted/20 border-white/10 focus:border-primary/50"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="-45.99"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-muted/20 border-white/10 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Negative for expenses</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-muted/20 border-white/10 focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`p-2 rounded-lg text-left transition-all ${
                        formData.category === cat.value
                          ? `bg-gradient-to-r ${cat.color} border border-white/20`
                          : "bg-muted/10 border border-transparent hover:bg-muted/20"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <p className="text-xs text-foreground mt-1">{cat.value}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Description (optional)</label>
                <Input
                  placeholder="Add a note..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-muted/20 border-white/10 focus:border-primary/50"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.amount || !formData.category}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Add Transaction
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
