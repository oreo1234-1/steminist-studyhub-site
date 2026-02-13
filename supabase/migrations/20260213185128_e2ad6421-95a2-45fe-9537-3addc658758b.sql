
-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'social',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  speakers TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  duration TEXT,
  meeting_link TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Mentors and admins can manage events" ON public.events FOR INSERT
  WITH CHECK (get_current_user_role() = ANY (ARRAY['mentor'::app_role, 'admin'::app_role]));
CREATE POLICY "Mentors and admins can update events" ON public.events FOR UPDATE
  USING (get_current_user_role() = ANY (ARRAY['mentor'::app_role, 'admin'::app_role]));

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their registrations" ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel registration" ON public.event_registrations FOR DELETE
  USING (auth.uid() = user_id);

-- Mentors table
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  expertise TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'college',
  year_or_experience TEXT,
  description TEXT,
  type_label TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active mentors" ON public.mentors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage mentors" ON public.mentors FOR ALL
  USING (get_current_user_role() = 'admin'::app_role);

-- Mentorship requests
CREATE TABLE public.mentorship_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON public.mentorship_requests FOR SELECT
  USING (auth.uid() = student_id);
CREATE POLICY "Users can create requests" ON public.mentorship_requests FOR INSERT
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update their pending requests" ON public.mentorship_requests FOR UPDATE
  USING (auth.uid() = student_id AND status = 'pending');

-- Resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'guide',
  subject TEXT,
  level TEXT,
  file_url TEXT,
  external_url TEXT,
  downloads_count INTEGER DEFAULT 0,
  question_count INTEGER,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved resources" ON public.resources FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view their own resources" ON public.resources FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Authenticated users can upload resources" ON public.resources FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL
  USING (get_current_user_role() = 'admin'::app_role);

-- Leadership applications
CREATE TABLE public.leadership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  position TEXT NOT NULL,
  statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

ALTER TABLE public.leadership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" ON public.leadership_applications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can submit applications" ON public.leadership_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON public.leadership_applications FOR SELECT
  USING (get_current_user_role() = 'admin'::app_role);
CREATE POLICY "Admins can update applications" ON public.leadership_applications FOR UPDATE
  USING (get_current_user_role() = 'admin'::app_role);

-- Seed events data
INSERT INTO public.events (title, description, event_type, date, location, max_attendees, current_attendees, speakers, tags) VALUES
('Women in Tech Leadership Panel', 'Hear from inspiring women leaders about their journeys in technology and innovation.', 'speaker', '2026-03-05 18:00:00+00', 'Virtual (Zoom)', 100, 45, ARRAY['Dr. Maria Chen - Google AI', 'Sarah Williams - NASA', 'Prof. Aisha Johnson - MIT'], ARRAY['Leadership', 'Tech']),
('Breaking Barriers in Biotech', 'Learn about cutting-edge biotechnology research and career paths in the field.', 'speaker', '2026-03-12 17:00:00+00', 'Virtual (Zoom)', 75, 32, ARRAY['Dr. Elena Rodriguez - Moderna'], ARRAY['Biotech', 'Research']),
('Climate Science & Engineering Solutions', 'Explore how engineering innovations are addressing climate challenges.', 'speaker', '2026-03-18 16:00:00+00', 'Virtual (Zoom)', 80, 28, ARRAY['Dr. Keisha Brown - Tesla', 'Prof. Yuki Tanaka - Stanford'], ARRAY['Climate', 'Engineering']),
('AP Chemistry Study Marathon', 'Group study session with practice problems, concept reviews, and peer support.', 'study', '2026-03-07 18:00:00+00', 'Virtual Study Rooms', 30, 18, '{}', ARRAY['Chemistry', 'AP Prep']),
('Calculus Crash Course', 'Focus on derivatives, integrals, and applications with group problem-solving.', 'study', '2026-03-10 19:00:00+00', 'Virtual Study Rooms', 35, 22, '{}', ARRAY['Mathematics', 'Calculus']),
('Physics Lab Prep Session', 'Prepare for physics lab practicals with demonstrations and Q&A.', 'study', '2026-03-14 17:00:00+00', 'Virtual Study Rooms', 25, 15, '{}', ARRAY['Physics', 'Lab Skills']),
('Build a Weather Station', 'Collaborative engineering project to design and build IoT weather monitoring stations.', 'project', '2026-03-01 14:00:00+00', 'Virtual + Local Meetups', 20, 12, '{}', ARRAY['Engineering', 'Programming', 'Electronics']),
('Community Water Quality Analysis', 'Scientific research project testing local water sources and analyzing data.', 'project', '2026-03-01 15:00:00+00', 'Virtual + Field Work', 15, 8, '{}', ARRAY['Chemistry', 'Data Analysis', 'Research']),
('STEM Game Night', 'Fun evening with science trivia, math puzzles, and coding challenges!', 'social', '2026-03-08 19:00:00+00', 'Virtual (Discord)', 50, 35, '{}', ARRAY['Fun', 'Trivia']),
('Coffee Chat: Women in Engineering', 'Casual conversation about experiences, challenges, and successes in engineering.', 'social', '2026-03-15 11:00:00+00', 'Virtual (Zoom)', 20, 12, '{}', ARRAY['Networking', 'Engineering']);

-- Seed mentors data
INSERT INTO public.mentors (name, expertise, category, year_or_experience, description, type_label) VALUES
('Sofia Martinez', 'Computer Science Major - MIT', 'college', 'Senior', 'Software engineering intern at Meta, specializing in full-stack development and AI.', 'College Student'),
('Priya Sharma', 'Biomedical Engineering - Stanford', 'college', 'Junior', 'Research assistant in medical device innovation, pre-med track advisor.', 'College Student'),
('Emma Thompson', 'Environmental Science - UC Berkeley', 'college', 'Senior', 'Climate research lab member, passionate about sustainable technology solutions.', 'College Student'),
('Maya Chen', 'Mathematics & Data Science - Carnegie Mellon', 'college', 'Graduate Student', 'Machine learning researcher, mentoring undergrads in advanced mathematics.', 'College Student'),
('Dr. Sarah Johnson', 'Senior Software Engineer - Google', 'professional', '12 years', 'Tech lead for AI/ML products, mentoring women entering software engineering.', 'Tech Professional'),
('Dr. Aisha Patel', 'Principal Researcher - Biotech Startup', 'professional', '10 years', 'Leading clinical trials for gene therapy, advising pre-med and biotech students.', 'Biotech Professional'),
('Prof. Maria Rodriguez', 'Mechanical Engineer - NASA', 'professional', '15 years', 'Aerospace systems designer, guiding students interested in engineering careers.', 'Engineering Professional'),
('Dr. Rachel Kim', 'Data Science Director - Healthcare AI', 'professional', '8 years', 'Building predictive models for patient care, mentoring aspiring data scientists.', 'Healthcare Professional'),
('Dr. Jennifer Lee', 'Emergency Medicine Physician', 'premed', '7 years clinical practice', 'Advising on medical school preparation, MCAT study strategies, and clinical experiences.', 'Pre-Med Guide'),
('Dr. Fatima Hassan', 'Pediatric Surgeon', 'premed', '9 years post-residency', 'Guiding students through surgical pathways, medical ethics, and specialty selection.', 'Pre-Med Guide'),
('Dr. Amanda Wright', 'Public Health Researcher', 'premed', '6 years MD/PhD program', 'Supporting students combining medicine with research, global health interests.', 'Pre-Med Guide');

-- Seed resources data
INSERT INTO public.resources (title, description, category, subject, level, downloads_count, is_approved) VALUES
('AP Biology Complete Study Guide', 'Comprehensive review of all AP Biology topics', 'guide', 'Biology', 'AP', 2847, true),
('Calculus BC Formula Sheet & Practice', 'Essential formulas and practice problems', 'guide', 'Mathematics', 'AP', 3102, true),
('Physics 1 & 2 Concept Review', 'In-depth concept review for AP Physics', 'guide', 'Physics', 'AP', 1956, true),
('Chemistry Problem-Solving Strategies', 'Step-by-step problem solving techniques', 'guide', 'Chemistry', 'AP', 2234, true),
('IB Math HL Revision Notes', 'Complete revision notes for IB Math HL', 'guide', 'Mathematics', 'IB', 1478, true),
('IB Biology Extended Essay Guide', 'Guide to writing IB Biology extended essays', 'guide', 'Biology', 'IB', 987, true),
('AP Calculus BC Practice Test Bank', '200+ practice questions with solutions', 'practice', 'Mathematics', 'AP', 0, true),
('Organic Chemistry Reaction Practice', '150 reaction mechanism problems', 'practice', 'Chemistry', null, 0, true),
('AP Physics Multiple Choice Set', '180 multiple choice practice questions', 'practice', 'Physics', 'AP', 0, true),
('Biology Cell & Molecular Practice', '120 cell biology practice questions', 'practice', 'Biology', null, 0, true),
('STEM Flashcard Template (Anki-Compatible)', 'Ready-to-use flashcard template', 'template', null, null, 0, true),
('Lab Report Writing Template', 'Standard lab report format template', 'template', null, null, 0, true),
('Research Paper Outline Template', 'Academic research paper structure', 'template', null, null, 0, true),
('Cornell Notes for STEM Subjects', 'Cornell note-taking system template', 'template', null, null, 0, true),
('Python Programming Starter Kit', 'Essential libraries, tutorials, and project ideas', 'toolkit', 'Coding', null, 0, true),
('Pre-Med Student Roadmap', 'Timeline, prerequisites, volunteering, and MCAT prep', 'toolkit', 'Medicine', null, 0, true),
('Engineering Design Process Guide', 'Step-by-step framework for design challenges', 'toolkit', 'Engineering', null, 0, true),
('Data Science Toolkit', 'R, Python, visualization tools, and datasets', 'toolkit', 'Technology', null, 0, true);
