import { GlassCard } from "./GlassCard";
import { Check, MoreHorizontal } from "lucide-react";

interface Device {
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

const devices: Device[] = [
  { 
    name: "Oura", 
    icon: (
      <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
        <span className="text-lg">○</span>
      </div>
    ),
    connected: true 
  },
  { 
    name: "Meta", 
    icon: (
      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
        <span className="text-blue-400 font-bold text-sm">∞</span>
      </div>
    ),
    connected: true 
  },
  { 
    name: "Apple Health", 
    icon: (
      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
        <span className="text-red-400">❤</span>
      </div>
    ),
    connected: true 
  },
  { 
    name: "Smart Home", 
    icon: (
      <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
        <span className="text-lg">🏠</span>
      </div>
    ),
    connected: true 
  },
];

export function DeviceIntegration() {
  return (
    <GlassCard className="p-4 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Device Integration</h3>
        <button className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="space-y-3">
        {devices.map((device, index) => (
          <div 
            key={device.name}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {device.icon}
              <span className="text-sm text-foreground">{device.name}</span>
            </div>
            {device.connected && (
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="text-xs">Connected</span>
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
