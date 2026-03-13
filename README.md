# Orbit PM - SaaS Project Management Platform

A senior-level Next.js SaaS that blends Notion + Trello workflows. It ships with workspaces, projects, tasks, Kanban, real-time comments, roles, activity, analytics, notifications, audit logs, uploads, search, and a command palette.

## Highlights
- Workspace -> projects -> tasks hierarchy
- Kanban board with drag, reorder, and WIP limits
- Real-time comments via SSE
- Activity timeline + admin audit log
- Team management (invites, role updates, removals)
- Notifications inbox
- Analytics dashboard (status distribution + trend)
- Command palette search (Cmd/Ctrl + K)
- File uploads stored locally (ready for S3 swap)
- Role-based access control (server enforced)
- Dark/light theme

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials)
- Zustand
- TanStack Query
- Docker

## Getting Started
### 1) Environment
Copy `.env.example` to `.env` and update if needed.

### 2) Install
```
npm install
```

### 3) Database
This project uses Postgres from Docker on port `5433` by default.

Start the database:
```
docker-compose up -d db
```

Run migrations:
```
npx prisma migrate dev --name init
```

Generate Prisma client:
```
npm run prisma:generate
```

### 4) Run
```
npm run dev
```
Open http://localhost:3000

## Authentication
- Credentials provider
- Register at `/login`, then sign in

## File Uploads
Uploads are stored in `public/uploads` for local dev.
For production, swap `/api/uploads` to S3 presigned uploads.

## Scripts
- `npm run dev` - dev server
- `npm run build` - production build
- `npm run start` - production server
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migrations
- `npm run prisma:studio` - Prisma Studio

## Project Structure
```
.
├─ app
│  ├─ (app)
│  │  ├─ analytics
│  │  ├─ dashboard
│  │  ├─ inbox
│  │  ├─ settings
│  │  ├─ workspaces
│  │  │  └─ [workspaceId]
│  │  │     ├─ audit
│  │  │     └─ projects
│  │  │        └─ [projectId]
│  ├─ (auth)
│  │  └─ login
│  ├─ api
│  │  ├─ activity
│  │  ├─ analytics
│  │  ├─ attachments
│  │  ├─ auth
│  │  ├─ comments
│  │  ├─ invites
│  │  ├─ notifications
│  │  ├─ projects
│  │  ├─ search
│  │  ├─ tasks
│  │  ├─ uploads
│  │  └─ workspaces
│  ├─ layout.tsx
│  └─ providers.tsx
├─ components
│  ├─ kanban
│  ├─ notifications
│  ├─ command-palette
│  ├─ app-shell.tsx
│  ├─ activity-feed.tsx
│  ├─ attachment-uploader.tsx
│  ├─ project-board.tsx
│  ├─ task-panel.tsx
│  ├─ team-manager.tsx
│  └─ ui
├─ hooks
├─ lib
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
├─ public
│  └─ uploads
├─ scripts
├─ store
├─ styles
├─ types
├─ docker-compose.yml
├─ docker-compose.prod.yml
├─ Dockerfile
└─ README.md
```

## Docker
### Dev
```
docker-compose up --build
```

### Prod
```
docker-compose -f docker-compose.prod.yml up --build
```

## Notes
- If Prisma client generation fails, ensure the dev server is stopped before running `npm run prisma:generate`.
- If you already have a local Postgres running on port 5432, this project uses port 5433 to avoid conflicts.
