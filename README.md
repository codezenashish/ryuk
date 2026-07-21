# DevNest

DevNest is an open-source developer workspace and productivity platform designed to centralize bookmarks, rich-text technical notes, and interactive project boilerplate generation into a unified web application.

---

# Overview

DevNest provides software engineers and product teams with a consolidated control center for managing technical resources, drafting specifications, and bootstrapping new applications. The application addresses context switching by integrating bookmark curation with automatic metadata extraction, a slash-command-enabled rich text editor, and an interactive boilerplate command builder.

DevNest is built as a full-stack Next.js application backed by a PostgreSQL database and session-based authentication, accompanied by a Manifest V3 Chrome Extension for browser integration.

---

# Features

### Bookmark Management

- Dynamic category grouping with automated icon assignment and custom category icon pickers.
- Server-side metadata extraction using an HTML meta parser (OpenGraph, Twitter tags, page titles) with automatic fallback to Google S2 favicon services.
- Real-time bookmark listing, filtering, and deletion.
- Integration with the companion Chrome Extension via secure API keys.
- _Planned_: Bookmark JSON/HTML import and export capabilities.

### Notes Workspace

- Block-style rich-text editing engine powered by Tiptap.
- Interactive slash-command menu (`/`) for inserting headers, paragraph blocks, lists, and code blocks.
- Client-side document state management using Zustand.
- Real-time title editing and search filtering across stored notes.

### QuickCraft Boilerplate Generator

- Interactive CLI command builder for generating boilerplate setup scripts.
- Multi-framework support including Next.js, React (Vite), Vue, Svelte, or framework-less library setup.
- Configurable package managers including NPM, Yarn, PNPM, and Bun.
- Modular library selection across Styling (Tailwind CSS, Styled Components, Bootstrap, Sass), Animation (Framer Motion, GSAP, Anime.js), State Management (Redux Toolkit, Zustand, Jotai), Icons (Lucide React, React Icons), and Backend/Auth services (Firebase, Supabase, Auth0).
- Real-time dependency conflict detection engine that alerts users to redundant framework or state selections.
- One-click copyable terminal command generation.

### Authentication and User Security

- Multi-provider session authentication powered by Better Auth with Prisma PostgreSQL persistence.
- Email and password sign-up and login workflows with custom branding.
- Server-side middleware route protection redirecting unauthenticated requests.
- Secure API key generation (`devnest_sec_...`) using cryptographically secure random byte generation for external integrations.

### User Interface and Experience

- Responsive dark-theme design built with Tailwind CSS and Radix/Shadcn primitives.
- Navigation drawer with route tracking and active state indicators.
- Web Application Manifest configured for Progressive Web App (PWA) installation.

### Planned Modules

- _Planned_: Habit Tracking (`/habits`)
- _Planned_: Developer Search (`/search`)
- _Planned_: Social & Friend Connections (`/friends`, `/received`, `/sent`)
- _Planned_: Drawing Workspace / Excalidraw Canvas (`/excalidraw`)
- _Planned_: Code Snippets Manager (`/snippets`)
- _Planned_: API Testing Workspace (`/api-tester`)

---

# Screenshots

> Screenshots will be added here once the UI stabilizes. Contributions of clean, up-to-date screenshots (Dashboard, Bookmarks, Notes Editor, QuickCraft, Chrome Extension popup) are welcome via pull request.

---

# Technology Stack

| Category               | Technology                                                                  |
| ---------------------- | --------------------------------------------------------------------------- |
| Framework              | Next.js 16 (App Router)                                                     |
| Language               | TypeScript 5                                                                |
| Database               | PostgreSQL (Neon Serverless Driver)                                         |
| ORM / Database Adapter | Prisma ORM 7 with `@prisma/adapter-pg` driver adapter                       |
| Authentication         | Better Auth (`better-auth`, `@better-auth/infra`)                           |
| State Management       | Zustand 5, TanStack React Query 5                                           |
| UI Component Libraries | Tiptap 3, Base UI (`@base-ui/react`), Shadcn UI, Tippy.js                   |
| Styling                | Tailwind CSS 4, PostCSS, Class Variance Authority, `clsx`, `tailwind-merge` |
| Animation Libraries    | Framer Motion 12, Lenis Smooth Scroll 1                                     |
| Icon Sets              | Hugeicons (`@hugeicons/react`), Lucide React, React Icons                   |
| HTML Parsing           | Cheerio 1.2                                                                 |
| Build Tools            | Next.js Compiler, TypeScript (`tsc`), PostCSS, Prisma CLI                   |
| Package Manager        | pnpm                                                                        |

---

# Project Architecture

DevNest is organized using Next.js App Router layout conventions and feature-driven module folders.

### Core Folder Responsibilities

- `prisma/`: Schema definitions (`schema.prisma`), client generator settings, and migration path configurations.
- `public/`: Static Web App assets, PWA icons (`icon-192.png`, `icon-512.png`, `apple-icon.png`).
- `src/app/`: Next.js App Router routes, API endpoints, layouts, global styles, and route protection middleware.
  - `src/app/(dashboard)/`: Authenticated dashboard route pages (`dashboard`, `bookmarks`, `notes`).
  - `src/app/(landing)/`: Public landing page marketing views and QuickCraft generator tools.
  - `src/app/api/`: REST API endpoints for authentication (`/api/auth/*`) and extension integration (`/api/extension/*`).
- `src/components/`: Reusable UI components divided into layout wrappers, dashboard navigation, and UI primitives.
- `src/features/`: Domain-specific business logic, Server Actions, hooks, and sub-components grouped by domain:
  - `auth/`: Login and sign-up forms, authentication state hooks, and branding.
  - `bookmarks/`: Bookmark server actions, metadata scraper utilities, dialogs, cards, and toolbars.
  - `notes/`: Tiptap editor integration, slash command extension configuration, and notes view components.
  - `quick-craft/`: Interactive stack data, CLI command builder algorithms, terminal UI, and warning detectors.
  - `settings/`: API key generation dialogs and server actions.
- `src/lib/`: Core service configurations including database pooling (`db.ts`), Better Auth server setup (`auth.ts`), auth client initialization (`auth-client.ts`), and utility helper functions.
- `src/store/`: Zustand global state stores (`useNoteStore.ts`, `useDashboard.ts`).

---

# Installation

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm / yarn / bun
- PostgreSQL database instance (local PostgreSQL or Neon Database)

### 1. Clone the Repository

```bash
git clone https://github.com/codezenashish/devnest.git
cd devnest
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the `.env.example` file to `.env.local` and configure required database and authentication credentials:

```bash
cp .env.example .env.local
```

### 4. Database Setup and Client Generation

Generate the Prisma client artifacts and push database schemas to your PostgreSQL instance:

```bash
pnpm run prebuild
npx prisma db push
```

### 5. Run Development Server

```bash
pnpm run dev
```

The application will be accessible at `http://localhost:3000`.

### 6. Production Build

To build and run the production application:

```bash
pnpm run build
pnpm run start
```

---

# Environment Variables

| Variable Name         | Required | Description                                                       | Example / Default                                                     |
| --------------------- | -------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`        | Yes      | PostgreSQL connection string with SSL mode enabled.               | `postgresql://user:pass@ep-host.aws.neon.tech/neondb?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | Yes      | Base URL of the deployed or local web application.                | `http://localhost:3000`                                               |
| `BETTER_AUTH_URL`     | Yes      | Base authentication service URL used by Better Auth.              | `http://localhost:3000`                                               |
| `BETTER_AUTH_SECRET`  | Yes      | Cryptographic secret key used to sign session cookies and tokens. | `super-secret-random-string`                                          |
| `BETTER_AUTH_API_KEY` | Optional | API key for Better Auth Infra management dashboard.               | `ba_api_key_string`                                                   |
| `GEMINI_API_KEY`      | Optional | API key for optional AI logic integrations.                       | `AIzaSy...`                                                           |

### Environment Variable Template (`.env.example`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devnest?sslmode=disable"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="replace-with-secure-32-byte-secret"
BETTER_AUTH_API_KEY=""
GEMINI_API_KEY=""
```

> **Note:** Never commit `.env.local` or real secrets to version control.

---

# Usage Guide

### Managing Bookmarks

1. Navigate to `/bookmarks` from the dashboard sidebar.
2. Click **Add Bookmark** to open the modal dialog.
3. Enter a target URL. DevNest automatically fetches metadata (title, OpenGraph image, favicon).
4. Select or type a category name and assign an optional category icon.
5. Click **Save Bookmark**.

### Technical Notes Workspace

1. Navigate to `/notes` from the dashboard sidebar.
2. Click **New Note** or select an existing note from the sidebar list.
3. Type `/` anywhere inside the editor canvas to display the Slash Command menu.
4. Use arrow keys or the mouse to insert block elements (headings, bullet lists, code blocks).
5. Note title and body changes are saved automatically in client state.

### Generating Custom Stack Commands in QuickCraft

1. Access QuickCraft via the landing page or `/quick-craft`.
2. Step 1: Select a base project framework (e.g., Next.js, React Vite, Vue, Svelte).
3. Step 2: Select feature libraries across Styling, Animation, State Management, Icons, and Backend.
4. Step 3: Choose your preferred package manager (NPM, Yarn, PNPM, Bun).
5. Review active conflict warnings (e.g., conflicting CSS frameworks or state managers).
6. Copy the generated shell execution command displayed in the terminal panel.

---

# Chrome Extension

### Purpose

The DevNest Chrome Extension (`DevNest Bookmark Saver`) lets users save any active web page to their DevNest account with one click, without leaving their current browser tab.

### Integration with Main Application

The extension communicates with DevNest host endpoints via HTTP REST calls:

- `POST /api/extension/validate`: Verifies user API key credentials.
- `POST /api/extension/save-bookmark`: Extracts the active tab's title, URL, and Google favicon, creating a bookmark under the authenticated user account.

### Permissions

| Permission       | Scope                                                          | Purpose                                                                                                     |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `storage`        | `chrome.storage.local`                                         | Persists the user's API key (`devnestApiKey`) and user name (`devnestUserName`) locally in browser storage. |
| `tabs`           | `chrome.tabs.query`                                            | Queries the active tab URL and page title to automatically populate bookmark fields.                        |
| Host Permissions | `https://devnest-vert.vercel.app/*`, `http://localhost:3000/*` | Enables cross-origin fetch requests to the DevNest backend.                                                 |

### How to Install and Load the Extension in Chrome

1. Clone the companion extension repository (`devnest-extension`).
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the directory containing `manifest.json` (`devnest-extension`).
6. The extension icon will appear in the Chrome toolbar.

### Authentication Flow

1. Log into your DevNest web application account.
2. Open Settings → Extension Key dialog to generate a secure API key (`devnest_sec_...`).
3. Copy the generated API key.
4. Open the DevNest Chrome Extension popup and paste the API key into the setup field.
5. Click **Link Extension**. The extension sends a validation payload to `/api/extension/validate`. On success, the key and user details are saved to `chrome.storage.local`.

### Data Sync Workflow

1. Open any web page in Chrome.
2. Click the DevNest Extension icon in the toolbar.
3. The extension automatically retrieves the tab title and URL.
4. Select or type a category (defaults to `General`).
5. Click **Save Bookmark**. The extension posts data to `/api/extension/save-bookmark` using the `x-api-key` header.
6. The new bookmark appears instantly in the DevNest web application dashboard.

### Installing Updates

To update the extension after code changes:

1. Navigate to `chrome://extensions/`.
2. Locate **DevNest Bookmark Saver**.
3. Click the **Reload** icon on the extension card.

### Extension Repository

The Chrome extension source is maintained in its own repository: [`devnest-extension`](https://github.com/codezenashish/devnest-extension) (Manifest V3).

---

# Available Scripts

| Script Name | Command Line      | Description                                                                                     |
| ----------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `dev`       | `next dev`        | Launches the Next.js development server with hot module replacement at `http://localhost:3000`. |
| `prebuild`  | `prisma generate` | Runs Prisma Client code generation against `prisma/schema.prisma` before build steps.           |
| `build`     | `next build`      | Compiles application code and builds optimized production artifacts.                            |
| `start`     | `next start`      | Starts the production Next.js server.                                                           |
| `lint`      | `eslint`          | Runs ESLint analysis across codebase files.                                                     |

---

# Project Structure

```
dev-nest/
├── prisma/
│   ├── schema.prisma          # Database models & Prisma ORM configuration
│   └── migrations/            # SQL migration scripts
├── public/                    # Static images, PWA icons, and manifests
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, API routes)
│   │   ├── (dashboard)/       # Authenticated app routes (dashboard, bookmarks, notes)
│   │   ├── (landing)/         # Public landing page and QuickCraft builder
│   │   ├── api/               # Server API routes (auth, extension integration)
│   │   ├── login/             # Login route
│   │   ├── signup/            # Registration route
│   │   ├── globals.css        # Tailwind CSS imports and custom global rules
│   │   ├── layout.tsx         # Root HTML layout with providers
│   │   ├── manifest.ts        # PWA metadata manifest definition
│   │   └── proxy.ts           # Route authentication middleware
│   ├── components/            # Shared React UI components
│   │   ├── dashboard/         # Sidebar, navbar, and frame components
│   │   ├── landing/           # Landing page hero, features, and marketing UI
│   │   ├── layout/            # Wrapper layout components
│   │   └── ui/                # UI primitives (buttons, inputs, dialogs)
│   ├── features/              # Feature modules containing server actions and components
│   │   ├── auth/              # Authentication components and branding
│   │   ├── bookmarks/         # Bookmark actions, metadata scraper, and dialogs
│   │   ├── notes/             # Tiptap rich-text editor components and commands
│   │   ├── quick-craft/       # Boilerplate CLI command generator & conflict engine
│   │   └── settings/          # API key management components and actions
│   ├── generated/             # Generated Prisma client output directory
│   ├── lib/                   # Utility helpers and core database/auth client logic
│   │   ├── auth.ts            # Better Auth server configuration
│   │   ├── auth-client.ts     # Better Auth client instance
│   │   ├── db.ts              # PostgreSQL database connection pool & Prisma client instance
│   │   └── utils.ts           # Classname utility helpers (`cn`)
│   └── store/                 # Zustand global client stores
│       ├── useDashboard.ts    # Dashboard UI store
│       └── useNoteStore.ts    # Notes workspace store
├── .env.example               # Template environment variables
├── .env.local                 # Local environment variable overrides (not committed)
├── components.json            # Shadcn UI configuration settings
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js project settings
├── package.json                # Package dependencies and execution scripts
├── pnpm-workspace.yaml         # PNPM package workspace configuration
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript compiler configuration
├── LICENSE                    # Full license text
└── CODE_OF_CONDUCT.md         # Community guidelines
```

---

# Performance

The project incorporates several performance optimizations:

- **Next.js Server Components**: Renders static layout frames and data-heavy components on the server to reduce client bundle size.
- **Client Component Isolation**: Restricts `"use client"` directives to interactive components (e.g., editors, dialogs, command generators) to minimize re-renders.
- **Font Optimization**: Uses `next/font/google` for pre-loading and self-hosting `Inter` and `Instrument Serif` font files with zero layout shift (CLS).
- **PostgreSQL Connection Pooling**: Implements `pg.Pool` with connection limits (`max: 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 10000`), wrapped with the `@prisma/adapter-pg` driver adapter to maintain database responsiveness under load.
- **Request Timeouts**: Uses `AbortSignal.timeout(8000)` during server-side metadata web scraping to prevent stalled HTTP connections.
- **Client State Caching**: Leverages TanStack React Query (`@tanstack/react-query`) for cached bookmark fetching and invalidation strategies.

---

# Security

### Authentication and Session Handling

- Session authentication is managed by Better Auth, with session data stored in PostgreSQL.
- Passwords and credentials are managed through server-side Better Auth authentication protocols.

### Route Middleware Protection

- `src/proxy.ts` inspects session tokens via `authClient.getSession` headers.
- Unauthenticated requests targeting `/dashboard` routes are redirected to `/login`.
- Authenticated users attempting to visit `/login` or `/signup` are automatically redirected to `/dashboard`.

### API Key Security

- Extension API keys (`devnest_sec_...`) are generated using Node.js `crypto.randomBytes(24)` converted to hexadecimal strings.
- API keys are linked uniquely (`@unique`) to a single User record in PostgreSQL.

### CORS and API Endpoint Security

- CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`) are strictly defined on extension API endpoints (`/api/extension/validate`, `/api/extension/save-bookmark`).
- Server actions enforce authenticated user checks (`getAuthenticatedUserId()`) against session cookies before executing database mutations.

### Database Constraints

- Foreign key constraints enforce strict `onDelete: Cascade` rules across Sessions, Accounts, Bookmarks, Categories, and Notes to prevent dangling or orphaned data records.

If you discover a security vulnerability, please do not open a public issue — see [SECURITY.md](./SECURITY.md) (or contact the maintainer directly) for responsible disclosure steps.

---

# Roadmap

### Implemented

- [x] Session-based user authentication (Better Auth with Prisma PostgreSQL).
- [x] Bookmark management with dynamic categories and icon selection.
- [x] Automated website metadata & favicon scraper using Cheerio.
- [x] Block-style rich text notes workspace with Tiptap and Slash Commands (`/`).
- [x] QuickCraft interactive boilerplate CLI command generator with conflict detection.
- [x] API key generation system (`devnest_sec_...`).
- [x] Chrome Extension (Manifest V3) integration for single-click bookmark saving.
- [x] Progressive Web App (PWA) manifest configuration.

### Planned

- [ ] Bookmark import & export (JSON / HTML format parser).
- [ ] Habit Tracker module (`/habits`).
- [ ] Developer search integration (`/search`).
- [ ] Social sharing & friend activity feeds (`/friends`, `/received`, `/sent`).
- [ ] Excalidraw whiteboarding canvas integration (`/excalidraw`).
- [ ] Code snippets storage library (`/snippets`).
- [ ] In-app REST API testing client (`/api-tester`).

---

# Contributing

Contributions are welcome from the open-source community. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating, then follow this workflow:

1. **Fork the repository** — create a personal fork on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** using clear, conventional commit messages:
   ```bash
   git commit -m "feat: add bookmark search filter capability"
   ```
4. **Lint and format** your code:
   ```bash
   pnpm run lint
   ```
5. **Push your branch and open a Pull Request** against `main`, with a clear description of the changes.

---

# License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](./LICENSE) file for the full license text.

---

# Support

For questions, bug reports, or feature suggestions:

- **Issue Tracker**: Open an issue on GitHub for bugs or feature requests.
- **Discussions**: Join project architecture and feature conversations on GitHub Discussions.

When filing an issue, include your operating system, browser version, Node.js version, and detailed steps to reproduce.

---

# Acknowledgements

DevNest is built using open-source technologies:

- [Next.js](https://nextjs.org/) — React framework for the web
- [Better Auth](https://www.better-auth.com/) — Authentication for TypeScript
- [Prisma](https://www.prisma.io/) — Next-generation ORM for Node.js and TypeScript
- [Neon Database](https://neon.tech/) — Serverless Postgres
- [Tiptap](https://tiptap.dev/) — Headless WYSIWYG text editor engine
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animation library for React
- [Cheerio](https://cheerio.js.org/) — Fast, flexible & lean implementation of core jQuery for the server
- [Hugeicons](https://hugeicons.com/) — Modern icon library
