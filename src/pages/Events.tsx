import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Mic, Coffee, Lightbulb, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  date: string;
  location: string | null;
  max_attendees: number | null;
  current_attendees: number | null;
  speakers: string[] | null;
  tags: string[] | null;
  skills: string[] | null;
  duration: string | null;
}

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
    if (!error && data) setEvents(data as EventRow[]);

    if (user) {
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("user_id", user.id);
      if (regs) setRegisteredIds(new Set(regs.map((r: any) => r.event_id)));
    }
    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to register for events." });
      return;
    }
    setRegisteringId(eventId);
    if (registeredIds.has(eventId)) {
      await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", user.id);
      setRegisteredIds((prev) => { const n = new Set(prev); n.delete(eventId); return n; });
      toast({ title: "Registration cancelled" });
    } else {
      const { error } = await supabase.from("event_registrations").insert({ event_id: eventId, user_id: user.id });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setRegisteredIds((prev) => new Set(prev).add(eventId));
        toast({ title: "Registered!", description: "You're signed up for this event." });
      }
    }
    setRegisteringId(null);
  };

  const filterByType = (type: string) => events.filter((e) => e.event_type === type);

  const renderEventCard = (event: EventRow) => {
    const isRegistered = registeredIds.has(event.id);
    return (
      <Card key={event.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
        <CardHeader>
          <Badge className="w-fit mb-2">{event.event_type}</Badge>
          <CardTitle className="font-playfair text-xl">{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleTimeString("en-US", { timeStyle: "short" })}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.current_attendees ?? 0}/{event.max_attendees} registered</span>
              </div>
            )}
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Featured Speakers:</p>
              <div className="flex flex-wrap gap-1">
                {event.speakers.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((t, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
          )}

          <Button
            className="w-full"
            variant={isRegistered ? "outline" : "default"}
            disabled={registeringId === event.id}
            onClick={() => handleRegister(event.id)}
          >
            {registeringId === event.id ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isRegistered ? "Cancel Registration" : "Register for Event"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community Events 🌟
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Connect with guest speakers, join study nights, collaborate on STEM projects,
            and build lasting friendships with your STEM sisters!
          </p>
        </div>

        <Tabs defaultValue="speakers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="speakers">Guest Speakers</TabsTrigger>
            <TabsTrigger value="study">Study Nights</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="speakers" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Mic className="h-6 w-6" /> Inspiring Guest Speakers
                </CardTitle>
                <CardDescription>Learn from accomplished women in STEM fields</CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterByType("speaker").map(renderEventCard)}
            </div>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <Card className="border-2 border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Coffee className="h-6 w-6" /> Group Study Nights
                </CardTitle>
                <CardDescription>Join focused study sessions with peers</CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("study").map(renderEventCard)}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border-2 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" /> Collaborative STEM Projects
                </CardTitle>
                <CardDescription>Work together on real-world projects</CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterByType("project").map(renderEventCard)}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Users className="h-6 w-6" /> Social & Networking Events
                </CardTitle>
                <CardDescription>Build friendships and connections</CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("social").map(renderEventCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
