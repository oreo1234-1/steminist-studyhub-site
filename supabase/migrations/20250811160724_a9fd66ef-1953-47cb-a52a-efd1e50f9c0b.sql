-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- Helper function: update updated_at column
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================
-- User Streaks
-- =========================================
create table if not exists public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_check_in_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

-- Policies
create policy if not exists "Users can view their own streaks"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy if not exists "Users can upsert their own streaks"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own streaks"
  on public.user_streaks for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own streaks"
  on public.user_streaks for delete
  using (auth.uid() = user_id);

-- Trigger for updated_at
create or replace trigger trg_user_streaks_updated_at
before update on public.user_streaks
for each row execute function public.update_updated_at_column();

-- =========================================
-- Pomodoro Sessions
-- =========================================
create table if not exists public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  mode text not null check (mode in ('focus', 'break')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_pomodoro_sessions_user_id_created_at
  on public.pomodoro_sessions (user_id, created_at desc);

alter table public.pomodoro_sessions enable row level security;

create policy if not exists "Users can view their own pomodoro sessions"
  on public.pomodoro_sessions for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own pomodoro sessions"
  on public.pomodoro_sessions for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own pomodoro sessions"
  on public.pomodoro_sessions for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own pomodoro sessions"
  on public.pomodoro_sessions for delete
  using (auth.uid() = user_id);

-- =========================================
-- Optional: User Activity (for points/xp logging) - only if not exists
-- This table is referenced by the app; provide minimal structure safely
create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null,
  points_earned integer not null default 0,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_activity_user_id_created_at
  on public.user_activity (user_id, created_at desc);

alter table public.user_activity enable row level security;

create policy if not exists "Users can view their own activity"
  on public.user_activity for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own activity"
  on public.user_activity for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own activity"
  on public.user_activity for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own activity"
  on public.user_activity for delete
  using (auth.uid() = user_id);

-- =========================================
-- Study Groups
-- =========================================
create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.study_groups enable row level security;

create policy if not exists "Members or creators can view groups"
  on public.study_groups for select
  using (
    created_by = auth.uid() or exists (
      select 1 from public.group_members gm
      where gm.group_id = study_groups.id and gm.user_id = auth.uid()
    )
  );

create policy if not exists "Users can create groups they own"
  on public.study_groups for insert
  with check (created_by = auth.uid());

create policy if not exists "Group creators can update groups"
  on public.study_groups for update
  using (created_by = auth.uid());

create policy if not exists "Group creators can delete groups"
  on public.study_groups for delete
  using (created_by = auth.uid());

-- =========================================
-- Group Members
-- =========================================
create table if not exists public.group_members (
  group_id uuid not null references public.study_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists idx_group_members_user on public.group_members(user_id);

alter table public.group_members enable row level security;

create policy if not exists "Users can view memberships they belong to or groups they created"
  on public.group_members for select
  using (
    user_id = auth.uid() or exists (
      select 1 from public.study_groups sg
      where sg.id = group_members.group_id and sg.created_by = auth.uid()
    )
  );

create policy if not exists "Users can join groups themselves"
  on public.group_members for insert
  with check (user_id = auth.uid());

create policy if not exists "Users can leave groups themselves"
  on public.group_members for delete
  using (user_id = auth.uid());

-- =========================================
-- Group Challenges
-- =========================================
create table if not exists public.group_challenges (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  title text not null,
  description text,
  points integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_group_challenges_group on public.group_challenges(group_id);

alter table public.group_challenges enable row level security;

create policy if not exists "Group members or creators can view challenges"
  on public.group_challenges for select
  using (
    exists (
      select 1 from public.study_groups sg
      where sg.id = group_challenges.group_id and (sg.created_by = auth.uid() or exists (
        select 1 from public.group_members gm
        where gm.group_id = sg.id and gm.user_id = auth.uid()
      ))
    )
  );

create policy if not exists "Group creators can create challenges"
  on public.group_challenges for insert
  with check (
    exists (
      select 1 from public.study_groups sg
      where sg.id = group_challenges.group_id and sg.created_by = auth.uid()
    )
  );

create policy if not exists "Challenge creators can update challenges"
  on public.group_challenges for update
  using (created_by = auth.uid());

create policy if not exists "Challenge creators can delete challenges"
  on public.group_challenges for delete
  using (created_by = auth.uid());

-- =========================================
-- Challenge Participants
-- =========================================
create table if not exists public.challenge_participants (
  challenge_id uuid not null references public.group_challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  progress integer not null default 0,
  completed boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create index if not exists idx_ch_participants_user on public.challenge_participants(user_id);

alter table public.challenge_participants enable row level security;

create policy if not exists "Users can view their challenge participation or group creators can view"
  on public.challenge_participants for select
  using (
    user_id = auth.uid() or exists (
      select 1 from public.group_challenges gc
      join public.study_groups sg on sg.id = gc.group_id
      where gc.id = challenge_participants.challenge_id and sg.created_by = auth.uid()
    )
  );

create policy if not exists "Users can join challenges themselves"
  on public.challenge_participants for insert
  with check (user_id = auth.uid());

create policy if not exists "Users can update their own challenge progress"
  on public.challenge_participants for update
  using (user_id = auth.uid());

create policy if not exists "Users can leave challenges themselves"
  on public.challenge_participants for delete
  using (user_id = auth.uid());
