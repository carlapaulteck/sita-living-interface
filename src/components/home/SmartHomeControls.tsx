import { motion } from "framer-motion";
import { Lightbulb, Thermometer, Lock, Tv, Fan, Speaker } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface SmartDevice {
  id: string;
  name: string;
  room: string;
  icon: typeof Lightbulb;
  type: "switch" | "slider" | "status";
  value: boolean | number;
  status?: string;
}

const DEVICES: SmartDevice[] = [
  { id: "1", name: "Living Room Lights", room: "Living Room", icon: Lightbulb, type: "slider", value: 75 },
  { id: "2", name: "Thermostat", room: "Whole Home", icon: Thermometer, type: "slider", value: 72 },
  { id: "3", name: "Front Door", room: "Entrance", icon: Lock, type: "status", value: true, status: "Locked" },
  { id: "4", name: "TV", room: "Living Room", icon: Tv, type: "switch", value: false },
  { id: "5", name: "Bedroom Fan", room: "Master Bedroom", icon: Fan, type: "switch", value: true },
  { id: "6", name: "Kitchen Speaker", room: "Kitchen", icon: Speaker, type: "switch", value: true },
];

export function SmartHomeControls() {
  return (
    <div className="space-y-6">
      {/* Quick Scenes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Good Morning", icon: "🌅", active: false },
          { label: "Focus Mode", icon: "🎯", active: true },
          { label: "Movie Night", icon: "🎬", active: false },
          { label: "Goodnight", icon: "🌙", active: false },
        ].map((scene, index) => (
          <motion.button
            key={scene.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
              scene.active
                ? "bg-primary/10 border-primary/30"
                : "bg-card/50 border-border/50 hover:border-primary/20"
            }`}
          >
            <span className="text-2xl">{scene.icon}</span>
            <span className="text-sm text-foreground">{scene.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Device Controls */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Device Controls</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {DEVICES.map((device, index) => {
            const Icon = device.icon;
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <div className="p-2 rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.room}</p>
                </div>
                {device.type === "switch" && (
                  <Switch checked={device.value as boolean} />
                )}
                {device.type === "slider" && (
                  <div className="w-24">
                    <Slider
                      value={[device.value as number]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
                {device.type === "status" && (
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
                    {device.status}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Energy Usage */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Today's Energy</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-3xl font-display font-semibold text-foreground">24.5 kWh</p>
            <p className="text-sm text-muted-foreground">8% below average</p>
          </div>
          <div className="h-16 w-32 bg-gradient-to-r from-emerald-500/20 to-primary/20 rounded-lg flex items-end p-2">
            {[40, 60, 45, 80, 55, 70, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 mx-0.5 bg-primary/60 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
