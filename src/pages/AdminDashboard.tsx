import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Loader2, ShieldCheck, FileText, GraduationCap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface PendingResource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subject: string | null;
  level: string | null;
  created_at: string | null;
  uploaded_by: string | null;
}

interface PendingMentor {
  id: string;
  name: string;
  expertise: string;
  category: string;
  description: string | null;
  year_or_experience: string | null;
  type_label: string | null;
  created_at: string | null;
  user_id: string | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<PendingResource[]>([]);
  const [mentors, setMentors] = useState<PendingMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const checkAdminAndFetch = async () => {
      const { data: roleData } = await supabase.rpc("get_current_user_role");
      if (roleData !== "admin") {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const [resResult, mentorResult] = await Promise.all([
        supabase.from("resources").select("*").eq("is_approved", false),
        supabase.from("mentors").select("*").eq("is_active", false),
      ]);

      if (resResult.data) setResources(resResult.data as PendingResource[]);
      if (mentorResult.data) setMentors(mentorResult.data as PendingMentor[]);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [user]);

  const approveResource = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("resources").update({ is_approved: true }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResources(prev => prev.filter(r => r.id !== id));
      toast({ title: "Approved ✓", description: "Resource is now visible to all users." });
    }
    setActionLoading(null);
  };

  const rejectResource = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResources(prev => prev.filter(r => r.id !== id));
      toast({ title: "Rejected", description: "Resource has been removed." });
    }
    setActionLoading(null);
  };

  const approveMentor = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("mentors").update({ is_active: true }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMentors(prev => prev.filter(m => m.id !== id));
      toast({ title: "Approved ✓", description: "Mentor profile is now live." });
    }
    setActionLoading(null);
  };

  const rejectMentor = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from("mentors").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMentors(prev => prev.filter(m => m.id !== id));
      toast({ title: "Rejected", description: "Mentor application removed." });
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md"><CardHeader><CardTitle>Sign In Required</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Please sign in to access the admin dashboard.</p></CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md"><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">You do not have admin privileges.</p></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard - STEMinist</title>
        <meta name="description" content="Admin dashboard for reviewing and approving resources and mentor applications." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-playfair text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and approve community submissions.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Card className="border-2 border-accent/30">
            <CardHeader className="pb-2">
              <CardDescription>Pending Resources</CardDescription>
              <CardTitle className="text-3xl font-playfair">{resources.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription>Pending Mentor Applications</CardDescription>
              <CardTitle className="text-3xl font-playfair">{mentors.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="resources">
          <TabsList className="mb-6">
            <TabsTrigger value="resources" className="gap-2"><FileText className="h-4 w-4" /> Resources ({resources.length})</TabsTrigger>
            <TabsTrigger value="mentors" className="gap-2"><GraduationCap className="h-4 w-4" /> Mentors ({mentors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            {resources.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No pending resources to review.</CardContent></Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          {r.title}
                          {r.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.description}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                        <TableCell>{r.subject || "—"}</TableCell>
                        <TableCell>{r.level || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => approveResource(r.id)} disabled={actionLoading === r.id} className="gap-1">
                              {actionLoading === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />} Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectResource(r.id)} disabled={actionLoading === r.id} className="gap-1">
                              <XCircle className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mentors">
            {mentors.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No pending mentor applications.</CardContent></Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentors.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">
                          {m.name}
                          {m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.description}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{m.type_label || m.category}</Badge></TableCell>
                        <TableCell>{m.expertise}</TableCell>
                        <TableCell>{m.year_or_experience || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => approveMentor(m.id)} disabled={actionLoading === m.id} className="gap-1">
                              {actionLoading === m.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />} Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectMentor(m.id)} disabled={actionLoading === m.id} className="gap-1">
                              <XCircle className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
