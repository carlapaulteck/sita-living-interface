import { useState, useEffect, useRef } from "react";
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
  Layers,
  Cpu,
  Network,
  Eye,
  Settings,
  BarChart3,
  Globe
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
  z: number;
  pulseIntensity: number;
  connections: string[];
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
    x: 15,
    y: 28,
    z: 0,
    pulseIntensity: 0.8,
    connections: ["leads"]
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
    x: 32,
    y: 42,
    z: 1,
    pulseIntensity: 0.9,
    connections: ["core"]
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
    z: 3,
    pulseIntensity: 1.0,
    connections: ["nurture", "sales", "revenue"]
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
    x: 42,
    y: 25,
    z: 1,
    pulseIntensity: 0.6,
    connections: ["sales"]
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
    y: 38,
    z: 2,
    pulseIntensity: 0.85,
    connections: ["revenue"]
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
    x: 25,
    y: 70,
    z: 0,
    pulseIntensity: 0.75,
    connections: ["core"]
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
    x: 55,
    y: 78,
    z: 0,
    pulseIntensity: 0.5,
    connections: ["core"]
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
    y: 58,
    z: 1,
    pulseIntensity: 0.95,
    connections: []
  }
];

function getNodeIcon(type: WarRoomNode["type"]) {
  switch (type) {
    case "funnel": return Target;
    case "brand": return ShoppingCart;
    case "stream": return DollarSign;
    case "channel": return Globe;
    case "core": return Cpu;
    default: return Activity;
  }
}

function getHealthColors(health: WarRoomNode["health"]) {
  switch (health) {
    case "healthy": return {
      bg: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/50",
      glow: "shadow-emerald-500/30",
      text: "text-emerald-400",
      pulse: "bg-emerald-500"
    };
    case "watch": return {
      bg: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/50",
      glow: "shadow-amber-500/30",
      text: "text-amber-400",
      pulse: "bg-amber-500"
    };
    case "attention": return {
      bg: "from-red-500/20 to-rose-500/20",
      border: "border-red-500/50",
      glow: "shadow-red-500/30",
      text: "text-red-400",
      pulse: "bg-red-500"
    };
  }
}

export function WarRoom({ isOpen, onClose }: WarRoomProps) {
  const [selectedNode, setSelectedNode] = useState<WarRoomNode | null>(null);
  const [autonomyLevel, setAutonomyLevel] = useState(84);
  const [systemLoad, setSystemLoad] = useState(62);
  const [activeConnections, setActiveConnections] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Simulate live updates
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setAutonomyLevel(prev => Math.min(100, Math.max(70, prev + (Math.random() - 0.5) * 3)));
      setSystemLoad(prev => Math.min(85, Math.max(45, prev + (Math.random() - 0.5) * 4)));
      setActiveConnections(prev => (prev + 1) % nodes.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate all connection lines
  const allConnections: { from: WarRoomNode; to: WarRoomNode }[] = [];
  nodes.forEach(node => {
    node.connections.forEach(targetId => {
      const target = nodes.find(n => n.id === targetId);
      if (target) {
        allConnections.push({ from: node, to: target });
      }
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-hidden"
    >
      {/* Immersive depth background */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(var(--secondary) / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(var(--accent) / 0.05) 0%, transparent 60%)
            `
          }}
        />
        
        {/* 3D perspective grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(800px) rotateX(45deg) scale(2.5)',
            transformOrigin: 'center 150%'
          }}
        />
        
        {/* Floating orbs for depth */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, hsl(var(--${i % 2 === 0 ? 'primary' : 'secondary'}) / 0.05) 0%, transparent 70%)`,
              filter: 'blur(40px)'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Animated star particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <motion.div 
            className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Network className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">War Room</h2>
            <p className="text-sm text-muted-foreground">Live system topology</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            {["healthy", "watch", "attention"].map((health) => {
              const colors = getHealthColors(health as any);
              return (
                <div key={health} className="flex items-center gap-2">
                  <motion.div 
                    className={`w-2.5 h-2.5 rounded-full ${colors.pulse}`}
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{health}</span>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-foreground/5 border border-border/50 hover:bg-foreground/10 transition-all duration-200 hover:scale-105"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Global Autonomy Panel - Left */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-28 left-6 z-20"
      >
        <GlassCard className="p-6 backdrop-blur-xl border border-primary/20">
          <div className="space-y-6">
            {/* Autonomy Ring */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-2">
                <Cpu className="h-3 w-3" />
                GLOBAL AUTONOMY
              </p>
              <motion.div className="relative">
                <MetricRing
                  label=""
                  value={`${Math.round(autonomyLevel)}%`}
                  percentage={autonomyLevel}
                  color="cyan"
                  size={100}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-secondary/20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
            
            {/* System Status */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">System Load</p>
                <span className={`text-xs font-medium ${systemLoad > 70 ? 'text-amber-400' : 'text-secondary'}`}>
                  {systemLoad}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${systemLoad > 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-secondary to-primary'}`}
                  animate={{ width: `${systemLoad}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Active Flows */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Active Flows</p>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-secondary"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-foreground">{allConnections.length}</span>
                </div>
              </div>
            </div>

            {/* Emergency Override */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Emergency Stop</span>
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Live Activity Panel - Right */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-28 right-6 z-20"
      >
        <GlassCard className="p-5 backdrop-blur-xl border border-secondary/20">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Radio className="h-5 w-5 text-secondary" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-foreground">Live Activity</p>
              <p className="text-xs text-muted-foreground">Real-time data flow</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Actions/day</span>
              <span className="text-secondary font-medium">1.2K</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Avg latency</span>
              <span className="text-foreground">45ms</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Success rate</span>
              <span className="text-emerald-400 font-medium">99.2%</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main map area */}
      <div className="w-full h-full pt-24 relative overflow-hidden">
        {/* Connection lines with animated data flow */}
        <svg 
          ref={svgRef}
          className="absolute inset-0 w-full h-full" 
          style={{ zIndex: 5 }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
            </linearGradient>
            <filter id="connectionGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {allConnections.map((conn, i) => (
            <g key={`${conn.from.id}-${conn.to.id}`}>
              {/* Base line */}
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                x1={`${conn.from.x}%`}
                y1={`${conn.from.y}%`}
                x2={`${conn.to.x}%`}
                y2={`${conn.to.y}%`}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                filter="url(#connectionGlow)"
                strokeDasharray="8 4"
              />
              
              {/* Animated data packet */}
              <motion.circle
                r="4"
                fill="hsl(var(--secondary))"
                filter="url(#connectionGlow)"
                animate={{
                  cx: [`${conn.from.x}%`, `${conn.to.x}%`],
                  cy: [`${conn.from.y}%`, `${conn.to.y}%`],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
              />
              
              {/* Secondary data packet */}
              <motion.circle
                r="3"
                fill="hsl(var(--primary))"
                animate={{
                  cx: [`${conn.from.x}%`, `${conn.to.x}%`],
                  cy: [`${conn.from.y}%`, `${conn.to.y}%`],
                  opacity: [0, 0.8, 0.8, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8 + 1.2,
                  ease: "easeInOut"
                }}
              />
            </g>
          ))}
        </svg>

        {/* Nodes with 2.5D depth effect */}
        {nodes.map((node, i) => {
          const Icon = getNodeIcon(node.type);
          const colors = getHealthColors(node.health);
          const isCore = node.type === "core";
          const depthScale = 1 + node.z * 0.12;
          const depthBlur = Math.max(0, 2 - node.z);
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
              className="absolute cursor-pointer"
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${depthScale})`,
                zIndex: 10 + node.z * 5,
                filter: depthBlur > 0 ? `blur(${depthBlur * 0.3}px)` : 'none'
              }}
              onClick={() => setSelectedNode(node)}
              whileHover={{ scale: depthScale * 1.1, zIndex: 50 }}
            >
              {/* Outer pulse rings */}
              <motion.div
                className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${colors.bg}`}
                animate={{ 
                  opacity: [0.2, 0, 0.2],
                  scale: [1, 1.4, 1]
                }}
                transition={{ 
                  duration: 3 / node.pulseIntensity,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className={`absolute -inset-3 rounded-2xl ${colors.border} border`}
                animate={{ 
                  opacity: [0.5, 0.2, 0.5],
                  scale: [1, 1.15, 1]
                }}
                transition={{ 
                  duration: 2 / node.pulseIntensity,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              {/* Node body */}
              <div 
                className={`relative p-5 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300
                  bg-gradient-to-br ${colors.bg} ${colors.border}
                  ${isCore ? 'p-7' : ''}
                `}
                style={{
                  boxShadow: `
                    0 0 ${30 + node.pulseIntensity * 40}px ${colors.glow.replace('shadow-', '').replace('/30', '')},
                    inset 0 1px 1px rgba(255,255,255,0.1),
                    0 10px 40px rgba(0,0,0,0.3)
                  `
                }}
              >
                {/* Activity indicator */}
                {node.pulseIntensity > 0.7 && (
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${colors.pulse}`}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
                
                <Icon className={`h-6 w-6 ${colors.text} mb-2 ${isCore ? 'h-8 w-8' : ''}`} />
                <p className={`text-sm font-medium text-foreground whitespace-nowrap ${isCore ? 'text-base' : ''}`}>
                  {node.label}
                </p>
                
                {/* Core-specific extras */}
                {isCore && (
                  <div className="mt-3 pt-3 border-t border-foreground/10">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-secondary"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <p className="text-xs text-secondary font-medium">84% Autonomy</p>
                    </div>
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
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-28 right-6 bottom-6 w-96 z-30"
          >
            <GlassCard className="h-full p-6 backdrop-blur-xl overflow-y-auto border border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-medium text-foreground">{selectedNode.label}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Health badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                getHealthColors(selectedNode.health).bg
              } border ${getHealthColors(selectedNode.health).border}`}>
                <motion.div 
                  className={`w-2 h-2 rounded-full ${getHealthColors(selectedNode.health).pulse}`}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={getHealthColors(selectedNode.health).text}>
                  {selectedNode.health === "healthy" ? "Healthy" : 
                   selectedNode.health === "watch" ? "Watching" : "Needs Attention"}
                </span>
              </div>

              {/* Activity Level */}
              <div className="mb-6 p-5 rounded-2xl bg-foreground/5 border border-foreground/10">
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  ACTIVITY LEVEL
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${selectedNode.pulseIntensity * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    {Math.round(selectedNode.pulseIntensity * 100)}%
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4 mb-6">
                {selectedNode.metrics.map((metric, i) => (
                  <motion.div 
                    key={i} 
                    className="p-5 rounded-2xl bg-foreground/5 border border-foreground/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-3xl font-display font-bold text-foreground">{metric.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  QUICK ACTIONS
                </p>
                <div className="space-y-2">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-left flex items-center gap-3"
                  >
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">View Analytics</p>
                      <p className="text-xs text-muted-foreground">Detailed performance</p>
                    </div>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-left flex items-center gap-3"
                  >
                    <Settings className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Configure</p>
                      <p className="text-xs text-muted-foreground">Adjust settings</p>
                    </div>
                  </motion.button>
                  {selectedNode.health !== "healthy" && (
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-200 text-left flex items-center gap-3"
                    >
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-primary">View Recommendations</p>
                        <p className="text-xs text-primary/70">AI-suggested fixes</p>
                      </div>
                    </motion.button>
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
