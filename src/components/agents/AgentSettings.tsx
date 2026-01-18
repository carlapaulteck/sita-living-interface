import { GlassCard } from "@/components/GlassCard";
import { Bot, Shield, Bell, Clock, Sliders, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const agentSettings = [
  { 
    agent: "Email Agent", 
    enabled: true, 
    autonomy: 80, 
    notifications: true,
    description: "Manages inbox, drafts replies, and filters priority"
  },
  { 
    agent: "Finance Agent", 
    enabled: true, 
    autonomy: 60, 
    notifications: true,
    description: "Tracks expenses, alerts on anomalies, reconciles accounts"
  },
  { 
    agent: "Scheduling Agent", 
    enabled: true, 
    autonomy: 90, 
    notifications: false,
    description: "Manages calendar, schedules meetings, blocks focus time"
  },
  { 
    agent: "Research Agent", 
    enabled: true, 
    autonomy: 70, 
    notifications: true,
    description: "Gathers market intel, analyzes competitors, generates reports"
  },
  { 
    agent: "Health Agent", 
    enabled: false, 
    autonomy: 50, 
    notifications: true,
    description: "Tracks wellness, sends medication reminders, monitors vitals"
  },
];

const globalSettings = [
  { name: "Emergency Stop", description: "Instantly pause all agent activity", enabled: false },
  { name: "Quiet Hours", description: "No agent actions between 10 PM - 7 AM", enabled: true },
  { name: "Approval Required", description: "Require approval for high-impact actions", enabled: true },
  { name: "Activity Logging", description: "Log all agent actions for review", enabled: true },
];

export function AgentSettings() {
  const [settings, setSettings] = useState(agentSettings);
  const [globals, setGlobals] = useState(globalSettings);

  const toggleAgent = (index: number) => {
    setSettings(prev => prev.map((s, i) => 
      i === index ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const toggleGlobal = (index: number) => {
    setGlobals(prev => prev.map((s, i) => 
      i === index ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateAutonomy = (index: number, value: number[]) => {
    setSettings(prev => prev.map((s, i) => 
      i === index ? { ...s, autonomy: value[0] } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Global Controls */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Global Controls</h3>
        </div>
        <div className="space-y-4">
          {globals.map((setting, index) => (
            <motion.div
              key={setting.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/20"
            >
              <div>
                <p className="font-medium text-foreground">{setting.name}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch 
                checked={setting.enabled} 
                onCheckedChange={() => toggleGlobal(index)}
              />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Individual Agent Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Agent Configuration</h3>
        </div>
        <div className="space-y-6">
          {settings.map((agent, index) => (
            <motion.div
              key={agent.agent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${agent.enabled ? 'bg-muted/20' : 'bg-muted/10 opacity-60'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${agent.enabled ? 'bg-primary/10' : 'bg-muted/30'}`}>
                    <Bot className={`h-5 w-5 ${agent.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{agent.agent}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={agent.enabled} 
                  onCheckedChange={() => toggleAgent(index)}
                />
              </div>
              
              {agent.enabled && (
                <div className="space-y-4 mt-4 pl-12">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Autonomy Level</span>
                      <span className="text-sm font-medium text-foreground">{agent.autonomy}%</span>
                    </div>
                    <Slider
                      value={[agent.autonomy]}
                      onValueChange={(value) => updateAutonomy(index, value)}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Ask always</span>
                      <span>Fully autonomous</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Action notifications</span>
                    </div>
                    <Switch 
                      checked={agent.notifications} 
                      onCheckedChange={() => {
                        setSettings(prev => prev.map((s, i) => 
                          i === index ? { ...s, notifications: !s.notifications } : s
                        ));
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
