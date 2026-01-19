import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "./CourseCard";
import { CourseViewer } from "./CourseViewer";
import { useAcademy } from "@/hooks/useAcademy";
import { AcademyCourse } from "@/types/academy";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Business",
  "Marketing",
  "Finance",
  "Health",
  "Mindset",
  "Technology",
];

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export const CourseGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  
  const { courses, getCourseProgress, memberPoints } = useAcademy();
  const currentLevel = memberPoints?.current_level || 1;

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesDifficulty = 
      selectedDifficulty === "All" || 
      course.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty && course.is_published;
  });

  // Sort: unlocked first, then by order
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aLocked = (a.unlock_at_level || 0) > currentLevel;
    const bLocked = (b.unlock_at_level || 0) > currentLevel;
    if (aLocked !== bLocked) return aLocked ? 1 : -1;
    return (a.order_index || 0) - (b.order_index || 0);
  });

  const getProgress = (courseId: string) => {
    return getCourseProgress(courseId);
  };

  if (selectedCourse) {
    return (
      <CourseViewer 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Classroom</h2>
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length} courses available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm",
                selectedCategory === cat
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card/50 text-muted-foreground border border-border/50 hover:text-foreground"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <Badge
              key={diff}
              variant={selectedDifficulty === diff ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                selectedDifficulty === diff 
                  ? "bg-secondary/20 text-secondary border-secondary/30" 
                  : "hover:border-secondary/50"
              )}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff}
            </Badge>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <AnimatePresence mode="popLayout">
        {sortedCourses.length > 0 ? (
          <motion.div
            layout
            className={cn(
              "gap-6",
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "flex flex-col"
            )}
          >
            {sortedCourses.map((course, index) => {
              const isLocked = (course.unlock_at_level || 0) > currentLevel;
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    progress={getProgress(course.id)}
                    isLocked={isLocked}
                    requiredLevel={course.unlock_at_level || 0}
                    currentLevel={currentLevel}
                    onClick={() => setSelectedCourse(course)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};