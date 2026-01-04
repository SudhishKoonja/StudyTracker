-- Create objectives table
create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_hours numeric not null default 0,
  current_hours numeric not null default 0,
  color text not null,
  subject text not null check (subject in ('chemistry', 'physics', 'computer-science')),
  chapter text not null,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Create study sessions table
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid references public.objectives(id) on delete cascade,
  duration_hours numeric not null,
  session_date date not null default current_date,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.objectives enable row level security;
alter table public.study_sessions enable row level security;

-- RLS Policies for objectives
create policy "Users can view their own objectives"
  on public.objectives for select
  using (auth.uid() = user_id);

create policy "Users can insert their own objectives"
  on public.objectives for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own objectives"
  on public.objectives for update
  using (auth.uid() = user_id);

create policy "Users can delete their own objectives"
  on public.objectives for delete
  using (auth.uid() = user_id);

-- RLS Policies for study_sessions
create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own study sessions"
  on public.study_sessions for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists objectives_user_id_idx on public.objectives(user_id);
create index if not exists study_sessions_user_id_idx on public.study_sessions(user_id);
create index if not exists study_sessions_objective_id_idx on public.study_sessions(objective_id);
create index if not exists study_sessions_date_idx on public.study_sessions(session_date);
