-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('student', 'mentor', 'admin');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role app_role DEFAULT 'student',
  interests TEXT[],
  stem_goals TEXT,
  portfolio_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study materials table
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  subject TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  tags TEXT[],
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  tags TEXT[],
  upvotes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum comments table
CREATE TABLE public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum votes table
CREATE TABLE public.forum_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vote_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create user points table
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common',
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  questions JSONB NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user quiz results table
CREATE TABLE public.user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshops table
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  meeting_link TEXT,
  tags TEXT[],
  is_recorded BOOLEAN DEFAULT false,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshop registrations table
CREATE TABLE public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workshop_id)
);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'scholarship', 'internship', 'volunteer'
  deadline DATE,
  eligibility TEXT[],
  tags TEXT[],
  external_url TEXT,
  amount TEXT,
  organization TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create user activity table for tracking engagement
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for study materials
CREATE POLICY "Anyone can view approved materials" ON public.study_materials FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view their own materials" ON public.study_materials FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Authenticated users can upload materials" ON public.study_materials FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update their own materials" ON public.study_materials FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can approve materials" ON public.study_materials FOR UPDATE USING (get_current_user_role() = 'admin');

-- Create RLS policies for forum
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Anyone can view comments" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can vote" ON public.forum_votes FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user data
CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view all points for leaderboard" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "System can update user points" ON public.user_points FOR ALL USING (true);

CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON public.badges FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view all user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can award badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- Create RLS policies for quizzes
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Mentors and admins can create quizzes" ON public.quizzes FOR INSERT WITH CHECK (get_current_user_role() IN ('mentor', 'admin'));

CREATE POLICY "Users can view their own quiz results" ON public.user_quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz results" ON public.user_quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for workshops
CREATE POLICY "Anyone can view workshops" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "Mentors and admins can create workshops" ON public.workshops FOR INSERT WITH CHECK (get_current_user_role() IN ('mentor', 'admin'));
CREATE POLICY "Mentors and admins can update workshops" ON public.workshops FOR UPDATE USING (get_current_user_role() IN ('mentor', 'admin'));

CREATE POLICY "Users can view their registrations" ON public.workshop_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for workshops" ON public.workshop_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their registrations" ON public.workshop_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for opportunities
CREATE POLICY "Anyone can view opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Admins can manage opportunities" ON public.opportunities FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can manage their bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view their activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can log activity" ON public.user_activity FOR INSERT WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('workshop-recordings', 'workshop-recordings', true);

-- Create storage policies
CREATE POLICY "Anyone can view study materials" ON storage.objects FOR SELECT USING (bucket_id = 'study-materials');
CREATE POLICY "Authenticated users can upload study materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'study-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view workshop recordings" ON storage.objects FOR SELECT USING (bucket_id = 'workshop-recordings');
CREATE POLICY "Mentors and admins can upload recordings" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'workshop-recordings' AND auth.role() = 'authenticated');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_points (user_id, points)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, rarity, points_required) VALUES
('Welcome Newcomer', 'Joined the STEMinist community', '👋', 'common', 0),
('Study Starter', 'Downloaded first study material', '📚', 'common', 10),
('Quiz Master', 'Completed 10 quizzes', '💡', 'rare', 100),
('Community Helper', 'Helped 5 students in forum', '🤝', 'rare', 150),
('STEM Queen', 'Earned 1000+ points', '👑', 'legendary', 1000),
('Workshop Warrior', 'Attended 5 workshops', '🎯', 'epic', 200),
('Mentor Badge', 'Active mentor in community', '🌟', 'special', 0);