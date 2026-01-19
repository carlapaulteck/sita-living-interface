import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Heart, Reply, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";
import type { PostComment } from "@/types/academy";

interface CommentsThreadProps {
  postId: string;
}

export const CommentsThread = ({ postId }: CommentsThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getPostComments, createComment, toggleCommentLike, profile, user } = useAcademy();

  useEffect(() => {
    setIsLoading(true);
    getPostComments(postId).then((comments) => {
      setPostComments(comments);
      setIsLoading(false);
    });
  }, [postId, getPostComments]);

  const topLevelComments = postComments.filter(c => !c.parent_comment_id);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    await createComment.mutateAsync({
      postId,
      content: newComment,
      parentCommentId: replyingTo || undefined,
    });
    
    // Refresh comments
    const updated = await getPostComments(postId);
    setPostComments(updated);
    
    setNewComment("");
    setReplyingTo(null);
  };

  const getReplies = (commentId: string) => {
    return postComments.filter(c => c.parent_comment_id === commentId);
  };

  const CommentItem = ({ 
    comment, 
    depth = 0 
  }: { 
    comment: PostComment; 
    depth?: number;
  }) => {
    const [isLiked, setIsLiked] = useState(comment.user_liked || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likes_count || 0);
    const replies = getReplies(comment.id);

    const handleLike = async () => {
      if (isLiked) return;
      setIsLiked(true);
      setLocalLikeCount(prev => prev + 1);
      try {
        await toggleCommentLike.mutateAsync({ commentId: comment.id, isLiked: false });
      } catch {
        setIsLiked(false);
        setLocalLikeCount(prev => prev - 1);
      }
    };

    const authorName = comment.author?.display_name || 'User';
    const authorInitials = authorName[0]?.toUpperCase() || 'U';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("space-y-3", depth > 0 && "ml-8 pl-4 border-l border-border/30")}
      >
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarImage src={comment.author?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground/90">{comment.content}</p>
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-400"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
                <span>{localLikeCount}</span>
              </button>
              {depth < 2 && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-3">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}

        {/* Reply input */}
        {replyingTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="ml-11"
          >
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] bg-muted/30 border-border/50 resize-none"
              />
              <Button
                size="icon"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || createComment.isPending}
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border/30">
      {/* New comment input */}
      {!replyingTo && (
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
              {user?.email?.[0].toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[60px] bg-muted/30 border-border/50 resize-none"
            />
            <Button
              size="icon"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || createComment.isPending}
              className="shrink-0 self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {topLevelComments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {topLevelComments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};