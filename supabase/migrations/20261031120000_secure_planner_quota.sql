-- Quota mutations are available only to the trusted application server.
drop function public.consume_planner_generation(integer);
drop function public.release_planner_generation();

create or replace function public.consume_planner_generation(p_user_id uuid, p_limit integer)
returns table (allowed boolean, used integer, quota integer, remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := p_user_id;
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

create or replace function public.release_planner_generation(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := p_user_id;
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

revoke all on function public.consume_planner_generation(uuid, integer) from public, anon, authenticated;
revoke all on function public.release_planner_generation(uuid) from public, anon, authenticated;
grant execute on function public.consume_planner_generation(uuid, integer) to service_role;
grant execute on function public.release_planner_generation(uuid) to service_role;
