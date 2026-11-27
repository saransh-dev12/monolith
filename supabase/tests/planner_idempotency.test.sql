begin;
create extension if not exists pgtap with schema extensions;
select plan(10);
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select set_config('test.confirmed_project', public.create_project_plan_idempotent(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Retry plan', null, '[]'::jsonb,
  '[{"title":"First task","status":"todo","priority":"medium"}]'::jsonb
)::text, true);
select is(public.create_project_plan_idempotent(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Retry plan', null, '[]'::jsonb,
  '[{"title":"First task","status":"todo","priority":"medium"}]'::jsonb
), current_setting('test.confirmed_project')::uuid, 'same key and plan return the existing project');
select is((select count(*)::integer from public.projects where name = 'Retry plan'), 1, 'replay does not create another project');
select is((select count(*)::integer from public.tasks where project_id = current_setting('test.confirmed_project')::uuid), 1, 'replay does not duplicate tasks');
select throws_ok($$select public.create_project_plan_idempotent(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Different plan', null, '[]'::jsonb,
  '[{"title":"First task","status":"todo","priority":"medium"}]'::jsonb)$$,
  'P0003', null, 'same key and different plan is rejected');
select throws_ok($$select public.create_project_plan_idempotent(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Rollback idempotent', null,
  '[{"title":""}]'::jsonb, '[]'::jsonb)$$,
  '23514', null, 'invalid child rolls back the confirmation');
select isnt(public.create_project_plan_idempotent(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Corrected after rollback', null,
  '[]'::jsonb, '[]'::jsonb), null, 'rolled back confirmation key can be retried');
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
select isnt(public.create_project_plan_idempotent(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Retry plan', null, '[]'::jsonb,
  '[{"title":"First task","status":"todo","priority":"medium"}]'::jsonb
), current_setting('test.confirmed_project')::uuid, 'confirmation keys are scoped by user');
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
delete from public.projects where id = current_setting('test.confirmed_project')::uuid;
select throws_ok($$select public.create_project_plan_idempotent(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Retry plan', null, '[]'::jsonb,
  '[{"title":"First task","status":"todo","priority":"medium"}]'::jsonb)$$,
  'P0002', null, 'deleted projects are not recreated by replay');
select is(has_table_privilege('authenticated', 'public.planner_confirmations', 'select'), false, 'authenticated users cannot read confirmation storage directly');
select is(has_function_privilege('anon', 'public.create_project_plan_idempotent(uuid,text,text,jsonb,jsonb)', 'execute'), false, 'anonymous users cannot execute confirmation');
select * from finish();
rollback;
