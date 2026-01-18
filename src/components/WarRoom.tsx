import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { MetricRing } from "./MetricRing";
import { 
  X, 
  Maximize2,
  TrendingUp,
  Users,
  ShoppingCart,
  Mail,
  Zap,
  Target,
  DollarSign,
  Activity,
  AlertCircle,
  Shield,
  Radio,
  Layers
} from "lucide-react";

interface WarRoomNode {
  id: string;
  label: string;
  type: "funnel" | "brand" | "stream" | "channel" | "core";
  health: "healthy" | "watch" | "attention";
  metrics: {
    label: string;
    value: string;
  }[];
  x: number;
  y: number;
  z?: number; // Depth layer for 2.5D effect
  pulseIntensity?: number; // 0-1 for activity level
}

interface WarRoomProps {
  isOpen: boolean;
  onClose: () => void;
}

const nodes: WarRoomNode[] = [
  {
    id: "traffic",
    label: "Traffic Sources",
    type: "channel",
    health: "healthy",
    metrics: [
      { label: "Sessions", value: "12.4K" },
      { label: "Cost", value: "$840" }
    ],
    x: 12,
    y: 25,
    z: 0,
    pulseIntensity: 0.8
  },
  {
    id: "leads",
    label: "Lead Capture",
    type: "funnel",
    health: "healthy",
    metrics: [
      { label: "Captured", value: "312" },
      { label: "Rate", value: "4.2%" }
    ],
    x: 28,
    y: 38,
    z: 1,
    pulseIntensity: 0.9
  },
  {
    id: "core",
    label: "SITA Core",
    type: "core",
    health: "healthy",
    metrics: [
      { label: "Autonomy", value: "84%" },
      { label: "Actions", value: "1.2K/day" }
    ],
    x: 50,
    y: 50,
    z: 2,
    pulseIntensity: 1.0
  },
  {
    id: "nurture",
    label: "Nurture Engine",
    type: "funnel",
    health: "watch",
    metrics: [
      { label: "Active", value: "89" },
      { label: "Engaged", value: "67%" }
    ],
    x: 45,
    y: 25,
    z: 1,
    pulseIntensity: 0.6
  },
  {
    id: "sales",
    label: "Sales Pipeline",
    type: "funnel",
    health: "healthy",
    metrics: [
      { label: "Deals", value: "24" },
      { label: "Value", value: "$48K" }
    ],
    x: 72,
    y: 35,
    z: 1,
    pulseIntensity: 0.85
  },
  {
    id: "brand-a",
    label: "Brand Alpha",
    type: "brand",
    health: "healthy",
    metrics: [
      { label: "Revenue", value: "$8.2K" },
      { label: "Growth", value: "+24%" }
    ],
    x: 22,
    y: 68,
    z: 0,
    pulseIntensity: 0.75
  },
  {
    id: "brand-b",
    label: "Brand Beta",
    type: "brand",
    health: "healthy",
    metrics: [
      { label: "Revenue", value: "$3.1K" },
      { label: "Growth", value: "+8%" }
    ],
    x: 50,
    y: 75,
    z: 0,
    pulseIntensity: 0.5
  },
  {
    id: "revenue",
    label: "Revenue Stream",
    type: "stream",
    health: "healthy",
    metrics: [
      { label: "MRR", value: "$12.8K" },
      { label: "Churn", value: "2.1%" }
    ],
    x: 82,
    y: 62,
    z: 0,
    pulseIntensity: 0.95
  }
];

const connections = [
  { from: "traffic", to: "leads", strength: 0.9 },
  { from: "leads", to: "core", strength: 1.0 },
  { from: "core", to: "nurture", strength: 0.7 },
  { from: "core", to: "sales", strength: 0.85 },
  { from: "nurture", to: "sales", strength: 0.6 },
  { from: "sales", to: "revenue", strength: 0.9 },
  { from: "brand-a", to: "core", strength: 0.8 },
  { from: "brand-b", to: "core", strength: 0.6 },
  { from: "core", to: "revenue", strength: 1.0 }
];

function getNodeIcon(type: WarRoomNode["type"]) {
  switch (type) {
    case "funnel": return Target;
    case "brand": return ShoppingCart;
    case "stream": return DollarSign;
    case "channel": return Users;
    case "core": return Layers;
    default: return Activity;
  }
}

function getHealthColor(health: WarRoomNode["health"]) {
  switch (health) {
    case "healthy": return "bg-secondary/30 border-secondary/50";
    case "watch": return "bg-primary/30 border-primary/50";
    case "attention": return "bg-destructive/30 border-destructive/50";
  }
}

function getHealthGlow(health: WarRoomNode["health"], intensity: number = 1) {
  const opacity = 0.3 * intensity;
  switch (health) {
    case "healthy": return `shadow-[0_0_${20 + intensity * 20}px_rgba(76,224,224,${opacity})]`;
    case "watch": return `shadow-[0_0_${20 + intensity * 20}px_rgba(232,194,123,${opacity})]`;
    case "attention": return `shadow-[0_0_${20 + intensity * 20}px_rgba(239,68,68,${opacity})]`;
  }
}

export function WarRoom({ isOpen, onClose }: WarRoomProps) {
  const [selectedNode, setSelectedNode] = useState<WarRoomNode | null>(null);
  const [autonomyLevel, setAutonomyLevel] = useState(84);
  const [blastRadius, setBlastRadius] = useState<"contained" | "expanding" | "critical">("contained");

  // Simulate live updates
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setAutonomyLevel(prev => Math.min(100, Math.max(60, prev + (Math.random() - 0.5) * 2)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-hidden"
    >
      {/* Depth layers background */}
      <div className="absolute inset-0">
        {/* Far layer */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, hsl(var(--secondary) / 0.1) 0%, transparent 40%)
              `
            }}
          />
        </div>
        
        {/* Grid with perspective */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(30deg)',
            transformOrigin: 'center 120%'
          }}
        />
        
        {/* Ambient particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-background via-background/80 to-transparent pb-8">
        <div>
          <h2 className="text-xl font-display font-medium text-foreground">War Room</h2>
          <p className="text-sm text-muted-foreground">A live map of the system.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <span className="text-xs text-muted-foreground">Watch</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-destructive"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
              <span className="text-xs text-muted-foreground">Attention</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Global Autonomy Panel */}
      <div className="absolute top-24 left-4 z-10">
        <GlassCard className="p-5 backdrop-blur-xl">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Global Autonomy</p>
              <MetricRing
                label=""
                value={`${Math.round(autonomyLevel)}%`}
                percentage={autonomyLevel}
                color="cyan"
                size={80}
              />
            </div>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Blast Radius</p>
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${
                  blastRadius === "contained" ? "text-secondary" :
                  blastRadius === "expanding" ? "text-primary" : "text-destructive"
                }`} />
                <span className={`text-sm font-medium ${
                  blastRadius === "contained" ? "text-secondary" :
                  blastRadius === "expanding" ? "text-primary" : "text-destructive"
                }`}>
                  {blastRadius === "contained" ? "Contained" :
                   blastRadius === "expanding" ? "Expanding" : "Critical"}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">System Load</p>
              <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">62% capacity</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Live Activity Indicator */}
      <div className="absolute top-24 right-4 z-10">
        <GlassCard className="p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Radio className="h-5 w-5 text-secondary" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-foreground">Live</p>
              <p className="text-xs text-muted-foreground">1.2K actions/day</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main map area */}
      <div className="w-full h-full pt-20 relative overflow-hidden">
        {/* Connection lines with data flow animation */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={i}>
                {/* Base line */}
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: conn.strength * 0.4 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth={1 + conn.strength * 2}
                  filter="url(#glow)"
                />
                
                {/* Animated data flow particles */}
                <motion.circle
                  r="3"
                  fill="hsl(var(--secondary))"
                  filter="url(#glow)"
                  animate={{
                    cx: [`${fromNode.x}%`, `${toNode.x}%`],
                    cy: [`${fromNode.y}%`, `${toNode.y}%`],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "linear"
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes with 2.5D depth */}
        {nodes.map((node, i) => {
          const Icon = getNodeIcon(node.type);
          const isCore = node.type === "core";
          const scale = 1 + (node.z || 0) * 0.15; // Larger for closer nodes
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              className="absolute cursor-pointer"
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                zIndex: 2 + (node.z || 0) * 10
              }}
              onClick={() => setSelectedNode(node)}
              whileHover={{ scale: scale * 1.1 }}
            >
              {/* Outer pulse ring */}
              <motion.div
                className={`absolute -inset-4 rounded-3xl ${
                  node.health === "healthy" ? "bg-secondary/10" :
                  node.health === "watch" ? "bg-primary/10" : "bg-destructive/10"
                }`}
                animate={{ 
                  opacity: [0.3, 0, 0.3],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 2 / (node.pulseIntensity || 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Node body */}
              <div 
                className={`relative p-4 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300
                  ${getHealthColor(node.health)}
                  ${isCore ? 'p-6' : ''}
                `}
                style={{
                  boxShadow: `
                    0 0 ${20 + (node.pulseIntensity || 0.5) * 30}px ${
                      node.health === "healthy" ? "rgba(76,224,224,0.3)" :
                      node.health === "watch" ? "rgba(232,194,123,0.3)" : "rgba(239,68,68,0.3)"
                    },
                    inset 0 1px 1px rgba(255,255,255,0.1)
                  `
                }}
              >
                {/* Activity indicator */}
                {node.pulseIntensity && node.pulseIntensity > 0.7 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                
                <Icon className={`h-6 w-6 text-foreground mb-2 ${isCore ? 'h-8 w-8' : ''}`} />
                <p className={`text-sm font-medium text-foreground whitespace-nowrap ${isCore ? 'text-base' : ''}`}>
                  {node.label}
                </p>
                
                {/* Mini metrics for core */}
                {isCore && (
                  <div className="mt-2 pt-2 border-t border-foreground/10">
                    <p className="text-xs text-secondary font-medium">84% Autonomy</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Node detail drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            className="absolute top-24 right-4 bottom-4 w-80 z-20"
          >
            <GlassCard className="h-full p-6 backdrop-blur-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">{selectedNode.label}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg hover:bg-foreground/5"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                selectedNode.health === "healthy" 
                  ? "bg-secondary/20 text-secondary" 
                  : selectedNode.health === "watch"
                  ? "bg-primary/20 text-primary"
                  : "bg-destructive/20 text-destructive"
              }`}>
                <motion.div 
                  className={`w-2 h-2 rounded-full ${
                    selectedNode.health === "healthy" ? "bg-secondary" :
                    selectedNode.health === "watch" ? "bg-primary" : "bg-destructive"
                  }`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {selectedNode.health === "healthy" ? "Healthy" : 
                 selectedNode.health === "watch" ? "Watch" : "Needs Attention"}
              </div>

              {/* Pulse Intensity */}
              <div className="mb-6 p-4 rounded-xl bg-foreground/5">
                <p className="text-xs text-muted-foreground mb-2">Activity Level</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(selectedNode.pulseIntensity || 0.5) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round((selectedNode.pulseIntensity || 0.5) * 100)}%
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {selectedNode.metrics.map((metric, i) => (
                  <motion.div 
                    key={i} 
                    className="p-4 rounded-xl bg-foreground/5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3">Quick Actions</p>
                <div className="space-y-2">
                  <button className="w-full p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-left flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    View detailed metrics
                  </button>
                  <button className="w-full p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-left flex items-center gap-2">
                    <Zap className="h-4 w-4 text-secondary" />
                    Adjust settings
                  </button>
                  {selectedNode.health !== "healthy" && (
                    <button className="w-full p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-sm text-left text-primary flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      View recommendations
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}