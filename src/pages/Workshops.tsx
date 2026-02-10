import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Workshops = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch workshops
  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user registrations
  const { data: userRegistrations = [] } = useQuery({
    queryKey: ["workshopRegistrations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("workshop_registrations")
        .select("workshop_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map(r => r.workshop_id);
    },
    enabled: !!user,
  });

  // Register mutation
  const register = useMutation({
    mutationFn: async (workshopId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("workshop_registrations").insert({
        workshop_id: workshopId,
        user_id: user.id,
      });
      if (error) throw error;

      // Update participant count
      const workshop = workshops.find(w => w.id === workshopId);
      if (workshop) {
        await supabase.from("workshops").update({
          current_participants: (workshop.current_participants || 0) + 1,
        }).eq("id", workshopId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["workshopRegistrations"] });
      toast({ title: "Registered! 🎉", description: "You've been registered for this workshop." });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const now = new Date();
  const upcomingWorkshops = workshops.filter(w => new Date(w.scheduled_at) >= now);
  const pastWorkshops = workshops.filter(w => new Date(w.scheduled_at) < now);

  const renderWorkshopCard = (workshop: any) => {
    const isRegistered = userRegistrations.includes(workshop.id);
    const isFull = workshop.max_participants && workshop.current_participants >= workshop.max_participants;
    const isPast = new Date(workshop.scheduled_at) < now;
    const spotsLeft = workshop.max_participants ? workshop.max_participants - (workshop.current_participants || 0) : null;

    return (
      <Card key={workshop.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-playfair">{workshop.title}</CardTitle>
            {isPast ? (
              <Badge variant="secondary">Past</Badge>
            ) : isFull ? (
              <Badge variant="destructive">Full</Badge>
            ) : (
              <Badge>Upcoming</Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(workshop.scheduled_at), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(workshop.scheduled_at), "h:mm a")}
              {workshop.duration_minutes && ` (${workshop.duration_minutes} min)`}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workshop.description && (
            <p className="text-muted-foreground text-sm">{workshop.description}</p>
          )}
          {workshop.instructor_name && (
            <p className="text-sm"><span className="font-medium">Instructor:</span> {workshop.instructor_name}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {workshop.current_participants || 0}
              {workshop.max_participants ? ` / ${workshop.max_participants}` : ""} registered
              {spotsLeft !== null && spotsLeft > 0 && ` (${spotsLeft} spots left)`}
            </span>
          </div>
          {workshop.tags && workshop.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workshop.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          {isPast ? (
            workshop.recording_url ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => window.open(workshop.recording_url, "_blank")}
              >
                Watch Recording
              </Button>
            ) : (
              <Button className="w-full" variant="outline" disabled>
                Event Ended
              </Button>
            )
          ) : isRegistered ? (
            <div className="space-y-2">
              <Badge className="w-full justify-center py-2">✅ Registered</Badge>
              {workshop.meeting_link && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open(workshop.meeting_link, "_blank")}
                >
                  Join Meeting
                </Button>
              )}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                if (!user) {
                  toast({ title: "Sign in to register", variant: "destructive" });
                  navigate("/auth");
                  return;
                }
                register.mutate(workshop.id);
              }}
              disabled={isFull || register.isPending}
            >
              {register.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</>
              ) : (
                "Register Now"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hands-On STEM Workshops 🔬
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Coding labs, engineering builds, medical case studies, and more.
            Build real skills through hands-on experimentation and expert guidance.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Upcoming Workshops */}
            <div className="mb-12">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
                Upcoming Workshops ({upcomingWorkshops.length})
              </h2>
              {upcomingWorkshops.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {upcomingWorkshops.map(renderWorkshopCard)}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No upcoming workshops scheduled. Check back soon!</p>
                </Card>
              )}
            </div>

            {/* Past Workshops */}
            {pastWorkshops.length > 0 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
                  Past Workshops ({pastWorkshops.length})
                </h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  {pastWorkshops.map(renderWorkshopCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Workshops;
