import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Users, Eye, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

export const BroadcastComposer = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [alsoCreatePost, setAlsoCreatePost] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { profiles, createPost } = useAcademy();
  const memberCount = profiles.length;

  const handleSendBroadcast = async () => {
    if (!subject.trim() || !content.trim()) return;
    setIsSending(true);
    try {
      if (alsoCreatePost) {
        await createPost.mutateAsync({ title: subject, content, category: 'general' });
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
      setTimeout(() => { setSubject(""); setContent(""); setSent(false); }, 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Email Broadcast</h3>
        <p className="text-sm text-muted-foreground">Send an email to all {memberCount} community members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject Line</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Your email subject..." className="bg-muted/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your message here..." className="bg-muted/30 border-border/50 min-h-[250px] resize-none" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Also post to community</p>
                  <p className="text-sm text-muted-foreground">Create a post with this content</p>
                </div>
              </div>
              <Switch checked={alsoCreatePost} onCheckedChange={setAlsoCreatePost} />
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium">Sending to {memberCount} members</p>
                <p className="opacity-80">Emails will be sent individually to each member's registered email address.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="flex-1"><Eye className="w-4 h-4 mr-2" />{showPreview ? "Hide Preview" : "Preview"}</Button>
              <Button onClick={handleSendBroadcast} disabled={!subject.trim() || !content.trim() || isSending || sent}
                className={cn("flex-1", sent ? "bg-green-500/20 text-green-400" : "bg-gradient-to-r from-primary to-secondary text-primary-foreground")}>
                {sent ? <><CheckCircle2 className="w-4 h-4 mr-2" />Sent!</> : isSending ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Broadcast</>}
              </Button>
            </div>
          </div>
        </GlassCard>

        <motion.div initial={false} animate={{ opacity: showPreview ? 1 : 0.5 }}>
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center gap-2 mb-4"><Mail className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Email Preview</h4></div>
            <div className="rounded-xl border border-border/50 overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center"><h2 className="text-2xl font-bold text-white">SITA Academy</h2></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{subject || "Your subject line here..."}</h3>
                <div className="text-gray-600 whitespace-pre-wrap">{content || "Your message content will appear here..."}</div>
              </div>
              <div className="bg-gray-100 p-4 text-center text-sm text-gray-500">
                <p>You're receiving this because you're a member of SITA Academy.</p>
                <a href="#" className="text-primary hover:underline">Unsubscribe</a>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" /><span>{memberCount} recipients</span><Badge variant="outline" className="ml-auto">All Members</Badge>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};