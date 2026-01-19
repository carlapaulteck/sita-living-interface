import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Image, 
  Video, 
  BarChart3, 
  X, 
  Plus,
  Pin,
  Sparkles
} from "lucide-react";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: "general", label: "General", color: "bg-muted" },
  { id: "wins", label: "Wins 🎉", color: "bg-primary/20 border-primary/30" },
  { id: "questions", label: "Questions", color: "bg-secondary/20 border-secondary/30" },
  { id: "resources", label: "Resources", color: "bg-accent/20 border-accent/30" },
];

export const CreatePostModal = ({ open, onOpenChange }: CreatePostModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [isPinned, setIsPinned] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  
  const { createPost, profile } = useAcademy();
  const isAdmin = profile?.is_admin || false;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    await createPost.mutateAsync({
      title: title || undefined,
      content,
      category,
      is_pinned: isAdmin ? isPinned : false,
      media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
      poll_options: pollOptions.length >= 2 
        ? pollOptions.map(opt => ({ text: opt, votes: 0 }))
        : undefined,
    });

    // Reset form
    setTitle("");
    setContent("");
    setCategory("general");
    setIsPinned(false);
    setMediaUrls([]);
    setPollOptions([]);
    setShowPoll(false);
    onOpenChange(false);
  };

  const addMediaUrl = () => {
    if (mediaUrl.trim()) {
      setMediaUrls([...mediaUrls, mediaUrl.trim()]);
      setMediaUrl("");
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl border transition-all",
                    category === cat.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Title (optional) */}
          <div className="space-y-2">
            <Label className="text-foreground">Title (optional)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="bg-muted/30 border-border/50"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-foreground">Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px] bg-muted/30 border-border/50 resize-none"
            />
          </div>

          {/* Media URLs */}
          <div className="space-y-3">
            <Label className="text-foreground flex items-center gap-2">
              <Image className="w-4 h-4" />
              Media (optional)
            </Label>
            <div className="flex gap-2">
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Paste image or video URL..."
                className="bg-muted/30 border-border/50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMediaUrl}
                disabled={!mediaUrl.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {mediaUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaUrls.map((url, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="truncate max-w-[150px]">{url}</span>
                    <button
                      onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                      className="p-0.5 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Poll Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Add Poll
              </Label>
              <Switch
                checked={showPoll}
                onCheckedChange={(checked) => {
                  setShowPoll(checked);
                  if (checked && pollOptions.length === 0) {
                    setPollOptions(["", ""]);
                  } else if (!checked) {
                    setPollOptions([]);
                  }
                }}
              />
            </div>
            
            <AnimatePresence>
              {showPoll && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-muted/30 border-border/50"
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePollOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPollOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin: Pin Post */}
          {isAdmin && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Pin this post</span>
              </div>
              <Switch checked={isPinned} onCheckedChange={setIsPinned} />
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || createPost.isPending}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {createPost.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
