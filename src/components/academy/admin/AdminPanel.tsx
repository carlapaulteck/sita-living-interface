import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Send, 
  Settings,
  Users,
  BarChart3
} from "lucide-react";
import { CourseBuilder } from "./CourseBuilder";
import { EventManager } from "./EventManager";
import { GamificationSettings } from "./GamificationSettings";
import { BroadcastComposer } from "./BroadcastComposer";
import { AdminStats } from "./AdminStats";
import { GlassCard } from "@/components/GlassCard";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("stats");

  const tabs = [
    { id: "stats", label: "Analytics", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "events", label: "Events", icon: Calendar },
    { id: "gamification", label: "Gamification", icon: Trophy },
    { id: "broadcast", label: "Broadcast", icon: Send },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">
          Manage your academy content and settings
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-auto p-1.5 bg-card/50 border border-border/50 rounded-2xl flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 data-[state=active]:text-primary transition-all"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <TabsContent value="stats" className="mt-0">
            <AdminStats />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-0">
            <CourseBuilder />
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <EventManager />
          </TabsContent>
          
          <TabsContent value="gamification" className="mt-0">
            <GamificationSettings />
          </TabsContent>
          
          <TabsContent value="broadcast" className="mt-0">
            <BroadcastComposer />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};
