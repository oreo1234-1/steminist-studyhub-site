import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase, HeartPulse, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface MentorRow {
  id: string;
  name: string;
  expertise: string;
  category: string;
  year_or_experience: string | null;
  description: string | null;
  type_label: string | null;
}

const Mentors = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    supabase.from("mentors").select("*").then(({ data }) => {
      if (data) setMentors(data as MentorRow[]);
      setLoading(false);
    });
  }, []);

  const handleRequestMentorship = async () => {
    if (!user || !selectedMentor) {
      toast({ title: "Please sign in", description: "You need to be logged in to request mentorship." });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("mentorship_requests").insert({
      mentor_id: selectedMentor,
      student_id: user.id,
      message: requestMessage,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request sent!", description: "Your mentorship request has been submitted." });
      setDialogOpen(false);
      setRequestMessage("");
    }
    setSubmitting(false);
  };

  const filterByCategory = (cat: string) => mentors.filter((m) => m.category === cat);

  const renderMentorCards = (filtered: MentorRow[]) => (
    <div className="grid md:grid-cols-2 gap-6">
      {filtered.map((mentor) => (
        <Card key={mentor.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="font-playfair text-xl">{mentor.name}</CardTitle>
              <Badge variant="secondary">{mentor.type_label}</Badge>
            </div>
            <CardDescription className="font-semibold text-primary">{mentor.expertise}</CardDescription>
            <CardDescription className="text-sm">{mentor.year_or_experience}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">{mentor.description}</p>
            <Dialog open={dialogOpen && selectedMentor === mentor.id} onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) setSelectedMentor(mentor.id);
            }}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">Request Mentorship</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Mentorship from {mentor.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Tell the mentor about your goals and what you'd like guidance on..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleRequestMentorship} disabled={submitting || !requestMessage.trim()} className="w-full">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
            Mentorship Program 🌟
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with college STEM majors, women in professional STEM fields, and pre-med guides.
            Get personalized guidance, career insights, and support.
          </p>
        </div>

        <Tabs defaultValue="college" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="college" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> College Mentors
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> STEM Professionals
            </TabsTrigger>
            <TabsTrigger value="premed" className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" /> Pre-Med Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="college">{renderMentorCards(filterByCategory("college"))}</TabsContent>
          <TabsContent value="professionals">{renderMentorCards(filterByCategory("professional"))}</TabsContent>
          <TabsContent value="premed">{renderMentorCards(filterByCategory("premed"))}</TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Users className="h-5 w-5" /> Mentorship Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• One-on-one guidance tailored to your goals</li>
                <li>• Career pathway advice and insights</li>
                <li>• College application support</li>
                <li>• Research and internship connections</li>
                <li>• Monthly check-ins and accountability</li>
                <li>• Portfolio and resume reviews</li>
                <li>• Industry networking opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-muted">
            <CardHeader>
              <CardTitle className="font-playfair">Become a Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Are you a college STEM student or professional? Share your journey and inspire the next generation.
              </p>
              <Button size="lg" variant="secondary" className="w-full">Apply to Mentor</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
