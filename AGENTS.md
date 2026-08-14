# AGENT.md - AI Agent & Developer Guidelines for Ryuk 

Welcome to **Ryuk**. This document serves as the primary guidance file for AI Coding Assistants (e.g. Gemini Antigravity, Claude, Cursor) and human contributors working on this codebase.

---

## 1. Project Overview

**Ryuk** is a unified personal knowledge base and developer productivity platform for:
- 🔖 **Bookmark Management**: Automated web clipping, HTML metadata extraction, and tag/category filtering.
- 📝 **Structured Note-Taking**: Block-based notes and code snippets with markdown support.
- ⚡ **Cross-Platform Ecosystem**:
  - **Web Application**: Next.js 16 (App Router) full-stack app.
  - **CLI Tool**: Terminal-based ingestion & resource querying (`cli/`).
  - **Chrome Extension**: Manifest V3 browser extension for fast bookmarking.

---

## 2. Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, Vanilla CSS |
| **Authentication** | `@supabase/ssr` (Supabase Auth - Email/Password & OAuth) |
| **Database & ORM** | PostgreSQL (Supabase) + Drizzle ORM |
| **CLI & Extensions** | Commander.js (CLI), Manifest V3 (Chrome Extension) |

---

## 3. Project File Structure & Important Conventions

```text
dev-nest/
├── src/
│   ├── app/                 # Next.js App Router (pages & API routes)
│   │   ├── (dashboard)/     # Protected dashboard pages (/dashboard, /setting, etc.)
│   │   ├── api/             # REST API endpoints (/api/bookmarks, /api/notes, etc.)
│   │   └── auth/callback/   # Supabase PKCE OAuth/Email callback handler
│   ├── components/          # Reusable UI components & modals
│   ├── features/            # Feature-specific logic & hooks
│   ├── lib/
│   │   └── supabase/        # Supabase SSR client (`client.ts`) & server (`server.ts`)
│   ├── providers/           # Context providers (`auth-provider.tsx`)
│   ├── proxy.ts             # Next.js 16 Proxy/Middleware entry point (Do NOT create middleware.ts)
│   └── store/               # State management stores
├── cli/                     # Command-line interface source
├── drizzle/                 # Drizzle database migrations & schemas
├── .env.example             # Template for required environment variables
└── AGENT.md                 # Agent guidelines and architectural documentation
```

### 🚨 Critical Conventions (Next.js 16 & Supabase SSR)

1. **Proxy vs Middleware (`src/proxy.ts`)**:
   - Next.js 16 uses `src/proxy.ts` as the middleware handler.
   - **Do NOT** create `src/middleware.ts` alongside `src/proxy.ts` as it will break Next.js build compilation.

2. **Supabase Client vs Server Helpers**:
   - Browser/Client components: Use `createClient()` from `@/lib/supabase/client`.
   - Server components & Route handlers: Use `createServerSupabaseClient()` from `@/lib/supabase/server`.

3. **Auth Callback URL Handling**:
   - OAuth and email confirmation links redirect to `/auth/callback?next=/dashboard`.
   - Always ensure `emailRedirectTo` and `redirectTo` in `auth-provider.tsx` use `${window.location.origin}/auth/callback?next=/dashboard`.

---

## 4. Environment Variables Setup

### Local Development (`.env.local`)
Create `.env.local` based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY_OR_PUBLISHABLE_KEY]"
```

### Live Production Deployment (Vercel / Netlify)
When deploying to live hosting platforms:
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the **Environment Variables** in the hosting dashboard.
2. In **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
   - Set **Site URL** to `https://ryuk-vert.vercel.app`
   - Add `https://ryuk-vert.vercel.app/auth/callback` to **Redirect URLs**.
3. Always trigger a **Redeploy** on Vercel after updating environment variables.

---

## 5. Standard Development Workflow & Commands

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Test TypeScript compilation and production build (MANDATORY before declaring fix complete)
pnpm run build

# Open Drizzle database studio
pnpm db:studio
```

---

## 6. Verification Guidelines for AI Assistants

- **Never declare success without build verification**: Run `pnpm run build` after editing application files to ensure TypeScript and Next.js Turbopack compilation pass cleanly.
- **Respect Next.js 16 conventions**: Always inspect `src/proxy.ts` and Next.js server logs for any breaking changes or deprecation notices.
