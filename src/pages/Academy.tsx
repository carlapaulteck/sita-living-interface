import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  GraduationCap, 
  Calendar, 
  Trophy, 
  Users, 
  Settings,
  Search
} from "lucide-react";
import { CommunityFeed } from "@/components/academy/CommunityFeed";
import { CourseGrid } from "@/components/academy/CourseGrid";
import { EventsCalendar } from "@/components/academy/EventsCalendar";
import { Leaderboard } from "@/components/academy/Leaderboard";
import { MemberDirectory } from "@/components/academy/MemberDirectory";
import { AdminPanel } from "@/components/academy/admin/AdminPanel";
import { AcademySearch } from "@/components/academy/AcademySearch";
import { AcademyNotifications } from "@/components/academy/AcademyNotifications";
import { useAcademy } from "@/hooks/useAcademy";

const Academy = () => {
  const [activeTab, setActiveTab] = useState("community");
  const [showSearch, setShowSearch] = useState(false);
  const { profile, isAdmin } = useAcademy();

  const tabs = [
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "classroom", label: "Classroom", icon: GraduationCap },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "members", label: "Members", icon: Users },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-2xl bg-background/80 border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SITA Academy</h1>
                <p className="text-xs text-muted-foreground">Learn • Connect • Grow</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="p-2.5 rounded-xl bg-card/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <AcademyNotifications />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1.5 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-xl flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6"
            >
              <TabsContent value="community" className="mt-0">
                <CommunityFeed />
              </TabsContent>
              
              <TabsContent value="classroom" className="mt-0">
                <CourseGrid />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <EventsCalendar />
              </TabsContent>
              
              <TabsContent value="leaderboard" className="mt-0">
                <Leaderboard />
              </TabsContent>
              
              <TabsContent value="members" className="mt-0">
                <MemberDirectory />
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="admin" className="mt-0">
                  <AdminPanel />
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Search Modal */}
      <AcademySearch open={showSearch} onOpenChange={setShowSearch} />
    </div>
  );
};

export default Academy;
