import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Webhook, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Play,
  Settings2,
  AlertTriangle
} from "lucide-react";
import { webhookService, type Webhook as WebhookType } from "@/services/webhook.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function WebhookManagement() {
  const queryClient = useQueryClient();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["webhooks"],
    queryFn: () => webhookService.getWebhooks(),
  });

  const availableEvents = webhookService.getAvailableEvents();

  const createMutation = useMutation({
    mutationFn: () => webhookService.createWebhook(newWebhookUrl, selectedEvents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook created successfully");
      setIsCreateOpen(false);
      setNewWebhookUrl("");
      setSelectedEvents([]);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create webhook: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => webhookService.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete webhook: ${error.message}`);
    },
  });

  const testMutation = useMutation({
    mutationFn: (id: string) => webhookService.testWebhook(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Test webhook sent successfully");
      } else {
        toast.error(`Test failed: ${result.error}`);
      }
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => webhookService.regenerateSecret(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Secret regenerated");
    },
  });

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleEvent = (eventName: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  };

  const getStatusBadge = (webhook: WebhookType) => {
    if (!webhook.is_active) {
      return <Badge variant="secondary" className="bg-muted/50">Inactive</Badge>;
    }
    if (webhook.failure_count && webhook.failure_count >= 3) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Failing
      </Badge>;
    }
    if (webhook.last_response_code && webhook.last_response_code >= 200 && webhook.last_response_code < 300) {
      return <Badge variant="default" className="bg-secondary/20 text-secondary border-secondary/30">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Healthy
      </Badge>;
    }
    return <Badge variant="outline">Ready</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Webhooks</h2>
          <p className="text-sm text-muted-foreground">
            Receive real-time notifications when events occur
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-server.com/webhook"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Events to Subscribe</Label>
                <Accordion type="multiple" className="mt-2">
                  {availableEvents.map((category) => (
                    <AccordionItem key={category.category} value={category.category}>
                      <AccordionTrigger className="text-sm">
                        {category.category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-2">
                          {category.events.map((event) => (
                            <div key={event.name} className="flex items-start gap-2">
                              <Checkbox
                                id={event.name}
                                checked={selectedEvents.includes(event.name)}
                                onCheckedChange={() => toggleEvent(event.name)}
                              />
                              <div className="grid gap-0.5">
                                <Label
                                  htmlFor={event.name}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {event.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!newWebhookUrl || selectedEvents.length === 0 || createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <p className="text-sm text-muted-foreground">Total Webhooks</p>
          <p className="text-2xl font-bold text-foreground">{webhooks.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-secondary">
            {webhooks.filter((w) => w.is_active).length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-muted-foreground">Failing</p>
          <p className="text-2xl font-bold text-destructive">
            {webhooks.filter((w) => w.failure_count && w.failure_count >= 3).length}
          </p>
        </GlassCard>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {webhooks.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-foreground font-medium">No webhooks configured</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a webhook to receive real-time event notifications
              </p>
            </GlassCard>
          ) : (
            webhooks.map((webhook, index) => (
              <motion.div
                key={webhook.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Webhook className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{webhook.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {webhook.url}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(webhook)}
                  </div>

                  {/* Events */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {webhook.events.slice(0, 4).map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                    {webhook.events.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{webhook.events.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Secret */}
                  <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-muted/20">
                    <span className="text-xs text-muted-foreground">Secret:</span>
                    <code className="text-xs flex-1 font-mono">
                      {showSecrets[webhook.id]
                        ? webhook.secret
                        : "••••••••••••••••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleSecret(webhook.id)}
                    >
                      {showSecrets[webhook.id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(webhook.secret, "Secret")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      {webhook.last_triggered_at ? (
                        <>
                          Last triggered{" "}
                          {formatDistanceToNow(new Date(webhook.last_triggered_at), {
                            addSuffix: true,
                          })}
                        </>
                      ) : (
                        "Never triggered"
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => testMutation.mutate(webhook.id)}
                        disabled={testMutation.isPending}
                      >
                        {testMutation.isPending ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        <span className="ml-1">Test</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => regenerateMutation.mutate(webhook.id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span className="ml-1">Regenerate</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(webhook.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
