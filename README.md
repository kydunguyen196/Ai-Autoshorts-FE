# AutoShorts AI Frontend (Next.js MVP)

Production-minded MVP dashboard for AutoShorts AI using real backend APIs.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios

## Backend Assumption

Backend is already running at:

- `http://localhost:8080`

Configured via:

- `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

## Features Implemented

- Public landing page at `/`
- Auth: register/login/logout with JWT stored client-side
- Protected dashboard app shell (`/app/*`)
- Current-user bootstrap (`/api/auth/me`)
- Active channel selector persisted in local storage
- Frontend bootstrap metadata integration (`/api/frontend/bootstrap`)
- Dashboard overview with recent jobs/topics and queue snapshot
- Jobs feed + detail + retry + non-terminal polling
- Single video generation form
- Topics feed + create + import
- Batch generation with multi-item editor + result summary
- Channels list + create + active channel switching

## Run

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.local.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - run production server

## Project Structure

```text
src/
  app/
    (auth)/
      login/
      register/
    (dashboard)/app/
      batch/
      channels/
      generate/
      jobs/
      topics/
    layout.tsx
    page.tsx
  components/
    layout/
    providers/
    ui/
  features/
    auth/
    jobs/
  hooks/
  lib/
  services/
  types/
```

## API Contracts Used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/channels`
- `POST /api/channels`
- `GET /api/frontend/bootstrap`
- `GET /api/videos/feed`
- `GET /api/videos/{jobId}`
- `GET /api/videos`
- `POST /api/videos/generate`
- `POST /api/videos/batch-generate`
- `POST /api/videos/{jobId}/retry`
- `GET /api/topics/feed`
- `POST /api/topics`
- `POST /api/topics/import`
- `GET /api/topics`
- `GET /api/health`

## Notes

- No mock backend is used.
- Channel ownership is respected by always including selected `channelId`/`defaultChannelId` where needed.
- Jobs page/detail automatically polls for non-terminal states (`PENDING`/`PROCESSING`).
