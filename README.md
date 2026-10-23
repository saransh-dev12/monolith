# Monolith

Monolith is planned as a premium, AI-assisted project execution platform for students, individual developers, indie hackers, and small teams. It is intended to turn project ideas into milestones and actionable tasks, organize work, show progress and overdue work, and help users turn ambiguous goals into plans.

## Project status

**Planning and repository initialization only.** No application routes, UI, authentication, database integration, or AI functionality have been implemented. The architecture and feature scope below are proposals until they are built and verified.

## Planned MVP

- User authentication and protected application routes.
- A Command Center with metrics computed from the signed-in user's projects and tasks.
- Project and task management, including archive and delete behavior.
- A usable Kanban board and milestone progress.
- AI-generated plans that users can edit and explicitly confirm before saving.
- Responsive, accessible UI; PostgreSQL persistence; automated checks; and production deployment.

## Intended stack

- Next.js App Router, React, TypeScript, and Tailwind CSS.
- shadcn/ui components and Lucide icons; Motion for React only for purposeful motion.
- Next.js server-side logic and Route Handlers.
- Supabase Postgres, Supabase Auth, and Row Level Security (RLS).
- OpenAI Responses API from server-side code.
- Vercel deployment.

Exact dependency versions will be selected at implementation start, checked against the then-current official documentation, and recorded in `package-lock.json`. The available environment has Node.js 26.5.0 and npm 11.17.0. The current Next.js installation guide specifies Node.js 20.9 as its minimum. npm is the available package manager; pnpm, yarn, and bun are not installed.

## Repository contents

- [Architecture proposal](docs/architecture.md)
- [Three-day implementation plan and proposed GitHub backlog](docs/implementation-plan.md)
- [Safe environment-variable template](.env.example)

This repository is not runnable yet; application scaffolding is intentionally deferred until the planning checkpoint is accepted.

## Initialization status

- A clean local Git repository exists on `main` in the dedicated `monolith/` directory.
- No remote is configured. GitHub CLI is installed but its configured login is invalid, so repository availability, permissions, repository creation, issues, and push could not be verified or completed.
- Vercel CLI is installed, but `vercel whoami` could not reach its service. Account authentication is unverified.
- The exact manual steps to resume remote setup are in the implementation plan.

## Official references checked

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui with Next.js](https://ui.shadcn.com/docs/installation/next)
- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OpenAI text generation and Responses API](https://developers.openai.com/api/docs/guides/text)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
