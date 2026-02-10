import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, BookOpen, Plus, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const StudyPods = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newPod, setNewPod] = useState({ name: "", subject: "", description: "" });

  // Fetch study groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["studyGroups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_groups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch member counts
      const groupIds = (data || []).map(g => g.id);
      const memberCounts = new Map<string, number>();
      if (groupIds.length) {
        const { data: members } = await supabase
          .from("group_members")
          .select("group_id");
        if (members) {
          members.forEach(m => {
            memberCounts.set(m.group_id, (memberCounts.get(m.group_id) || 0) + 1);
          });
        }
      }

      return (data || []).map(g => ({
        ...g,
        member_count: memberCounts.get(g.id) || 0,
      }));
    },
  });

  // Fetch user's memberships
  const { data: userMemberships = [] } = useQuery({
    queryKey: ["userMemberships", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map(m => m.group_id);
    },
    enabled: !!user,
  });

  // Create group mutation
  const createGroup = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("study_groups").insert({
        name: newPod.name,
        subject: newPod.subject || null,
        description: newPod.description || null,
        owner_id: user.id,
        is_public: true,
      }).select().single();
      if (error) throw error;

      // Auto-join as owner
      await supabase.from("group_members").insert({
        group_id: data.id,
        user_id: user.id,
        role: "owner",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      queryClient.invalidateQueries({ queryKey: ["userMemberships"] });
      setCreateOpen(false);
      setNewPod({ name: "", subject: "", description: "" });
      toast({ title: "Study Pod created! 🎉" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  // Join group mutation
  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
        role: "member",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      queryClient.invalidateQueries({ queryKey: ["userMemberships"] });
      toast({ title: "Joined the pod! 🎉" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  // Leave group mutation
  const leaveGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      queryClient.invalidateQueries({ queryKey: ["userMemberships"] });
      toast({ title: "Left the pod" });
    },
  });

  const filteredGroups = groups.filter(g => {
    const matchesSubject = subjectFilter === "all" || g.subject === subjectFilter;
    const matchesSearch = !searchQuery || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.subject || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const subjects = [...new Set(groups.map(g => g.subject).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Study Pods 👥
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Join small-group study sessions for core STEM subjects.
            Collaborate, learn, and grow together with fellow STEM sisters!
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Study Pod
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search pods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(s => (
                    <SelectItem key={s} value={s!}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredGroups.map((group) => {
              const isMember = userMemberships.includes(group.id);
              const isOwner = group.owner_id === user?.id;
              return (
                <Card key={group.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      {group.subject && <Badge variant="secondary">{group.subject}</Badge>}
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {group.member_count} members
                      </Badge>
                    </div>
                    <CardTitle className="font-playfair text-xl">{group.name}</CardTitle>
                    {group.description && (
                      <CardDescription>{group.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isOwner ? (
                      <Badge className="w-full justify-center py-2">You own this pod</Badge>
                    ) : isMember ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => leaveGroup.mutate(group.id)}
                        disabled={leaveGroup.isPending}
                      >
                        Leave Pod
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (!user) {
                            toast({ title: "Sign in to join", variant: "destructive" });
                            navigate("/auth");
                            return;
                          }
                          joinGroup.mutate(group.id);
                        }}
                        disabled={joinGroup.isPending}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Join Pod
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filteredGroups.length === 0 && (
          <Card className="p-8 text-center mb-8">
            <p className="text-muted-foreground">No study pods found. Create one below!</p>
          </Card>
        )}

        {/* Create Pod */}
        <Card className="border-2 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl">Create Your Own Study Pod</CardTitle>
            <CardDescription>
              Start your own study pod and invite others to join!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Sign in to create a pod", variant: "destructive" });
                      navigate("/auth");
                      return;
                    }
                    setCreateOpen(true);
                  }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Pod
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Study Pod</DialogTitle>
                  <DialogDescription>Set up a new study group for your community.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pod Name *</Label>
                    <Input
                      placeholder="e.g., AP Calculus Study Group"
                      value={newPod.name}
                      onChange={(e) => setNewPod(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="e.g., Mathematics, Physics, CS"
                      value={newPod.subject}
                      onChange={(e) => setNewPod(p => ({ ...p, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="What will this pod focus on?"
                      value={newPod.description}
                      onChange={(e) => setNewPod(p => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => createGroup.mutate()}
                    disabled={!newPod.name.trim() || createGroup.isPending}
                  >
                    {createGroup.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>
                    ) : (
                      "Create Pod"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPods;
