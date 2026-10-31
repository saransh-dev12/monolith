begin;
create extension if not exists pgtap with schema extensions;
select plan(7);

-- Capture each user's own baseline before adding a large isolated fixture.
create temporary table dashboard_baseline (owner text primary key, open_tasks integer, completed_tasks integer, overdue_tasks integer, created integer, chart_done integer);
grant all on dashboard_baseline to authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;
insert into dashboard_baseline
select 'a', t.open_tasks, t.completed_tasks, t.overdue_tasks, s.created, s.completed
from public.dashboard_totals() t, public.dashboard_execution_series(7) s
where s.day = (now() at time zone 'utc')::date;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
insert into dashboard_baseline
select 'b', t.open_tasks, t.completed_tasks, t.overdue_tasks, s.created, s.completed
from public.dashboard_totals() t, public.dashboard_execution_series(7) s
where s.day = (now() at time zone 'utc')::date;
reset role;

insert into public.tasks (project_id, title, status, due_date)
select '33333333-3333-4333-8333-333333333331', 'Large fixture ' || n,
  case when n <= 602 then 'done' else 'todo' end,
  (now() at time zone 'utc')::date - 1
from generate_series(1, 1205) n;

select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;
select is((select open_tasks from public.dashboard_totals()), (select open_tasks + 603 from dashboard_baseline where owner = 'a'), 'open task total exceeds API row limit');
select is((select completed_tasks from public.dashboard_totals()), (select completed_tasks + 602 from dashboard_baseline where owner = 'a'), 'done task total exceeds API row limit');
select is((select overdue_tasks from public.dashboard_totals()), (select overdue_tasks + 603 from dashboard_baseline where owner = 'a'), 'overdue total counts all open tasks');
select is((select created from public.dashboard_execution_series(7) where day = (now() at time zone 'utc')::date), (select created + 1205 from dashboard_baseline where owner = 'a'), 'chart counts all created tasks');
select is((select completed from public.dashboard_execution_series(7) where day = (now() at time zone 'utc')::date), (select chart_done + 602 from dashboard_baseline where owner = 'a'), 'chart counts all currently done tasks');
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
select is((select open_tasks from public.dashboard_totals()), (select open_tasks from dashboard_baseline where owner = 'b'), 'another user cannot count the fixture');
select is((select created from public.dashboard_execution_series(7) where day = (now() at time zone 'utc')::date), (select created from dashboard_baseline where owner = 'b'), 'another user cannot see fixture in chart');
select * from finish();
rollback;
