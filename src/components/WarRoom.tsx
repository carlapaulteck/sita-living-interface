import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
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
  Activity
} from "lucide-react";

interface WarRoomNode {
  id: string;
  label: string;
  type: "funnel" | "brand" | "stream" | "channel";
  health: "healthy" | "watch" | "attention";
  metrics: {
    label: string;
    value: string;
  }[];
  x: number;
  y: number;
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
    x: 10,
    y: 20
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
    x: 30,
    y: 35
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
    x: 50,
    y: 20
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
    x: 70,
    y: 40
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
    x: 20,
    y: 65
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
    y: 70
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
    x: 80,
    y: 65
  }
];

const connections = [
  { from: "traffic", to: "leads" },
  { from: "leads", to: "nurture" },
  { from: "nurture", to: "sales" },
  { from: "sales", to: "revenue" },
  { from: "brand-a", to: "revenue" },
  { from: "brand-b", to: "revenue" }
];

function getNodeIcon(type: WarRoomNode["type"]) {
  switch (type) {
    case "funnel": return Target;
    case "brand": return ShoppingCart;
    case "stream": return DollarSign;
    case "channel": return Users;
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

function getHealthGlow(health: WarRoomNode["health"]) {
  switch (health) {
    case "healthy": return "shadow-[0_0_20px_rgba(76,224,224,0.3)]";
    case "watch": return "shadow-[0_0_20px_rgba(232,194,123,0.3)]";
    case "attention": return "shadow-[0_0_20px_rgba(239,68,68,0.3)]";
  }
}

export function WarRoom({ isOpen, onClose }: WarRoomProps) {
  const [selectedNode, setSelectedNode] = useState<WarRoomNode | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-display font-medium text-foreground">War Room</h2>
          <p className="text-sm text-muted-foreground">A live map of the system.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Watch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
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

      {/* Global indicators */}
      <div className="absolute top-20 left-4 z-10">
        <GlassCard className="p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Autonomy</p>
              <p className="text-lg font-semibold text-secondary">84%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Blast Radius</p>
              <p className="text-lg font-semibold text-secondary">Contained</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main map area */}
      <div className="w-full h-full pt-20 relative overflow-hidden">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1, delay: i * 0.1 }}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          })}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const Icon = getNodeIcon(node.type);
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              className="absolute cursor-pointer"
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }}
              onClick={() => setSelectedNode(node)}
            >
              <div 
                className={`p-4 rounded-2xl border-2 ${getHealthColor(node.health)} ${getHealthGlow(node.health)} backdrop-blur-sm transition-all duration-300 hover:scale-110`}
              >
                <Icon className="h-6 w-6 text-foreground mb-2" />
                <p className="text-sm font-medium text-foreground whitespace-nowrap">{node.label}</p>
                
                {/* Pulse animation for healthy nodes */}
                {node.health === "healthy" && (
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-secondary/20"
                    animate={{ 
                      opacity: [0.5, 0, 0.5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Node detail drawer */}
      {selectedNode && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute top-20 right-4 bottom-4 w-80 z-20"
        >
          <GlassCard className="h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">{selectedNode.label}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg hover:bg-foreground/5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 ${
              selectedNode.health === "healthy" 
                ? "bg-secondary/20 text-secondary" 
                : selectedNode.health === "watch"
                ? "bg-primary/20 text-primary"
                : "bg-destructive/20 text-destructive"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                selectedNode.health === "healthy" ? "bg-secondary" :
                selectedNode.health === "watch" ? "bg-primary" : "bg-destructive"
              }`} />
              {selectedNode.health === "healthy" ? "Healthy" : 
               selectedNode.health === "watch" ? "Watch" : "Needs Attention"}
            </div>

            <div className="space-y-4">
              {selectedNode.metrics.map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-foreground/5">
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-left">
                  View detailed metrics
                </button>
                <button className="w-full p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-left">
                  Adjust settings
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
