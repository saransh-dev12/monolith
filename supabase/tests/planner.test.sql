begin;

create extension if not exists pgtap with schema extensions;

select plan(18);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role service_role;

select is(
  (select allowed from public.consume_planner_generation('11111111-1111-4111-8111-111111111111', 2)),
  true,
  'first generation is allowed'
);

select is(
  (select used from public.consume_planner_generation('11111111-1111-4111-8111-111111111111', 2)),
  2,
  'second generation increments usage'
);

select is(
  (select allowed from public.consume_planner_generation('11111111-1111-4111-8111-111111111111', 2)),
  false,
  'generation over the quota is rejected'
);

select is(
  public.release_planner_generation('11111111-1111-4111-8111-111111111111'),
  1,
  'a failed generation can release its reservation'
);

set local role authenticated;

select is(
  (select count(*)::int from public.planner_usage),
  1,
  'usage is stored for the current user'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);

select is(
  (select count(*)::int from public.planner_usage),
  0,
  'usage from another user is not visible'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select isnt(
  public.create_project_plan(
    'Reviewed plan',
    'Created from a reviewed AI suggestion.',
    '[
      {"title":"Scope the build","description":null,"target_date":"2026-11-05"},
      {"title":"Ship the first version","description":null,"target_date":"2026-11-20"}
    ]'::jsonb,
    '[
      {"title":"Write the outline","description":null,"status":"todo","priority":"high","due_date":"2026-11-01"},
      {"title":"Build the core flow","description":null,"status":"todo","priority":"medium","due_date":"2026-11-10"}
    ]'::jsonb
  ),
  null,
  'a reviewed plan returns a project id'
);

select is(
  (
    select count(*)::int from public.milestones
    where project_id = (select id from public.projects where name = 'Reviewed plan')
  ),
  2,
  'confirmed milestones persist'
);

select is(
  (
    select count(*)::int from public.tasks
    where project_id = (select id from public.projects where name = 'Reviewed plan')
  ),
  2,
  'confirmed tasks persist'
);

select is(
  (
    select owner_id from public.projects
    where name = 'Reviewed plan'
  ),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'plan ownership comes from the verified session'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);

select is(
  (
    select count(*)::int from public.projects
    where name = 'Reviewed plan'
  ),
  0,
  'another user cannot see the confirmed plan'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select throws_ok(
  $$
    select public.create_project_plan(
      'Rollback plan',
      null,
      '[{"title":"","description":null,"target_date":null}]'::jsonb,
      '[]'::jsonb
    )
  $$,
  '23514',
  null,
  'an invalid milestone aborts the whole plan'
);

select is(
  (
    select count(*)::int from public.projects
    where name = 'Rollback plan'
  ),
  0,
  'no partial project remains after a failed plan'
);

reset role;

select is(
  has_function_privilege(
    'anon',
    'public.consume_planner_generation(uuid,integer)',
    'execute'
  ),
  false,
  'anonymous users cannot consume planner quota'
);

select is(has_function_privilege('authenticated', 'public.consume_planner_generation(uuid,integer)', 'execute'), false, 'authenticated users cannot choose a quota or user');
select is(has_function_privilege('authenticated', 'public.release_planner_generation(uuid)', 'execute'), false, 'authenticated users cannot release quota');
select is(has_function_privilege('service_role', 'public.release_planner_generation(uuid)', 'execute'), true, 'server role can release quota');

select is(
  has_function_privilege(
    'authenticated',
    'public.create_project_plan(text,text,jsonb,jsonb)',
    'execute'
  ),
  true,
  'authenticated users can persist reviewed plans'
);

select * from finish();

rollback;
