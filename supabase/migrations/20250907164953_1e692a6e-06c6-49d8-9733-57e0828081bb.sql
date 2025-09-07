-- Create a function to safely get public profile data for leaderboard
create or replace function public.get_public_profiles(user_ids uuid[])
returns table(id uuid, full_name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.full_name
  from public.profiles p
  where p.id = any(user_ids);
$$;