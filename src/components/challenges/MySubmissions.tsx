import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, CheckCircle, AlertCircle, MessageSquare, ExternalLink, Star, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  draft: { label: "Draft", icon: FileText, color: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", icon: Clock, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  under_review: { label: "Under Review", icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  feedback_provided: { label: "Feedback Ready", icon: MessageSquare, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  approved: { label: "Approved", icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Needs Revision", icon: AlertCircle, color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("challenge_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setLoading(false);
  };

  const fetchFeedback = async (submissionId: string) => {
    const { data } = await supabase
      .from("submission_feedback")
      .select("*")
      .eq("submission_id", submissionId);

    if (data) {
      setFeedback(data);
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    fetchFeedback(submission.id);
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
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Sign in to view your submissions</p>
          <Button className="mt-4" onClick={() => window.location.href = "/auth"}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            My Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          My Submissions
        </CardTitle>
        <CardDescription>
          Track your challenge submissions and view mentor feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No submissions yet</p>
            <p className="text-sm text-muted-foreground">Join a challenge and submit your project!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Dialog key={submission.id}>
                <DialogTrigger asChild>
                  <div
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{submission.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {submission.challenge_type} Challenge
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.submitted_at
                          ? `Submitted ${new Date(submission.submitted_at).toLocaleDateString()}`
                          : `Created ${new Date(submission.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedSubmission?.title}</DialogTitle>
                    <DialogDescription>
                      Submission details and mentor feedback
                    </DialogDescription>
                  </DialogHeader>

                  {selectedSubmission && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {selectedSubmission.challenge_type} Challenge
                        </Badge>
                        <StatusBadge status={selectedSubmission.status} />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{selectedSubmission.description}</p>
                        </div>

                        {selectedSubmission.project_links?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Project Links</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedSubmission.project_links.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {new URL(link).hostname}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedSubmission.file_urls?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Attached Files</p>
                            <p className="text-sm">{selectedSubmission.file_urls.length} file(s) uploaded</p>
                          </div>
                        )}
                      </div>

                      {/* Feedback Section */}
                      {feedback.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Mentor Feedback
                          </h4>
                          {feedback.map((fb) => (
                            <div key={fb.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
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
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
