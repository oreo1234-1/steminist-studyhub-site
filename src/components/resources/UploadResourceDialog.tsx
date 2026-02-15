import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  { value: "guide", label: "Study Guide" },
  { value: "practice", label: "Practice Questions" },
  { value: "template", label: "Template / Worksheet" },
  { value: "toolkit", label: "STEM Toolkit" },
];

const SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Math", "Computer Science",
  "Engineering", "Environmental Science", "Anatomy", "Statistics",
  "Calculus", "Algebra", "Geometry", "AP/IB General", "Other"
];

const LEVELS = [
  { value: "middle-school", label: "Middle School" },
  { value: "high-school", label: "High School" },
  { value: "ap-ib", label: "AP / IB" },
  { value: "college", label: "College" },
];

interface Props {
  onUploaded?: () => void;
}

export function UploadResourceDialog({ onUploaded }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    level: "",
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to upload.", variant: "destructive" });
      return;
    }
    if (!form.file || !form.title || !form.category) {
      toast({ title: "Missing info", description: "Title, category, and file are required.", variant: "destructive" });
      return;
    }

    const allowedTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".jpg", ".jpeg", ".png"];
    const ext = "." + form.file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast({ title: "Invalid file type", description: "Upload PDF, Word, PowerPoint, text, or image files.", variant: "destructive" });
      return;
    }
    if (form.file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fileName = `${user.id}/${Date.now()}${ext}`;
      const { error: uploadError } = await supabase.storage.from("resources").upload(fileName, form.file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("resources").insert({
        title: form.title,
        description: form.description || null,
        category: form.category,
        subject: form.subject || null,
        level: form.level || null,
        file_url: fileName,
        uploaded_by: user.id,
        tags: [form.category, form.subject, form.level].filter(Boolean),
      });
      if (dbError) throw dbError;

      toast({ title: "Uploaded! 🎉", description: "Your resource is pending approval." });
      setForm({ title: "", description: "", category: "", subject: "", level: "", file: null });
      setOpen(false);
      onUploaded?.();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Upload className="h-5 w-5" />
          Upload Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair">Upload a Resource</DialogTitle>
          <DialogDescription>
            Share study guides, notes, or templates with the STEMinist community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="res-title">Title *</Label>
            <Input id="res-title" placeholder="e.g., AP Biology Chapter 5 Notes" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="res-desc">Description</Label>
            <Textarea id="res-desc" placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="res-file">File *</Label>
            <Input id="res-file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png" required />
            <p className="text-xs text-muted-foreground">PDF, Word, PowerPoint, text, or image (Max 10MB)</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
