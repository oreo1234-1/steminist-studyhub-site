-- Core utility: updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PROFILES (publicly viewable display info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GAMIFICATION: XP activities and user points/levels
CREATE TABLE IF NOT EXISTS public.xp_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 0),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own xp activities" ON public.xp_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own xp activities" ON public.xp_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
-- Public leaderboard visibility
CREATE POLICY "Leaderboard is publicly viewable" ON public.user_points FOR SELECT USING (true);
-- Let users create/update their own row (also needed for triggers to pass RLS)
CREATE POLICY "Users can insert their own user_points" ON public.user_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own user_points" ON public.user_points FOR UPDATE USING (auth.uid() = user_id);

-- Trigger: keep user_points in sync when xp_activities are added
CREATE OR REPLACE FUNCTION public.handle_xp_activity()
RETURNS TRIGGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  INSERT INTO public.user_points (user_id, total_points, level, updated_at)
  VALUES (NEW.user_id, NEW.points, GREATEST(1, (NEW.points / 100) + 1), now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = public.user_points.total_points + EXCLUDED.total_points,
    level = GREATEST(1, ((public.user_points.total_points + EXCLUDED.total_points) / 100) + 1),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS on_xp_activity ON public.xp_activities;
CREATE TRIGGER on_xp_activity AFTER INSERT ON public.xp_activities FOR EACH ROW EXECUTE FUNCTION public.handle_xp_activity();

-- STREAKS
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_check_in_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own streaks" ON public.user_streaks FOR DELETE USING (auth.uid() = user_id);
DROP TRIGGER IF EXISTS update_user_streaks_updated_at ON public.user_streaks;
CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- POMODORO SESSIONS
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  mode TEXT NOT NULL CHECK (mode IN ('focus','break')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_started ON public.pomodoro_sessions(user_id, started_at DESC);
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own pomodoro sessions" ON public.pomodoro_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own pomodoro sessions" ON public.pomodoro_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pomodoro sessions" ON public.pomodoro_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pomodoro sessions" ON public.pomodoro_sessions FOR DELETE USING (auth.uid() = user_id);

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
-- Publicly viewable catalog of achievements
CREATE POLICY "Achievements catalog is public" ON public.achievements FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own earned achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add their own earned achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- COMMUNITY: study groups & memberships
CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View public or joined/owned groups" ON public.study_groups
  FOR SELECT USING (
    is_public OR auth.uid() = owner_id OR EXISTS (
      SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid()
    )
  );
CREATE POLICY "Create own group" ON public.study_groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Update own group" ON public.study_groups FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Delete own group" ON public.study_groups FOR DELETE USING (auth.uid() = owner_id);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View members of public or joined groups" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND (
        g.is_public OR g.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.group_members gm2 WHERE gm2.group_id = group_id AND gm2.user_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY "Join public group (self)" ON public.group_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.is_public = true
    )
  );
CREATE POLICY "Leave group (self)" ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- GROUP CHALLENGES
CREATE TABLE IF NOT EXISTS public.group_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  points_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.group_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View challenges of public or joined groups" ON public.group_challenges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND (
        g.is_public OR g.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_id AND gm.user_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY "Create challenge (group owner)" ON public.group_challenges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
);
CREATE POLICY "Update/Delete challenge (group owner)" ON public.group_challenges
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()));
CREATE POLICY "Delete challenge (group owner)" ON public.group_challenges
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  challenge_id UUID NOT NULL REFERENCES public.group_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View participants (public or joined groups)" ON public.challenge_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_challenges c
      JOIN public.study_groups g ON g.id = c.group_id
      WHERE c.id = challenge_id AND (
        g.is_public OR g.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY "Join challenge (self)" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own challenge progress" ON public.challenge_participants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Leave challenge (self)" ON public.challenge_participants FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_xp_activities_user ON public.xp_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON public.user_streaks(user_id);
