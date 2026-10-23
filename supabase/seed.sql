-- Local development seed only. Every account and record below is fictional.
-- Supabase CLI loads this file after a reset; never apply it to production.
--
-- Demo sign-in:
--   demo@monolith.local / monolith-demo
--   second@monolith.local / monolith-demo

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo@monolith.local',
    '$2b$10$nu738fMHja1jvFJWlOrC6OwBbL8qPfb9yYchwPwP13WJrIxbuUv4W',
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Demo Builder"}',
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'second@monolith.local',
    '$2b$10$nu738fMHja1jvFJWlOrC6OwBbL8qPfb9yYchwPwP13WJrIxbuUv4W',
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Second Builder"}',
    now(),
    now()
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111112',
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    '{"sub":"11111111-1111-4111-8111-111111111111","email":"demo@monolith.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    '22222222-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    '{"sub":"22222222-2222-4222-8222-222222222222","email":"second@monolith.local"}',
    'email',
    now(),
    now(),
    now()
  )
on conflict do nothing;

insert into public.projects (
  id,
  owner_id,
  name,
  description,
  status,
  start_date,
  target_date,
  created_at,
  updated_at
)
values
  (
    '33333333-3333-4333-8333-333333333331',
    '11111111-1111-4111-8111-111111111111',
    'Portfolio relaunch',
    'Rebuild a personal portfolio with case studies and a writing section.',
    'active',
    current_date - 7,
    current_date + 21,
    now() - interval '6 days',
    now() - interval '1 day'
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '11111111-1111-4111-8111-111111111111',
    'Local market research',
    'Interview five independent shop owners and summarize the findings.',
    'completed',
    current_date - 30,
    current_date - 3,
    now() - interval '28 days',
    now() - interval '2 days'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'Second user private project',
    'This project must never be visible to the demo account.',
    'active',
    null,
    current_date + 14,
    now() - interval '3 days',
    now() - interval '3 days'
  )
on conflict (id) do nothing;

insert into public.tasks (
  id,
  project_id,
  title,
  description,
  status,
  priority,
  due_date,
  position
)
values
  (
    '44444444-4444-4444-8444-444444444441',
    '33333333-3333-4333-8333-333333333331',
    'Draft the case study outline',
    null,
    'done',
    'high',
    current_date - 2,
    0
  ),
  (
    '44444444-4444-4444-8444-444444444442',
    '33333333-3333-4333-8333-333333333331',
    'Write the about page',
    'Keep it under 250 words.',
    'in_progress',
    'medium',
    current_date + 4,
    0
  ),
  (
    '44444444-4444-4444-8444-444444444443',
    '33333333-3333-4333-8333-333333333331',
    'Export and compress project screenshots',
    null,
    'todo',
    'low',
    current_date + 9,
    0
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '33333333-3333-4333-8333-333333333331',
    'Review accessibility of the contact form',
    null,
    'todo',
    'high',
    current_date - 1,
    1
  ),
  (
    '44444444-4444-4444-8444-444444444445',
    '33333333-3333-4333-8333-333333333331',
    'Set up analytics',
    null,
    'todo',
    'low',
    null,
    2
  ),
  (
    '44444444-4444-4444-8444-444444444446',
    '33333333-3333-4333-8333-333333333332',
    'Transcribe interview notes',
    null,
    'done',
    'medium',
    current_date - 6,
    0
  ),
  (
    '44444444-4444-4444-8444-444444444447',
    '33333333-3333-4333-8333-333333333332',
    'Summarize findings',
    null,
    'done',
    'high',
    current_date - 3,
    0
  )
on conflict (id) do nothing;

insert into public.milestones (
  id,
  project_id,
  title,
  description,
  target_date,
  completed_at
)
values
  (
    '55555555-5555-4555-8555-555555555551',
    '33333333-3333-4333-8333-333333333331',
    'Content complete',
    null,
    current_date + 10,
    null
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    '33333333-3333-4333-8333-333333333331',
    'Launch',
    null,
    current_date + 21,
    null
  )
on conflict (id) do nothing;
