-- SECURITY INVOKER keeps every read subject to the caller's existing RLS.
create function public.dashboard_totals()
returns table (active_projects integer, open_tasks integer, completed_tasks integer, overdue_tasks integer)
language sql stable security invoker set search_path = ''
as $$
  select
    (select count(*)::integer from public.projects p where p.archived_at is null and p.status = 'active'),
    count(t.id) filter (where t.status <> 'done')::integer,
    count(t.id) filter (where t.status = 'done')::integer,
    count(t.id) filter (where t.status <> 'done' and t.due_date < (now() at time zone 'utc')::date)::integer
  from public.tasks t
  join public.projects p on p.id = t.project_id
  where p.archived_at is null;
$$;

create function public.dashboard_execution_series(p_days integer)
returns table (day date, created integer, completed integer)
language sql stable security invoker set search_path = ''
as $$
  with bounds as (
    select (now() at time zone 'utc')::date as today,
      case when p_days in (7, 14, 30) then p_days else 30 end as days
  ), visible_tasks as (
    select t.status, t.created_at, t.updated_at
    from public.tasks t join public.projects p on p.id = t.project_id
    where p.archived_at is null
  ), created_counts as (
    select (created_at at time zone 'utc')::date as day, count(*)::integer as total
    from visible_tasks, bounds
    where created_at >= (bounds.today - (bounds.days - 1))::timestamp at time zone 'utc'
    group by 1
  ), completed_counts as (
    select (updated_at at time zone 'utc')::date as day, count(*)::integer as total
    from visible_tasks, bounds
    where status = 'done' and updated_at >= (bounds.today - (bounds.days - 1))::timestamp at time zone 'utc'
    group by 1
  )
  select d.day::date, coalesce(c.total, 0), coalesce(done.total, 0)
  from bounds cross join lateral generate_series((bounds.today - (bounds.days - 1))::timestamp, bounds.today::timestamp, interval '1 day') as d(day)
  left join created_counts c on c.day = d.day::date
  left join completed_counts done on done.day = d.day::date
  order by d.day;
$$;

revoke all on function public.dashboard_totals() from public, anon;
revoke all on function public.dashboard_execution_series(integer) from public, anon;
grant execute on function public.dashboard_totals() to authenticated;
grant execute on function public.dashboard_execution_series(integer) to authenticated;
