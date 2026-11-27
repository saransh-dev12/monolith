-- Retain the original RPC for old deployments while new clients use a
-- per-user confirmation key. The claim and plan creation share one transaction.
create table public.planner_confirmations (
  user_id uuid not null references public.profiles(id) on delete cascade,
  confirmation_id uuid not null,
  payload jsonb not null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, confirmation_id)
);

alter table public.planner_confirmations enable row level security;
revoke all on public.planner_confirmations from public, anon, authenticated;

create function public.create_project_plan_idempotent(
  p_confirmation_id uuid,
  p_name text,
  p_description text,
  p_milestones jsonb,
  p_tasks jsonb
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_payload jsonb := jsonb_build_object(
    'name', p_name, 'description', p_description,
    'milestones', p_milestones, 'tasks', p_tasks
  );
  v_claimed uuid;
  v_existing_payload jsonb;
  v_project_id uuid;
begin
  if v_user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_confirmation_id is null then
    raise exception 'confirmation id required' using errcode = '22023';
  end if;

  insert into public.planner_confirmations (user_id, confirmation_id, payload)
  values (v_user_id, p_confirmation_id, v_payload)
  on conflict (user_id, confirmation_id) do nothing
  returning confirmation_id into v_claimed;

  if v_claimed is null then
    -- The conflicting insert waits for an in-flight transaction to finish.
    select payload, project_id into v_existing_payload, v_project_id
    from public.planner_confirmations
    where user_id = v_user_id and confirmation_id = p_confirmation_id;
    if v_existing_payload is distinct from v_payload then
      raise exception 'confirmation id already used for another plan' using errcode = 'P0003';
    end if;
    if v_project_id is null then
      raise exception 'confirmed project was deleted' using errcode = 'P0002';
    end if;
    return v_project_id;
  end if;

  v_project_id := public.create_project_plan(p_name, p_description, p_milestones, p_tasks);
  update public.planner_confirmations set project_id = v_project_id
  where user_id = v_user_id and confirmation_id = p_confirmation_id;
  return v_project_id;
end;
$$;

revoke all on function public.create_project_plan_idempotent(uuid, text, text, jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.create_project_plan_idempotent(uuid, text, text, jsonb, jsonb)
  to authenticated;
