import { motion } from "framer-motion";
import { Shield, Camera, Lock, Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SignalCard } from "@/components/SignalCard";
import { Switch } from "@/components/ui/switch";

interface SecurityDevice {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "alert";
  battery?: number;
}

const DEVICES: SecurityDevice[] = [
  { id: "1", name: "Front Door Camera", location: "Entrance", status: "online", battery: 85 },
  { id: "2", name: "Backyard Camera", location: "Backyard", status: "online", battery: 72 },
  { id: "3", name: "Motion Sensor", location: "Living Room", status: "online" },
  { id: "4", name: "Door Sensor", location: "Garage", status: "online" },
  { id: "5", name: "Window Sensor", location: "Kitchen", status: "offline" },
];

export function SecurityOverview() {
  const onlineCount = DEVICES.filter(d => d.status === "online").length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <Shield className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-foreground">All Secure</h2>
            <p className="text-sm text-muted-foreground">{onlineCount}/{DEVICES.length} devices online</p>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Away Mode</span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Alerts</span>
            </div>
            <Switch checked />
          </div>
        </div>
      </GlassCard>

      {/* Signal Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SignalCard title="Cameras" value={`${DEVICES.filter(d => d.name.includes("Camera")).length}`} subtitle="Recording" icon={Camera} status="healthy" />
        <SignalCard title="Sensors" value="4" subtitle="Active" icon={Shield} status="healthy" />
        <SignalCard title="Last Alert" value="None" subtitle="Past 24h" icon={Bell} status="healthy" />
        <SignalCard title="Issue" value="1" subtitle="Offline sensor" icon={AlertTriangle} status="attention" />
      </div>

      {/* Device List */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Security Devices</h3>
        <div className="space-y-3">
          {DEVICES.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                device.status === "offline" ? "bg-rose-500/5 border-rose-500/20" : "bg-card/50 border-border/50"
              }`}
            >
              <div className={`p-2 rounded-lg ${device.status === "online" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                {device.status === "online" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{device.name}</p>
                <p className="text-xs text-muted-foreground">{device.location}</p>
              </div>
              {device.battery && (
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  device.battery > 50 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {device.battery}%
                </span>
              )}
              <span className={`text-xs ${device.status === "online" ? "text-emerald-400" : "text-rose-400"}`}>
                {device.status}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
