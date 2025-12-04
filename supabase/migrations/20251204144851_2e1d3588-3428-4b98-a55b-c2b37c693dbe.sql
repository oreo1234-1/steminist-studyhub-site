-- Create challenge_submissions table
CREATE TABLE public.challenge_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('monthly', 'hackathon', 'design')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_links TEXT[] DEFAULT '{}',
  file_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'feedback_provided', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submission_feedback table for mentor reviews
CREATE TABLE public.submission_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.challenge_submissions(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge_submissions
CREATE POLICY "Users can view their own submissions"
  ON public.challenge_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions"
  ON public.challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.challenge_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own draft submissions"
  ON public.challenge_submissions FOR DELETE
  USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Mentors can view submissions for review"
  ON public.challenge_submissions FOR SELECT
  USING (get_current_user_role() IN ('mentor', 'admin'));

-- RLS policies for submission_feedback
CREATE POLICY "Users can view feedback on their submissions"
  ON public.submission_feedback FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.challenge_submissions cs
    WHERE cs.id = submission_feedback.submission_id AND cs.user_id = auth.uid()
  ));

CREATE POLICY "Mentors can create feedback"
  ON public.submission_feedback FOR INSERT
  WITH CHECK (get_current_user_role() IN ('mentor', 'admin') AND auth.uid() = mentor_id);

CREATE POLICY "Mentors can view all feedback"
  ON public.submission_feedback FOR SELECT
  USING (get_current_user_role() IN ('mentor', 'admin'));

CREATE POLICY "Mentors can update their own feedback"
  ON public.submission_feedback FOR UPDATE
  USING (auth.uid() = mentor_id);

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-submissions', 'challenge-submissions', false);

-- Storage policies
CREATE POLICY "Users can upload submission files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'challenge-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own submission files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'challenge-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own submission files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'challenge-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Mentors can view submission files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'challenge-submissions' AND get_current_user_role() IN ('mentor', 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_challenge_submissions_updated_at
  BEFORE UPDATE ON public.challenge_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();