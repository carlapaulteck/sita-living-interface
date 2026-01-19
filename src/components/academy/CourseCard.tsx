import { motion } from "framer-motion";
import { 
  Play, 
  Lock, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/GlassCard";
import { AcademyCourse } from "@/types/academy";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: AcademyCourse;
  progress?: number;
  isLocked?: boolean;
  requiredLevel?: number;
  currentLevel?: number;
  onClick: () => void;
}

export const CourseCard = ({
  course,
  progress = 0,
  isLocked = false,
  requiredLevel = 0,
  currentLevel = 0,
  onClick,
}: CourseCardProps) => {
  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const isCompleted = progress >= 100;

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -4 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      onClick={isLocked ? undefined : onClick}
      className={cn(isLocked && "cursor-not-allowed")}
    >
      <GlassCard 
        hover={!isLocked} 
        glow={isCompleted ? "gold" : "none"}
        className={cn(
          "overflow-hidden",
          isLocked && "opacity-60"
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video -m-6 mb-4 overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary/50" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play/Lock Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isLocked ? (
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Lock className="w-6 h-6 text-white/70" />
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              </motion.div>
            )}
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {course.difficulty && (
              <Badge className={cn("capitalize", difficultyColors[course.difficulty] || difficultyColors.beginner)}>
                {course.difficulty}
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-1">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.duration_hours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration_hours}h</span>
              </div>
            )}
            {course.lessons_count && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons_count} lessons</span>
              </div>
            )}
          </div>

          {/* Progress or Lock message */}
          {isLocked ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Unlock at Level {requiredLevel} (You're Level {currentLevel})
              </span>
            </div>
          ) : progress > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : null}

          {/* Category */}
          {course.category && (
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};
