import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Link, FileText, CheckCircle, Clock, AlertCircle, X, Plus, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string | number;
  title: string;
  type: "monthly" | "hackathon" | "design";
}

interface Submission {
  id: string;
  title: string;
  description: string;
  project_links: string[];
  file_urls: string[];
  status: string;
  submitted_at: string | null;
  created_at: string;
  challenge_id: string;
  challenge_type: string;
}

interface Feedback {
  id: string;
  rating: number | null;
  feedback_text: string;
  strengths: string[];
  improvements: string[];
  created_at: string;
  mentor_id: string;
}

interface SubmissionPortalProps {
  challenge: Challenge;
  onSubmissionComplete?: () => void;
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  draft: { label: "Draft", icon: FileText, color: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", icon: Clock, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  under_review: { label: "Under Review", icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  feedback_provided: { label: "Feedback Ready", icon: MessageSquare, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  approved: { label: "Approved", icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Needs Revision", icon: AlertCircle, color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export const SubmissionPortal = ({ challenge, onSubmissionComplete }: SubmissionPortalProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectLinks, setProjectLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [viewMode, setViewMode] = useState<"submit" | "status">("submit");

  const fetchExistingSubmission = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("challenge_submissions")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_id", String(challenge.id))
      .maybeSingle();

    if (data && !error) {
      setExistingSubmission(data);
      setTitle(data.title);
      setDescription(data.description);
      setProjectLinks(data.project_links?.length ? data.project_links : [""]);
      setViewMode("status");

      // Fetch feedback if exists
      const { data: feedbackData } = await supabase
        .from("submission_feedback")
        .select("*")
        .eq("submission_id", data.id);

      if (feedbackData) {
        setFeedback(feedbackData);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchExistingSubmission();
    } else {
      // Reset form when closing
      if (!existingSubmission) {
        setTitle("");
        setDescription("");
        setProjectLinks([""]);
        setFiles([]);
      }
      setViewMode(existingSubmission ? "status" : "submit");
    }
  };

  const addProjectLink = () => {
    setProjectLinks([...projectLinks, ""]);
  };

  const removeProjectLink = (index: number) => {
    setProjectLinks(projectLinks.filter((_, i) => i !== index));
  };

  const updateProjectLink = (index: number, value: string) => {
    const updated = [...projectLinks];
    updated[index] = value;
    setProjectLinks(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          toast.error(`File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });
      setFiles([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!user || files.length === 0) return [];

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const filePath = `${user.id}/${challenge.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("challenge-submissions")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
      } else {
        uploadedUrls.push(filePath);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!user) {
      toast.error("Please sign in to submit");
      return;
    }

    if (!asDraft && (!title.trim() || !description.trim())) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedFileUrls = await uploadFiles();
      const validLinks = projectLinks.filter(link => link.trim());

      const submissionData = {
        user_id: user.id,
        challenge_id: String(challenge.id),
        challenge_type: challenge.type,
        title: title.trim(),
        description: description.trim(),
        project_links: validLinks,
        file_urls: existingSubmission 
          ? [...(existingSubmission.file_urls || []), ...uploadedFileUrls]
          : uploadedFileUrls,
        status: asDraft ? "draft" : "submitted",
        submitted_at: asDraft ? null : new Date().toISOString(),
      };

      let result;
      if (existingSubmission) {
        result = await supabase
          .from("challenge_submissions")
          .update(submissionData)
          .eq("id", existingSubmission.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("challenge_submissions")
          .insert(submissionData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setExistingSubmission(result.data);
      setFiles([]);
      setViewMode("status");
      toast.success(asDraft ? "Draft saved successfully" : "Submission completed successfully!");
      onSubmissionComplete?.();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Submit Entry</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
            <DialogDescription>
              Please sign in to submit your project entry for this challenge.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => window.location.href = "/auth"}>
            Sign In
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          {existingSubmission ? "View Submission" : "Submit Entry"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{challenge.title}</DialogTitle>
          <DialogDescription>
            {viewMode === "status" ? "View your submission status and feedback" : "Submit your project entry"}
          </DialogDescription>
        </DialogHeader>

        {viewMode === "status" && existingSubmission ? (
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Submission Status</CardTitle>
                  <StatusBadge status={existingSubmission.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Project Title</Label>
                  <p className="font-medium">{existingSubmission.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{existingSubmission.description}</p>
                </div>
                {existingSubmission.project_links?.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Project Links</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {existingSubmission.project_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Link className="w-3 h-3" />
                          {new URL(link).hostname}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {existingSubmission.file_urls?.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Uploaded Files</Label>
                    <p className="text-sm">{existingSubmission.file_urls.length} file(s) attached</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {existingSubmission.submitted_at 
                    ? `Submitted on ${new Date(existingSubmission.submitted_at).toLocaleDateString()}`
                    : `Last updated ${new Date(existingSubmission.created_at).toLocaleDateString()}`}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {feedback.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Mentor Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedback.map((fb) => (
                    <div key={fb.id} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                      {fb.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < fb.rating! ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-sm">{fb.feedback_text}</p>
                      {fb.strengths?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Strengths:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside">
                            {fb.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {fb.improvements?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Areas for Improvement:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside">
                            {fb.improvements.map((i, idx) => (
                              <li key={idx}>{i}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Reviewed on {new Date(fb.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Edit Button for drafts */}
            {existingSubmission.status === "draft" && (
              <Button onClick={() => setViewMode("submit")} className="w-full">
                Edit & Submit
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your project title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, approach, and key features..."
                rows={4}
              />
            </div>

            {/* Project Links */}
            <div className="space-y-2">
              <Label>Project Links (GitHub, Demo, etc.)</Label>
              {projectLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={link}
                      onChange={(e) => updateProjectLink(index, e.target.value)}
                      placeholder="https://github.com/..."
                      className="pl-10"
                    />
                  </div>
                  {projectLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProjectLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProjectLink}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Link
              </Button>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Project Files (Max 10MB each)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.fig,.sketch"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload files
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, ZIP, Images, Design files
                  </span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="space-y-2 mt-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Submitting..." : "Submit Entry"}
              </Button>
            </div>

            {existingSubmission && (
              <Button
                variant="ghost"
                onClick={() => setViewMode("status")}
                className="w-full"
              >
                Back to Status
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
