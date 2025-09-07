
-- 1) Roles: introduce secure role management

-- 1.1 Create user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- 1.2 SECURITY DEFINER function to check role
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 1.3 Update get_current_user_role to read from user_roles
-- Returns highest role by priority: admin > mentor > student (fallback student)
create or replace function public.get_current_user_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $function$
  with roles as (
    select
      case
        when public.has_role(auth.uid(), 'admin') then 'admin'::app_role
        when public.has_role(auth.uid(), 'mentor') then 'mentor'::app_role
        else 'student'::app_role
      end as role
  )
  select role from roles limit 1
$function$;

-- 1.4 RLS on user_roles: only admins can manage roles; users can see their own roles
drop policy if exists "users can manage roles" on public.user_roles;
drop policy if exists "anyone can view roles" on public.user_roles;

create policy "users can view their own roles"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid());

create policy "admins can manage roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 1.5 Migrate existing roles from profiles.role into user_roles
-- Only copy non-null distinct roles
insert into public.user_roles (user_id, role)
select p.id, p.role
from public.profiles p
where p.role is not null
on conflict (user_id, role) do nothing;

-- 1.6 Block direct role changes in profiles (temporary safeguard)
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not public.has_role(auth.uid(), 'admin') then
      raise exception 'Updating role is not allowed';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_role_change on public.profiles;
create trigger trg_prevent_profile_role_change
before update on public.profiles
for each row
execute function public.prevent_profile_role_change();

-- 2) Fix broken RLS correlations for groups

-- 2.1 group_members: fix SELECT correlation
drop policy if exists "View members of public or joined groups" on public.group_members;

create policy "View members of public or joined groups"
on public.group_members
for select
to authenticated
using (
  exists (
    select 1
    from public.study_groups g
    where g.id = group_members.group_id
      and (
        g.is_public
        or g.owner_id = auth.uid()
        or exists (
          select 1
          from public.group_members gm2
          where gm2.group_id = group_members.group_id
            and gm2.user_id = auth.uid()
        )
      )
  )
);

-- 2.2 group_challenges: fix SELECT correlation
drop policy if exists "View challenges of public or joined groups" on public.group_challenges;

create policy "View challenges of public or joined groups"
on public.group_challenges
for select
to authenticated
using (
  exists (
    select 1
    from public.study_groups g
    where g.id = group_challenges.group_id
      and (
        g.is_public
        or g.owner_id = auth.uid()
        or exists (
          select 1
          from public.group_members gm
          where gm.group_id = g.id
            and gm.user_id = auth.uid()
        )
      )
  )
);

-- 3) Lock down gamification writes

-- 3.1 user_points: remove permissive ALL policy
drop policy if exists "System can update user points" on public.user_points;

-- Keep read access for leaderboard:
drop policy if exists "Users can view all points for leaderboard" on public.user_points;
create policy "Users can view all points for leaderboard"
on public.user_points
for select
to authenticated
using (true);

-- Keep "Users can view their own points" (already exists). If not, add it:
drop policy if exists "Users can view their own points" on public.user_points;
create policy "Users can view their own points"
on public.user_points
for select
to authenticated
using (auth.uid() = user_id);

-- 3.2 user_badges: remove permissive INSERT policy
drop policy if exists "System can award badges" on public.user_badges;

-- Allow read for all authenticated (leaderboards/profile display):
drop policy if exists "Users can view all user badges" on public.user_badges;
create policy "Users can view all user badges"
on public.user_badges
for select
to authenticated
using (true);

-- Writes must be done by service role only (no user-facing INSERT/UPDATE/DELETE policies).

-- 3.3 user_activity: tighten INSERT to self
drop policy if exists "System can log activity" on public.user_activity;

create policy "Users can view their activity"
on public.user_activity
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can log their own activity"
on public.user_activity
for insert
to authenticated
with check (auth.uid() = user_id);

-- 4) Reduce PII exposure in profiles

-- Remove public SELECT; scope to authenticated minimally
drop policy if exists "Users can view all profiles" on public.profiles;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Optional: Authenticated users can view non-sensitive peer data if required (commented)
-- create policy "Authenticated users can view profiles"
-- on public.profiles
-- for select
-- to authenticated
-- using (true);

-- 4.1 Create a public, non-sensitive view (used by UI for leaderboard and member cards)
drop view if exists public.public_profiles_lite;
create view public.public_profiles_lite as
select id, full_name, avatar_url, bio
from public.profiles;

-- (Note: RLS still applies under the view. After app changes, we can add a function-based endpoint to serve this safely if wider visibility is needed.)

-- 5) Secure storage buckets: make private and require auth (minimum viable)

-- Switch buckets to private
update storage.buckets set public = false where name in ('study-materials', 'workshop-recordings');

-- RLS policies on storage.objects for authenticated read access
-- Study materials
drop policy if exists "Public can view study materials" on storage.objects;
create policy "Authenticated can view study materials"
on storage.objects
for select
to authenticated
using (bucket_id = 'study-materials');

-- Workshop recordings
drop policy if exists "Public can view workshop recordings" on storage.objects;
create policy "Authenticated can view workshop recordings"
on storage.objects
for select
to authenticated
using (bucket_id = 'workshop-recordings');

-- (Later: implement signed URL generation with approval/subscription checks)

-- 6) Newsletter: enforce uniqueness to reduce spam/duplication
alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_email_unique unique (email);
