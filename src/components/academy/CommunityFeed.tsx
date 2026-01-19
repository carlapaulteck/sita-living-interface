import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, TrendingUp, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "./PostCard";
import { CreatePostModal } from "./CreatePostModal";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Posts" },
  { id: "wins", label: "Wins 🎉" },
  { id: "questions", label: "Questions" },
  { id: "resources", label: "Resources" },
];

const sortOptions = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "trending", label: "Trending", icon: Flame },
];

export const CommunityFeed = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { posts, profiles, subscribeToRealtime } = useAcademy();

  useEffect(() => {
    const unsubscribe = subscribeToRealtime();
    return () => unsubscribe();
  }, []);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => activeCategory === "all" || post.category === activeCategory)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      switch (sortBy) {
        case "popular":
          return (b.likes_count || 0) - (a.likes_count || 0);
        case "trending":
          // Weight recent posts with high engagement
          const aScore = (a.likes_count || 0) + (a.comments_count || 0);
          const bScore = (b.likes_count || 0) + (b.comments_count || 0);
          const aAge = Date.now() - new Date(a.created_at).getTime();
          const bAge = Date.now() - new Date(b.created_at).getTime();
          return (bScore / Math.log(bAge + 1)) - (aScore / Math.log(aAge + 1));
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getAuthorProfile = (userId: string) => {
    return profiles.find(p => p.user_id === userId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Community</h2>
          <p className="text-sm text-muted-foreground">Share, learn, and grow together</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card/50 text-muted-foreground border border-border/50 hover:text-foreground"
              )}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 sm:ml-auto">
          {sortOptions.map((sort) => {
            const Icon = sort.icon;
            return (
              <motion.button
                key={sort.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSortBy(sort.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all",
                  sortBy === sort.id
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : "bg-card/50 text-muted-foreground border border-border/50 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{sort.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <PostCard 
                post={post} 
                authorProfile={getAuthorProfile(post.user_id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to start a conversation!</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              Create First Post
            </Button>
          </motion.div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
};
