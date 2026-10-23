-- Planner quota, atomic plan persistence, and supporting policies.

create table public.planner_usage (
  user_id uuid not null references public.profiles (id) on delete cascade,
  period_start date not null,
  generations integer not null default 0 check (generations >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, period_start)
);

create trigger planner_usage_set_updated_at
  before update on public.planner_usage
  for each row execute function public.set_updated_at();

alter table public.planner_usage enable row level security;

create policy "planner_usage_select_own"
  on public.planner_usage for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.planner_usage from anon, authenticated;
grant select on public.planner_usage to authenticated;
grant all on public.planner_usage to service_role;

-- Atomically reserve one generation for the current user and UTC day.
-- Returns no row for unauthenticated callers. The caller must release the
-- reservation if the provider request fails.
create or replace function public.consume_planner_generation(p_limit integer default 5)
returns table (allowed boolean, used integer, quota integer, remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_period date := (now() at time zone 'utc')::date;
  v_used integer;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_limit < 1 or p_limit > 50 then
    raise exception 'invalid quota limit' using errcode = '22023';
  end if;

  insert into public.planner_usage as usage (user_id, period_start, generations)
  values (v_user_id, v_period, 1)
  on conflict (user_id, period_start) do update
    set generations = usage.generations + 1
    where usage.generations < p_limit
  returning usage.generations into v_used;

  if v_used is null then
    select usage.generations
    into v_used
    from public.planner_usage as usage
    where usage.user_id = v_user_id
      and usage.period_start = v_period;

    return query select false, coalesce(v_used, p_limit), p_limit, 0;
    return;
  end if;

  return query select true, v_used, p_limit, greatest(p_limit - v_used, 0);
end;
$$;

create or replace function public.release_planner_generation()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_period date := (now() at time zone 'utc')::date;
  v_used integer;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  update public.planner_usage
  set generations = greatest(generations - 1, 0)
  where user_id = v_user_id
    and period_start = v_period
  returning generations into v_used;

  return coalesce(v_used, 0);
end;
$$;

-- Persist a reviewed plan in one transaction. The owner always comes from the
-- verified session, never from the request body.
create or replace function public.create_project_plan(
  p_name text,
  p_description text,
  p_milestones jsonb default '[]'::jsonb,
  p_tasks jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_project_id uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_name is null or length(btrim(p_name)) not between 1 and 120 then
    raise exception 'invalid project name' using errcode = '22023';
  end if;

  if p_description is not null and length(p_description) > 2000 then
    raise exception 'project description is too long' using errcode = '22023';
  end if;

  if jsonb_typeof(p_milestones) <> 'array'
    or jsonb_array_length(p_milestones) > 12 then
    raise exception 'invalid milestone list' using errcode = '22023';
  end if;

  if jsonb_typeof(p_tasks) <> 'array'
    or jsonb_array_length(p_tasks) > 40 then
    raise exception 'invalid task list' using errcode = '22023';
  end if;

  insert into public.projects (owner_id, name, description, status)
  values (v_user_id, btrim(p_name), nullif(btrim(p_description), ''), 'active')
  returning id into v_project_id;

  insert into public.milestones (project_id, title, description, target_date)
  select
    v_project_id,
    btrim(milestone.title),
    nullif(btrim(milestone.description), ''),
    milestone.target_date
  from jsonb_to_recordset(p_milestones) as milestone(
    title text,
    description text,
    target_date date
  );

  insert into public.tasks (
    project_id,
    title,
    description,
    status,
    priority,
    due_date,
    position
  )
  select
    v_project_id,
    btrim(task.title),
    nullif(btrim(task.description), ''),
    coalesce(task.status, 'todo'),
    coalesce(task.priority, 'medium'),
    task.due_date,
    (row_number() over ())::integer - 1
  from jsonb_to_recordset(p_tasks) as task(
    title text,
    description text,
    status text,
    priority text,
    due_date date
  );

  return v_project_id;
end;
$$;

revoke all on function public.consume_planner_generation(integer)
  from public, anon, authenticated;
revoke all on function public.release_planner_generation()
  from public, anon, authenticated;
revoke all on function public.create_project_plan(text, text, jsonb, jsonb)
  from public, anon, authenticated;

grant execute on function public.consume_planner_generation(integer)
  to authenticated;
grant execute on function public.release_planner_generation()
  to authenticated;
grant execute on function public.create_project_plan(text, text, jsonb, jsonb)
  to authenticated;
