import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Plus, Trash2, Edit3, Calendar, Video, Users, Clock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { CommunityEvent } from "@/types/academy";
import { cn } from "@/lib/utils";

const eventTypeConfig: Record<string, { icon: typeof Video; color: string }> = {
  livestream: { icon: Video, color: "bg-red-500/20 text-red-400" },
  zoom: { icon: Users, color: "bg-blue-500/20 text-blue-400" },
  workshop: { icon: Calendar, color: "bg-purple-500/20 text-purple-400" },
  meetup: { icon: Users, color: "bg-green-500/20 text-green-400" },
};

export const EventManager = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const { events, createEvent, updateEvent, deleteEvent } = useAcademy();

  const sortedEvents = [...events].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const upcomingEvents = sortedEvents.filter(e => new Date(e.start_time) >= new Date());
  const pastEvents = sortedEvents.filter(e => new Date(e.start_time) < new Date());

  const handleSaveEvent = async (data: Partial<CommunityEvent>) => {
    if (editingEvent) await updateEvent.mutateAsync({ id: editingEvent.id, ...data });
    else await createEvent.mutateAsync(data);
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Delete this event?')) await deleteEvent.mutateAsync(eventId);
  };

  const EventRow = ({ event }: { event: CommunityEvent }) => {
    const config = eventTypeConfig[event.event_type] || eventTypeConfig.workshop;
    const Icon = config.icon;
    const startTime = new Date(event.start_time);
    const isPast = startTime < new Date();

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex items-center gap-4 p-4 rounded-xl border border-border/50", isPast ? "bg-muted/20 opacity-60" : "bg-muted/30")}>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", config.color)}><Icon className="w-6 h-6" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><h4 className="font-semibold text-foreground truncate">{event.title}</h4><Badge variant="outline" className={cn("capitalize text-xs", config.color)}>{event.event_type}</Badge></div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(startTime, 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{format(startTime, 'h:mm a')}</span>
          </div>
        </div>
        {event.meeting_url && <a href={event.meeting_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1"><Link2 className="w-4 h-4" />Link</a>}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(event); setShowEventModal(true); }}><Edit3 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold text-foreground">Event Manager</h3><p className="text-sm text-muted-foreground">Schedule and manage community events</p></div>
        <Button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground gap-2"><Plus className="w-4 h-4" />New Event</Button>
      </div>

      <GlassCard hover={false}>
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Upcoming Events ({upcomingEvents.length})</h4>
        {upcomingEvents.length > 0 ? <div className="space-y-3">{upcomingEvents.map(event => <EventRow key={event.id} event={event} />)}</div> : <div className="text-center py-8"><Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No upcoming events</p></div>}
      </GlassCard>

      {pastEvents.length > 0 && <GlassCard hover={false}><h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-muted-foreground" />Past Events ({pastEvents.length})</h4><div className="space-y-3">{pastEvents.slice(0, 5).map(event => <EventRow key={event.id} event={event} />)}</div></GlassCard>}

      <EventModal open={showEventModal} onOpenChange={setShowEventModal} event={editingEvent} onSave={handleSaveEvent} isLoading={createEvent.isPending || updateEvent.isPending} />
    </div>
  );
};

const EventModal = ({ open, onOpenChange, event, onSave, isLoading }: { open: boolean; onOpenChange: (open: boolean) => void; event: CommunityEvent | null; onSave: (data: Partial<CommunityEvent>) => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({ title: event?.title || "", description: event?.description || "", event_type: (event?.event_type || "zoom") as 'livestream' | 'zoom' | 'workshop' | 'meetup', start_time: event?.start_time ? format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm") : "", end_time: event?.end_time ? format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm") : "", meeting_url: event?.meeting_url || "", timezone: event?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone });
  useEffect(() => { if (event) setFormData({ title: event.title || "", description: event.description || "", event_type: event.event_type || "zoom", start_time: event.start_time ? format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm") : "", end_time: event.end_time ? format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm") : "", meeting_url: event.meeting_url || "", timezone: event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone }); else setFormData({ title: "", description: "", event_type: "zoom", start_time: "", end_time: "", meeting_url: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }); }, [event]);
  const handleSubmit = () => onSave({ ...formData, start_time: new Date(formData.start_time).toISOString(), end_time: new Date(formData.end_time).toISOString() });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader><DialogTitle className="text-foreground">{event ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Event title..." className="bg-muted/30 border-border/50" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Event description..." className="bg-muted/30 border-border/50" /></div>
          <div className="space-y-2"><Label>Event Type</Label><Select value={formData.event_type} onValueChange={(value: 'livestream' | 'zoom' | 'workshop' | 'meetup') => setFormData({ ...formData, event_type: value })}><SelectTrigger className="bg-muted/30 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="zoom">Zoom Meeting</SelectItem><SelectItem value="livestream">Livestream</SelectItem><SelectItem value="workshop">Workshop</SelectItem><SelectItem value="meetup">Meetup</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Time</Label><Input type="datetime-local" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="bg-muted/30 border-border/50" /></div>
            <div className="space-y-2"><Label>End Time</Label><Input type="datetime-local" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="bg-muted/30 border-border/50" /></div>
          </div>
          <div className="space-y-2"><Label>Meeting URL</Label><Input value={formData.meeting_url} onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })} placeholder="https://zoom.us/j/..." className="bg-muted/30 border-border/50" /></div>
          <div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button><Button onClick={handleSubmit} disabled={!formData.title || !formData.start_time || !formData.end_time || isLoading} className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground">{isLoading ? "Saving..." : "Save Event"}</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};