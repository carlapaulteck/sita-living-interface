import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Bookmark,
  Pin,
  Trash2,
  Edit3
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlassCard } from "@/components/GlassCard";
import { CommentsThread } from "./CommentsThread";
import { useAcademy } from "@/hooks/useAcademy";
import { useAuth } from "@/hooks/useAuth";
import { CommunityPost } from "@/types/academy";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: CommunityPost;
  authorProfile?: {
    display_name: string | null;
    avatar_url: string | null;
    level_name?: string;
  };
}

export const PostCard = ({ post, authorProfile }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.likes_count || 0);
  const { user } = useAuth();
  const { likeContent, deletePost } = useAcademy();
  const isAuthor = user?.id === post.user_id;

  const handleLike = async () => {
    if (isLiked) return;
    
    setIsLiked(true);
    setLocalLikeCount(prev => prev + 1);
    
    try {
      await likeContent.mutateAsync({ contentType: 'post', contentId: post.id });
    } catch (error) {
      setIsLiked(false);
      setLocalLikeCount(prev => prev - 1);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost.mutateAsync(post.id);
    }
  };

  const categoryColors: Record<string, string> = {
    general: "bg-muted text-muted-foreground",
    wins: "bg-primary/20 text-primary border-primary/30",
    questions: "bg-secondary/20 text-secondary border-secondary/30",
    resources: "bg-accent/20 text-accent border-accent/30",
  };

  const authorName = authorProfile?.display_name || 'Anonymous';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <GlassCard className="overflow-visible" hover={false}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-border">
              <AvatarImage src={authorProfile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{authorName}</span>
                {authorProfile?.level_name && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-primary/30 text-primary">
                    {authorProfile.level_name}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.is_pinned && (
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                <Pin className="w-3 h-3 mr-1" />
                Pinned
              </Badge>
            )}
            <Badge className={cn("capitalize", categoryColors[post.category] || categoryColors.general)}>
              {post.category}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {isAuthor && (
                  <>
                    <DropdownMenuItem>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
        )}

        {/* Content */}
        <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className={cn(
            "grid gap-2",
            post.media_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {post.media_urls.map((url, index) => (
              <motion.div
                key={index}
                className="relative aspect-video rounded-xl overflow-hidden bg-muted"
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={url} 
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Poll */}
        {post.poll_options && (
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50">
            {(post.poll_options as { text: string; votes: number }[]).map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-3 rounded-lg bg-card/50 border border-border/50 text-left hover:bg-card hover:border-primary/30 transition-colors"
              >
                <span className="text-foreground">{option.text}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-400"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            <span>{localLikeCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments_count || 0}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CommentsThread postId={post.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
