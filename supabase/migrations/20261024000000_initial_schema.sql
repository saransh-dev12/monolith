-- Monolith MVP schema
-- Tables: profiles, projects, tasks, milestones
-- Every exposed table is protected by explicit grants and row level security.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (length(btrim(display_name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 120),
  description text check (description is null or length(description) <= 2000),
  status text not null default 'active' check (status in ('active', 'completed')),
  start_date date,
  target_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_date_order check (
    start_date is null or target_date is null or target_date >= start_date
  )
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 200),
  description text check (description is null or length(description) <= 2000),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 160),
  description text check (description is null or length(description) <= 2000),
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_owner_archived_updated_idx
  on public.projects (owner_id, archived_at, updated_at desc);
create index tasks_project_status_position_idx
  on public.tasks (project_id, status, position);
create index tasks_project_due_date_idx
  on public.tasks (project_id, due_date);
create index milestones_project_target_date_idx
  on public.milestones (project_id, target_date);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger milestones_set_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

-- Create the profile row for every new auth user. Runs only from the auth
-- trigger, and the display name falls back to the email local part.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1),
      'Monolith user'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.milestones enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "projects_select_own"
  on public.projects for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "projects_update_own"
  on public.projects for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "projects_delete_own"
  on public.projects for delete
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "tasks_select_own"
  on public.tasks for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "tasks_insert_own"
  on public.tasks for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "tasks_update_own"
  on public.tasks for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
        and projects.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "tasks_delete_own"
  on public.tasks for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "milestones_select_own"
  on public.milestones for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "milestones_insert_own"
  on public.milestones for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "milestones_update_own"
  on public.milestones for update
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

create policy "milestones_delete_own"
  on public.milestones for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
        and projects.owner_id = (select auth.uid())
    )
  );

-- Least privilege: anonymous visitors get no application table access.
revoke all on public.profiles, public.projects, public.tasks, public.milestones
  from anon;
revoke all on public.profiles, public.projects, public.tasks, public.milestones
  from authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.milestones to authenticated;
grant all on public.profiles, public.projects, public.tasks, public.milestones
  to service_role;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
