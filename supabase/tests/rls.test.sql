begin;

create extension if not exists pgtap with schema extensions;

select plan(21);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role authenticated;

select is(
  (select count(*)::int from public.projects),
  2,
  'demo user sees only their two projects'
);

select is(
  (select count(*)::int from public.tasks),
  7,
  'demo user sees tasks from their own projects'
);

select is(
  (select count(*)::int from public.milestones),
  2,
  'demo user sees milestones from their own projects'
);

select is(
  (select count(*)::int from public.profiles),
  1,
  'demo user sees only their own profile'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);

select is(
  (select count(*)::int from public.projects),
  1,
  'second user sees only their own project'
);

select is(
  (select count(*)::int from public.tasks),
  0,
  'second user sees no tasks from the demo account'
);

select is(
  (select count(*)::int from public.milestones),
  0,
  'second user sees no milestones from the demo account'
);

select throws_ok(
  $$
    insert into public.tasks (project_id, title)
    values ('33333333-3333-4333-8333-333333333331', 'intrusion')
  $$,
  '42501',
  null,
  'second user cannot insert a task into the demo project'
);

select throws_ok(
  $$
    insert into public.projects (owner_id, name)
    values ('11111111-1111-4111-8111-111111111111', 'forged project')
  $$,
  '42501',
  null,
  'user cannot forge another owner id'
);

update public.tasks
set title = 'hijacked'
where id = '44444444-4444-4444-8444-444444444441';

reset role;

select is(
  (
    select title from public.tasks
    where id = '44444444-4444-4444-8444-444444444441'
  ),
  'Draft the case study outline',
  'second user cannot update a demo task'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role authenticated;

update public.projects
set name = 'hijacked'
where id = '33333333-3333-4333-8333-333333333333';

reset role;

select is(
  (
    select name from public.projects
    where id = '33333333-3333-4333-8333-333333333333'
  ),
  'Second user private project',
  'demo user cannot update another owner''s project'
);

set local role authenticated;

delete from public.projects
where id = '33333333-3333-4333-8333-333333333333';

reset role;

select is(
  (
    select count(*)::int from public.projects
    where id = '33333333-3333-4333-8333-333333333333'
  ),
  1,
  'demo user cannot delete another owner''s project'
);

set local role authenticated;

select throws_ok(
  $$
    insert into public.projects (owner_id, name, start_date, target_date)
    values (
      '11111111-1111-4111-8111-111111111111',
      'bad dates',
      current_date,
      current_date - 1
    )
  $$,
  '23514',
  null,
  'target date before start date is rejected'
);

update public.projects
set archived_at = now()
where id = '33333333-3333-4333-8333-333333333331';

select is(
  (
    select count(*)::int from public.tasks
    where project_id = '33333333-3333-4333-8333-333333333331'
  ),
  5,
  'archiving a project retains its tasks'
);

insert into public.projects (id, owner_id, name)
values (
  '99999999-9999-4999-8999-999999999999',
  '11111111-1111-4111-8111-111111111111',
  'cascade check'
);

insert into public.tasks (project_id, title)
values ('99999999-9999-4999-8999-999999999999', 'child task');

delete from public.projects where id = '99999999-9999-4999-8999-999999999999';

select is(
  (
    select count(*)::int from public.tasks
    where project_id = '99999999-9999-4999-8999-999999999999'
  ),
  0,
  'deleting a project cascades to its tasks'
);

select throws_ok(
  $$
    insert into public.profiles (id, display_name)
    values ('11111111-1111-4111-8111-111111111111', 'forged profile')
  $$,
  '42501',
  null,
  'authenticated users cannot insert profiles directly'
);

update public.profiles
set display_name = 'Demo Builder Updated'
where id = '11111111-1111-4111-8111-111111111111';

select is(
  (
    select display_name from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
  ),
  'Demo Builder Updated',
  'a user can update their own profile'
);

reset role;

select is(
  has_table_privilege('anon', 'public.projects', 'select'),
  false,
  'anonymous visitors have no project read grant'
);

select is(
  has_table_privilege('authenticated', 'public.projects', 'insert'),
  true,
  'authenticated users can insert projects'
);

select is(
  has_table_privilege('authenticated', 'public.profiles', 'insert'),
  false,
  'authenticated users cannot insert profiles directly'
);

select is(
  has_table_privilege('authenticated', 'public.tasks', 'delete'),
  true,
  'authenticated users can delete tasks'
);

select * from finish();

rollback;
