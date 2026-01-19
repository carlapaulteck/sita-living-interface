import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame, Medal, Crown, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";
import type { GamificationSettings as GamificationSettingsType, LevelConfig } from "@/types/academy";

const defaultPointValues: GamificationSettingsType['point_values'] = {
  post: 10, comment: 5, like_received: 2, lesson_complete: 15, course_complete: 100, event_attend: 25, daily_login: 5,
};

const defaultLevels: (LevelConfig & { icon: typeof Star; color: string })[] = [
  { level: 1, name: "Newcomer", min_points: 0, icon: Star, color: "text-slate-400" },
  { level: 2, name: "Seeker", min_points: 100, icon: Zap, color: "text-blue-400" },
  { level: 3, name: "Apprentice", min_points: 300, icon: Flame, color: "text-orange-400" },
  { level: 4, name: "Practitioner", min_points: 600, icon: Medal, color: "text-purple-400" },
  { level: 5, name: "Adept", min_points: 1000, icon: Trophy, color: "text-primary" },
  { level: 6, name: "Master", min_points: 2000, icon: Crown, color: "text-yellow-400" },
];

export const GamificationSettings = () => {
  const [pointValues, setPointValues] = useState(defaultPointValues);
  const [levels, setLevels] = useState(defaultLevels);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateGamificationSettings } = useAcademy();

  const updatePointValue = (key: keyof typeof defaultPointValues, value: number) => {
    setPointValues({ ...pointValues, [key]: value });
    setHasChanges(true);
  };

  const updateLevel = (index: number, field: 'name' | 'min_points', value: string | number) => {
    const newLevels = [...levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setLevels(newLevels);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await updateGamificationSettings.mutateAsync({
      point_values: pointValues,
      levels: levels.map(l => ({ level: l.level, name: l.name, min_points: l.min_points })),
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setPointValues(defaultPointValues);
    setLevels(defaultLevels);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Gamification Settings</h3>
          <p className="text-sm text-muted-foreground">Configure points and levels for your community</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button onClick={handleSave} disabled={!hasChanges || updateGamificationSettings.isPending} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />{updateGamificationSettings.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <GlassCard hover={false}>
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />Point Values</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { key: 'post' as const, label: 'Create Post', emoji: '📝' },
            { key: 'comment' as const, label: 'Comment', emoji: '💬' },
            { key: 'like_received' as const, label: 'Receive Like', emoji: '❤️' },
            { key: 'lesson_complete' as const, label: 'Complete Lesson', emoji: '📚' },
            { key: 'course_complete' as const, label: 'Finish Course', emoji: '🎓' },
            { key: 'event_attend' as const, label: 'Attend Event', emoji: '📅' },
            { key: 'daily_login' as const, label: 'Daily Login', emoji: '🔥' },
          ]).map((item) => (
            <div key={item.key} className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><span>{item.emoji}</span>{item.label}</Label>
              <div className="relative">
                <Input type="number" min={0} value={pointValues[item.key]} onChange={(e) => updatePointValue(item.key, parseInt(e.target.value) || 0)} className="bg-muted/30 border-border/50 pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">XP</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" />Level Configuration</h4>
        <div className="space-y-4">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <motion.div key={level.level} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-current/10", level.color)}><Icon className={cn("w-6 h-6", level.color)} /></div>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-lg text-foreground">{level.level}</div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Level Name</Label>
                    <Input value={level.name} onChange={(e) => updateLevel(index, 'name', e.target.value)} className="bg-muted/30 border-border/50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min Points</Label>
                    <div className="relative">
                      <Input type="number" min={0} value={level.min_points} onChange={(e) => updateLevel(index, 'min_points', parseInt(e.target.value) || 0)} className="bg-muted/30 border-border/50 pr-12" disabled={index === 0} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};