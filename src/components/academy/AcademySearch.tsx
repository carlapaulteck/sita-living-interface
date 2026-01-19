import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  BookOpen, 
  Users,
  FileText,
  X
} from "lucide-react";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

interface AcademySearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchCategory = 'all' | 'posts' | 'courses' | 'members';

export const AcademySearch = ({ open, onOpenChange }: AcademySearchProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>('all');
  const { searchContent, posts, courses, profiles } = useAcademy();

  const results = searchContent(query);

  const categories = [
    { id: 'all' as const, label: 'All', icon: Search },
    { id: 'posts' as const, label: 'Posts', icon: MessageSquare },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
    { id: 'members' as const, label: 'Members', icon: Users },
  ];

  const filteredResults = {
    posts: category === 'all' || category === 'posts' ? results.posts : [],
    courses: category === 'all' || category === 'courses' ? results.courses : [],
    members: category === 'all' || category === 'members' ? results.members : [],
  };

  const totalResults = 
    filteredResults.posts.length + 
    filteredResults.courses.length + 
    filteredResults.members.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-card border-border max-h-[80vh] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, courses, members..."
              className="pl-10 pr-10 bg-muted/30 border-border/50 text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                    category === cat.id
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[50vh] p-4">
          {query ? (
            totalResults > 0 ? (
              <div className="space-y-6">
                {/* Posts */}
                {filteredResults.posts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Posts ({filteredResults.posts.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.posts.slice(0, 5).map((post) => (
                        <motion.button
                          key={post.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          className="w-full text-left p-3 rounded-xl border border-border/50"
                          onClick={() => onOpenChange(false)}
                        >
                          <p className="font-medium text-foreground line-clamp-1">
                            {post.title || post.content.slice(0, 50)}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {post.content}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {filteredResults.courses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Courses ({filteredResults.courses.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.courses.slice(0, 5).map((course) => (
                        <motion.button
                          key={course.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          className="w-full text-left p-3 rounded-xl border border-border/50"
                          onClick={() => onOpenChange(false)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{course.title}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {course.difficulty}
                            </Badge>
                          </div>
                          {course.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {course.description}
                            </p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Members */}
                {filteredResults.members.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Members ({filteredResults.members.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredResults.members.slice(0, 5).map((member) => (
                        <motion.button
                          key={member.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 flex items-center gap-3"
                          onClick={() => onOpenChange(false)}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-foreground font-medium">
                            {member.display_name?.[0]?.toUpperCase() || 'M'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.display_name || 'Member'}
                            </p>
                            {member.bio && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Start typing to search...</p>
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd> to select</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
