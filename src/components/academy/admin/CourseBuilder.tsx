import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  BookOpen,
  Video,
  FileText,
  Save,
  Eye,
  EyeOff,
  Upload,
  Link2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { AcademyCourse, CourseLesson } from "@/types/academy";
import { cn } from "@/lib/utils";

export const CourseBuilder = () => {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AcademyCourse | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const { courses, lessons, createCourse, updateCourse, deleteCourse, createLesson, updateLesson, deleteLesson } = useAcademy();

  const toggleCourseExpand = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const getCourseLessons = (courseId: string) => {
    return lessons
      .filter(l => l.course_id === courseId)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  };

  const handleSaveCourse = async (data: Partial<AcademyCourse>) => {
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, ...data });
    } else {
      await createCourse.mutateAsync(data);
    }
    setShowCourseModal(false);
    setEditingCourse(null);
  };

  const handleSaveLesson = async (data: Partial<CourseLesson>) => {
    if (editingLesson) {
      await updateLesson.mutateAsync({ id: editingLesson.id, ...data });
    } else if (selectedCourseId) {
      await createLesson.mutateAsync({ ...data, course_id: selectedCourseId });
    }
    setShowLessonModal(false);
    setEditingLesson(null);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course and all its lessons?')) {
      await deleteCourse.mutateAsync(courseId);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await deleteLesson.mutateAsync(lessonId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Course Builder</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage your courses
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(null);
            setShowCourseModal(true);
          }}
          className="bg-gradient-to-r from-primary to-secondary text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          New Course
        </Button>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((course) => {
            const courseLessons = getCourseLessons(course.id);
            const isExpanded = expandedCourses.has(course.id);

            return (
              <GlassCard key={course.id} hover={false}>
                {/* Course Header */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleCourseExpand(course.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground truncate">{course.title}</h4>
                      <Badge variant={course.is_published ? "default" : "outline"}>
                        {course.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {courseLessons.length} lessons • {course.category || 'Uncategorized'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setEditingLesson(null);
                        setShowLessonModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCourse(course);
                        setShowCourseModal(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Lessons */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 ml-9 space-y-2"
                    >
                      {courseLessons.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            {lesson.content_type === 'video' ? (
                              <Video className="w-4 h-4 text-primary" />
                            ) : (
                              <FileText className="w-4 h-4 text-secondary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{lesson.content_type}</p>
                          </div>
                          <Badge variant={lesson.is_published ? "default" : "outline"} className="text-xs">
                            {lesson.is_published ? "Published" : "Draft"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setEditingLesson(lesson);
                              setShowLessonModal(true);
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                      {courseLessons.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No lessons yet. Click + to add one.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })
        ) : (
          <GlassCard hover={false}>
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">No courses yet</h4>
              <p className="text-muted-foreground mb-4">Create your first course to get started</p>
              <Button
                onClick={() => setShowCourseModal(true)}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Course Modal */}
      <CourseModal
        open={showCourseModal}
        onOpenChange={setShowCourseModal}
        course={editingCourse}
        onSave={handleSaveCourse}
        isLoading={createCourse.isPending || updateCourse.isPending}
      />

      {/* Lesson Modal */}
      <LessonModal
        open={showLessonModal}
        onOpenChange={setShowLessonModal}
        lesson={editingLesson}
        onSave={handleSaveLesson}
        isLoading={createLesson.isPending || updateLesson.isPending}
      />
    </div>
  );
};

// Course Modal Component
const CourseModal = ({
  open,
  onOpenChange,
  course,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: AcademyCourse | null;
  onSave: (data: Partial<AcademyCourse>) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    difficulty: course?.difficulty || "beginner",
    duration_hours: course?.duration_hours || 0,
    thumbnail_url: course?.thumbnail_url || "",
    unlock_at_level: course?.unlock_at_level || 1,
    is_published: course?.is_published || false,
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {course ? "Edit Course" : "Create Course"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Course title..."
              className="bg-muted/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course description..."
              className="bg-muted/30 border-border/50 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Business"
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration (hours)</Label>
              <Input
                type="number"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Unlock at Level</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={formData.unlock_at_level}
                onChange={(e) => setFormData({ ...formData, unlock_at_level: parseInt(e.target.value) || 1 })}
                className="bg-muted/30 border-border/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Thumbnail URL</Label>
            <Input
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://..."
              className="bg-muted/30 border-border/50"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Publish Course</p>
              <p className="text-sm text-muted-foreground">Make visible to members</p>
            </div>
            <Switch
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {isLoading ? "Saving..." : "Save Course"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Lesson Modal Component
const LessonModal = ({
  open,
  onOpenChange,
  lesson,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: CourseLesson | null;
  onSave: (data: Partial<CourseLesson>) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    description: lesson?.description || "",
    content_type: lesson?.content_type || "video",
    video_url: lesson?.video_url || "",
    text_content: lesson?.text_content || "",
    transcript: lesson?.transcript || "",
    is_published: lesson?.is_published || false,
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {lesson ? "Edit Lesson" : "Create Lesson"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Lesson title..."
              className="bg-muted/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description..."
              className="bg-muted/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value) => setFormData({ ...formData, content_type: value })}
            >
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.content_type === 'video' && (
            <div className="space-y-2">
              <Label>Video URL (YouTube, Vimeo, or direct)</Label>
              <Input
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-muted/30 border-border/50"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              value={formData.text_content}
              onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
              placeholder="Lesson content (supports HTML)..."
              className="bg-muted/30 border-border/50 min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Transcript (searchable)</Label>
            <Textarea
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              placeholder="Video transcript for search..."
              className="bg-muted/30 border-border/50 min-h-[100px]"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Publish Lesson</p>
              <p className="text-sm text-muted-foreground">Make visible to students</p>
            </div>
            <Switch
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {isLoading ? "Saving..." : "Save Lesson"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
