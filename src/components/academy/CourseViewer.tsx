import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Search,
  ChevronRight,
  FileText,
  Video,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { AcademyCourse, CourseLesson } from "@/types/academy";
import { cn } from "@/lib/utils";

interface CourseViewerProps {
  course: AcademyCourse;
  onBack: () => void;
}

export const CourseViewer = ({ course, onBack }: CourseViewerProps) => {
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [searchTranscript, setSearchTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [courseLessons, setCourseLessons] = useState<CourseLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getCourseLessons, getCourseProgress, completeLesson, awardPoints } = useAcademy();
  
  const progress = getCourseProgress(course.id);

  useEffect(() => {
    setIsLoading(true);
    getCourseLessons(course.id).then((lessons) => {
      const publishedLessons = lessons.filter(l => l.is_published !== false);
      setCourseLessons(publishedLessons);
      if (publishedLessons.length > 0 && !selectedLesson) {
        const firstIncomplete = publishedLessons.find(l => !l.is_completed);
        setSelectedLesson(firstIncomplete || publishedLessons[0]);
      }
      setIsLoading(false);
    });
  }, [course.id, getCourseLessons]);

  const completedLessons = courseLessons.filter(l => l.is_completed);
  const completionProgress = courseLessons.length > 0 
    ? (completedLessons.length / courseLessons.length) * 100 
    : 0;

  const handleMarkComplete = async () => {
    if (!selectedLesson) return;
    
    await completeLesson.mutateAsync({
      courseId: course.id,
      lessonId: selectedLesson.id,
    });
    
    // Refresh lessons
    const updated = await getCourseLessons(course.id);
    setCourseLessons(updated.filter(l => l.is_published !== false));

    // Move to next lesson
    const currentIndex = courseLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < courseLessons.length - 1) {
      setSelectedLesson(courseLessons[currentIndex + 1]);
    }
  };

  const isLessonComplete = (lessonId: string) => {
    const lesson = courseLessons.find(l => l.id === lessonId);
    return lesson?.is_completed || false;
  };

  const filteredTranscript = selectedLesson?.transcript
    ?.split('\n')
    .filter(line => 
      !searchTranscript || 
      line.toLowerCase().includes(searchTranscript.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  if (courseLessons.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No lessons yet</h3>
        <p className="text-muted-foreground mb-4">This course is being prepared</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">{course.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{completedLessons.length}/{courseLessons.length} lessons</span>
            <span>•</span>
            <span>{Math.round(completionProgress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={completionProgress} className="h-2" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video/Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {selectedLesson && (
            <>
              {/* Video Player */}
              {selectedLesson.video_url ? (
                <GlassCard hover={false} className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    {selectedLesson.video_url.includes('youtube') || 
                     selectedLesson.video_url.includes('vimeo') ? (
                      <iframe
                        src={selectedLesson.video_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedLesson.video_url}
                        controls
                        className="w-full h-full"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    )}
                  </div>
                </GlassCard>
              ) : (
                <GlassCard hover={false} className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">Text-based lesson</p>
                  </div>
                </GlassCard>
              )}

              {/* Lesson Info & Actions */}
              <GlassCard hover={false}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedLesson.title}
                    </h3>
                    {selectedLesson.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedLesson.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isLessonComplete(selectedLesson.id) || completeLesson.isPending}
                    className={cn(
                      isLessonComplete(selectedLesson.id)
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                    )}
                  >
                    {isLessonComplete(selectedLesson.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : completeLesson.isPending ? (
                      "Saving..."
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </div>

                {/* Tabs for Content/Transcript/Resources */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="w-full bg-muted/30">
                    <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                    {selectedLesson.transcript && (
                      <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                    )}
                    {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                      <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    {selectedLesson.text_content ? (
                      <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.text_content }} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Watch the video above to complete this lesson.
                      </p>
                    )}
                  </TabsContent>

                  {selectedLesson.transcript && (
                    <TabsContent value="transcript" className="mt-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={searchTranscript}
                          onChange={(e) => setSearchTranscript(e.target.value)}
                          placeholder="Search transcript..."
                          className="pl-9 bg-muted/30 border-border/50"
                        />
                      </div>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {filteredTranscript?.map((line, index) => (
                            <p 
                              key={index}
                              className={cn(
                                "text-sm",
                                searchTranscript && line.toLowerCase().includes(searchTranscript.toLowerCase())
                                  ? "bg-primary/20 p-2 rounded"
                                  : "text-muted-foreground"
                              )}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  )}

                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <TabsContent value="resources" className="mt-4">
                      <div className="space-y-2">
                        {selectedLesson.resources.map((resource, index) => (
                          <motion.a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            {resource.type === 'pdf' ? (
                              <FileText className="w-5 h-5 text-primary" />
                            ) : resource.type === 'file' ? (
                              <Video className="w-5 h-5 text-primary" />
                            ) : (
                              <Link2 className="w-5 h-5 text-primary" />
                            )}
                            <span className="text-foreground">{resource.name}</span>
                            <Download className="w-4 h-4 ml-auto text-muted-foreground" />
                          </motion.a>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </GlassCard>
            </>
          )}
        </div>

        {/* Lesson Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard hover={false} className="sticky top-4">
            <h4 className="font-semibold text-foreground mb-4">Course Content</h4>
            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-2">
                {courseLessons.map((lesson, index) => {
                  const isComplete = isLessonComplete(lesson.id);
                  const isActive = selectedLesson?.id === lesson.id;
                  
                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                        isActive
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-muted/30 border border-transparent hover:border-border/50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        isComplete
                          ? "bg-green-500/20 text-green-400"
                          : isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {lesson.title}
                        </p>
                        {lesson.video_duration_seconds && lesson.video_duration_seconds > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(lesson.video_duration_seconds / 60)}:{String(lesson.video_duration_seconds % 60).padStart(2, '0')}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};