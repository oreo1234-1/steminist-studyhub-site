-- Minimal migration: ensure upsert works for user_streaks by adding a unique index
create unique index if not exists user_streaks_user_id_uidx
  on public.user_streaks(user_id);
