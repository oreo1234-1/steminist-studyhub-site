-- Migration v3: correct ordering for group policies

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
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_streaks' AND policyname='Users can view their own streaks'
  ) THEN
    CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_streaks' AND policyname='Users can create their own streaks'
  ) THEN
    CREATE POLICY "Users can create their own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_streaks' AND policyname='Users can update their own streaks'
  ) THEN
    CREATE POLICY "Users can update their own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_streaks' AND policyname='Users can delete their own streaks'
  ) THEN
    CREATE POLICY "Users can delete their own streaks" ON public.user_streaks FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
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
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pomodoro_sessions' AND policyname='Users can view their own pomodoro sessions'
  ) THEN
    CREATE POLICY "Users can view their own pomodoro sessions" ON public.pomodoro_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pomodoro_sessions' AND policyname='Users can add their own pomodoro sessions'
  ) THEN
    CREATE POLICY "Users can add their own pomodoro sessions" ON public.pomodoro_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pomodoro_sessions' AND policyname='Users can update their own pomodoro sessions'
  ) THEN
    CREATE POLICY "Users can update their own pomodoro sessions" ON public.pomodoro_sessions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pomodoro_sessions' AND policyname='Users can delete their own pomodoro sessions'
  ) THEN
    CREATE POLICY "Users can delete their own pomodoro sessions" ON public.pomodoro_sessions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- STUDY GROUPS + MEMBERS (order matters for policies)
CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Now that both tables exist, create policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_groups' AND policyname='View public or joined/owned groups'
  ) THEN
    CREATE POLICY "View public or joined/owned groups" ON public.study_groups
      FOR SELECT USING (
        is_public OR auth.uid() = owner_id OR EXISTS (
          SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid()
        )
      );
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_groups' AND policyname='Create own group'
  ) THEN
    CREATE POLICY "Create own group" ON public.study_groups FOR INSERT WITH CHECK (auth.uid() = owner_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_groups' AND policyname='Update own group'
  ) THEN
    CREATE POLICY "Update own group" ON public.study_groups FOR UPDATE USING (auth.uid() = owner_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_groups' AND policyname='Delete own group'
  ) THEN
    CREATE POLICY "Delete own group" ON public.study_groups FOR DELETE USING (auth.uid() = owner_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_members' AND policyname='View members of public or joined groups'
  ) THEN
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
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_members' AND policyname='Join public group (self)'
  ) THEN
    CREATE POLICY "Join public group (self)" ON public.group_members
      FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
          SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.is_public = true
        )
      );
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_members' AND policyname='Leave group (self)'
  ) THEN
    CREATE POLICY "Leave group (self)" ON public.group_members FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

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
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_challenges' AND policyname='View challenges of public or joined groups'
  ) THEN
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
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_challenges' AND policyname='Create challenge (group owner)'
  ) THEN
    CREATE POLICY "Create challenge (group owner)" ON public.group_challenges FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
    );
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_challenges' AND policyname='Update/Delete challenge (group owner)'
  ) THEN
    CREATE POLICY "Update/Delete challenge (group owner)" ON public.group_challenges
      FOR UPDATE USING (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()))
      WITH CHECK (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()));
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='group_challenges' AND policyname='Delete challenge (group owner)'
  ) THEN
    CREATE POLICY "Delete challenge (group owner)" ON public.group_challenges
      FOR DELETE USING (EXISTS (SELECT 1 FROM public.study_groups g WHERE g.id = group_id AND g.owner_id = auth.uid()));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  challenge_id UUID NOT NULL REFERENCES public.group_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='challenge_participants' AND policyname='View participants (public or joined groups)'
  ) THEN
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
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='challenge_participants' AND policyname='Join challenge (self)'
  ) THEN
    CREATE POLICY "Join challenge (self)" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='challenge_participants' AND policyname='Update own challenge progress'
  ) THEN
    CREATE POLICY "Update own challenge progress" ON public.challenge_participants FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='challenge_participants' AND policyname='Leave challenge (self)'
  ) THEN
    CREATE POLICY "Leave challenge (self)" ON public.challenge_participants FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON public.user_streaks(user_id);
