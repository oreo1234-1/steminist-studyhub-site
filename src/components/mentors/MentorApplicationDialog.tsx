import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  { value: "college", label: "College STEM Student" },
  { value: "professional", label: "STEM Professional" },
  { value: "premed", label: "Pre-Med / Health Sciences" },
];

export function MentorApplicationDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    expertise: "",
    category: "",
    yearOrExperience: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to apply.", variant: "destructive" });
      return;
    }
    if (!form.name || !form.expertise || !form.category) {
      toast({ title: "Missing info", description: "Name, expertise, and category are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("mentors").insert({
        name: form.name,
        expertise: form.expertise,
        category: form.category,
        year_or_experience: form.yearOrExperience || null,
        description: form.description || null,
        user_id: user.id,
        type_label: CATEGORIES.find((c) => c.value === form.category)?.label || form.category,
        is_active: false, // pending admin approval
      });
      if (error) throw error;

      toast({ title: "Application submitted! 🎉", description: "We'll review your application and activate your profile." });
      setForm({ name: "", expertise: "", category: "", yearOrExperience: "", description: "" });
      setOpen(false);
    } catch (error: any) {
      console.error("Mentor application error:", error);
      toast({ title: "Error", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="w-full gap-2">
          <GraduationCap className="h-5 w-5" />
          Apply to Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair">Apply to Become a Mentor</DialogTitle>
          <DialogDescription>
            Share your STEM journey and inspire the next generation of women in STEM.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mentor-name">Full Name *</Label>
            <Input id="mentor-name" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label>Mentor Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentor-expertise">Area of Expertise *</Label>
            <Input id="mentor-expertise" placeholder="e.g., Organic Chemistry, Machine Learning" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentor-exp">Year / Experience Level</Label>
            <Input id="mentor-exp" placeholder="e.g., Junior, 3rd Year, 5+ years professional" value={form.yearOrExperience} onChange={(e) => setForm({ ...form, yearOrExperience: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentor-bio">About You</Label>
            <Textarea id="mentor-bio" placeholder="Tell us about your STEM journey, what motivates you, and how you'd like to help..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
