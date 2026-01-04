-- Drop existing policies
drop policy if exists "Users can view their own objectives" on public.objectives;
drop policy if exists "Users can insert their own objectives" on public.objectives;
drop policy if exists "Users can update their own objectives" on public.objectives;
drop policy if exists "Users can delete their own objectives" on public.objectives;
drop policy if exists "Users can view their own study sessions" on public.study_sessions;
drop policy if exists "Users can insert their own study sessions" on public.study_sessions;
drop policy if exists "Users can update their own study sessions" on public.study_sessions;
drop policy if exists "Users can delete their own study sessions" on public.study_sessions;

-- Drop user_id columns
alter table public.objectives drop column if exists user_id;
alter table public.study_sessions drop column if exists user_id;

-- Disable RLS (we're using PIN-based access instead)
alter table public.objectives disable row level security;
alter table public.study_sessions disable row level security;

-- Create simple policies for public access (after PIN verification)
create policy "Allow all operations on objectives"
  on public.objectives
  for all
  using (true)
  with check (true);

create policy "Allow all operations on study_sessions"
  on public.study_sessions
  for all
  using (true)
  with check (true);

-- Drop user-related indexes
drop index if exists objectives_user_id_idx;
drop index if exists study_sessions_user_id_idx;
