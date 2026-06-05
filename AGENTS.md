<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DevNest Agent Guide

Welcome to **DevNest**, the developer's centralized workspace built with Next.js (App Router), TypeScript, Prisma, and Tailwind CSS. This guide provides details on the tech stack, directory structure, database models, patterns, and conventions used in this project.

---

## 1. Project Overview
DevNest is a secure, interactive dashboard application built for developers to organize bookmarks, manage interconnected code notes, visualize systems diagrams, and build habits in a centralized dark-mode interface. 

Currently, the primary feature implemented is **Bookmarks Manager**:
- Organizes bookmarks under user-customizable folders/categories.
- Automatically fetches bookmark website metadata (title and favicon/fallback icon) using a Cheerio-based parser when user provides a URL.
- Supports creation, deletion, and bulk editing of bookmarks (titles, URLs, and categories) with full database transaction safety and validation.
- Employs premium visuals using Framer Motion animations and dark mode styling.

---

## 2. Tech Stack & Dependencies
* **Framework**: Next.js `16.2.6` (App Router, using ESM modules)
* **Runtime / Engine**: React `19.2.4` & React DOM `19.2.4`
* **Package/Runtime Runner**: Bun (see [bun.lock](file:///home/ashish/Desktop/dev-nest/bun.lock))
* **Database & ORM**: Prisma `^7.8.0` with `@prisma/adapter-pg` `^7.8.0` and `pg` `^8.21.0` (PostgreSQL client adapter)
* **Authentication**: Clerk via `@clerk/nextjs` `^7.4.2`
* **Data Fetching & State**: `@tanstack/react-query` `^5.100.14` (React Query / TanStack Query)
* **Animations**: `framer-motion` `^12.40.0`
* **Styling**: `tailwindcss` `^4.3.0` (configured using `@tailwindcss/postcss` `^4.3.0`), `class-variance-authority` `^0.7.1`, `clsx` `^2.1.1`, and `tailwind-merge` `^3.6.0`
* **HTML Parsing**: `cheerio` `^1.2.0`
* **Form & Schema Validation**: `zod` `^4.4.3`
* **State Management**: `zustand` `^5.0.14`
* **Drag and Drop**: `@dnd-kit/react` `^0.4.0`
* **Icons**: `lucide-react` `^1.17.0` & `react-icons` `^5.6.0`

---

## 3. Folder Structure
The codebase follows a modular feature-based structure for localizing feature code, and a standard App Router layout for routing:

```
dev-nest/
├── prisma/
│   ├── migrations/             # Database migrations
│   ├── schema.prisma           # Prisma database schema
├── prisma.config.ts            # Prisma config file configuring custom path and dotenv loads
├── public/                     # Static assets (images, favicons, etc.)
└── src/
    ├── app/                    # Next.js App Router routing
    │   ├── (auth)/             # Route group for Clerk authentication routes
    │   ├── (dashboard)/        # Route group for dashboard layout
    │   │   ├── bookmarks/      # Bookmarks page route
    │   │   └── dashboard/      # Main dashboard home route
    │   │   └── layout.tsx      # Dashboard workspace layout with header and sidebar
    │   ├── (landing)/          # Route group for marketing landing pages and docs
    │   ├── api/                # API routes directory
    │   ├── globals.css         # CSS globals & Tailwind directives
    │   └── layout.tsx          # Root Layout configuring ClerkProvider and QueryProvider
    ├── components/             # Reusable global UI and navigation components
    │   ├── navigation/         # Workspace navigation components (Sidebar, WorkspaceHeader)
    │   ├── ui/                 # Basic UI component primitives (e.g. Button)
    │   └── PageTransition.tsx  # Framer Motion page wrapper
    ├── features/               # Feature-based folder division (Core Pattern)
    │   └── bookmarks/          # Bookmarks Feature Directory
    │       ├── actions/        # Server Actions (bookmark-actions.ts, scrape-metadata-action.ts)
    │       ├── components/     # UI Dialogs & elements (AddBookmarkDialog, BookmarkCategoryGrid, EditAllDialog, etc.)
    │       ├── constants/      # Feature-specific configuration and constant maps
    │       ├── hooks/          # React hooks (use-bookmark-queries, use-category-combobox, use-dropdown-dismiss)
    │       └── utils/          # Scraping utils and category icon registry maps
    ├── generated/
    │   └── prisma/             # Generated Prisma client location
    ├── hooks/                  # Global helper hooks (currently empty)
    ├── lib/                    # Standard initialization files
    │   ├── classname-merge.ts  # clsx and tailwind-merge helper (cn utility)
    │   ├── prisma-client.ts    # Custom Prisma Client builder with adapter-pg mapping
    │   └── providers/          # Shared Provider wrappers (e.g. QueryProvider)
    └── types/                  # Global TS type definitions (currently empty)
```

---

## 4. Database Models & Keys
The database schema uses PostgreSQL. It is defined in [schema.prisma](file:///home/ashish/Desktop/dev-nest/prisma/schema.prisma).

### ID Schemes (Very Important)
* **`Bookmark`**:
  * **ID Type**: `Int` (`@id @default(autoincrement())`) — **Very Important**: It is an integer, not a string/CUID.
  * **Other keys**: `shareToken` is a `String` (`@unique @default(cuid())`), and `categoryId` is a nullable relation reference `String?`.
* **`Category`**:
  * **ID Type**: `String` (`@id @default(cuid())`) — **Very Important**: It is a CUID.
* **`Tag`**:
  * **ID Type**: `String` (`@id @default(cuid())`) — **Very Important**: It is a CUID.

#### Model Definitions:
* **`Bookmark`**: Represents a user's saved link. Belonging to a `Category` is optional. Ordering is determined by `position` (integer).
* **`Category`**: Holds color styling, icons, and positions for grouping bookmarks. Unique per `userId`.
* **`Tag`**: Shared tags system linked in a many-to-many relationship with `Bookmark`.

---

## 5. Coding Conventions
* **Domain Isolation**: Put all logic related to features inside the `src/features/[feature-name]` folder. Do not write feature components directly in the global `src/components` directory unless they are used across multiple separate features.
* **Naming**:
  * Directories and general scripts/files: kebab-case (e.g., `scrape-metadata-action.ts`, `use-bookmark-queries.ts`).
  * React Components: PascalCase (e.g., `AddBookmarkDialog.tsx`).
  * Helper utilities: CamelCase or kebab-case (e.g., `classname-merge.ts`).
* **Imports**: Use the `@/` tsconfig absolute path alias mapping (e.g. `import { db } from "@/src/lib/prisma-client"`).
* **Animations**: All interactive dialogs/components must use `framer-motion` for premium animations (e.g., `AnimatePresence` and custom transition spring stiffness/damping properties).
* **Styling**: Tailwind CSS style definitions directly inside the classes. Use `cn(...)` from `classname-merge` to handle conditional class merging safely.
* **Data Flow**: Client pages and client components do not query the database directly. They trigger TanStack Query hook mutations, which invoke Server Actions, which communicate with the custom Prisma wrapper (`db`).

---

## 6. TanStack Query Key Structure & Mutation Patterns
All query keys and hooks are defined inside feature hooks (e.g. [use-bookmark-queries.ts](file:///home/ashish/Desktop/dev-nest/src/features/bookmarks/hooks/use-bookmark-queries.ts)).

### Query Keys
* Root prefix: `const BOOKMARKS_KEY = ["bookmarks"] as const;`
* Query parameters: Dynamic arguments like `userId` are appended to target the user-scoped cache: `queryKey: [...BOOKMARKS_KEY, userId]`.

### Mutation Rules & Optimistic Updates
* **Optimistic Cache manipulation**:
  * `onMutate` must call `queryClient.cancelQueries({ queryKey })` to halt active fetches.
  * Snapshot the current state using `queryClient.getQueryData`.
  * Update cache values with temporary IDs (e.g., `-Date.now()` or `optimistic-ID`).
  * Return `{ previousData }` context to roll back in `onError` via `queryClient.setQueryData`.
* **Settling Cache**: Use `onSettled` (runs on both success and failure) to invoke `queryClient.invalidateQueries` ensuring the client stays in sync with the database.
* **Mutation Exception Handling**: Server actions that return objects like `{ success: false, error: ... }` instead of throwing must be intercepted in the `mutationFn`. You **MUST** throw an Error if `success === false` to ensure TanStack Query routes the execution flow into the `onError` handler.

---

## 7. Server Actions
* **Location**: Feature-specific actions directories, e.g., `src/features/bookmarks/actions/`.
* **Convention**: File name suffix `-actions.ts` or `-action.ts`.
* **Rule**:
  * Must contain `"use server";` at the very top.
  * Return standard response payloads (e.g., `{ success: true, bookmark }` or `{ success: false, error: "..." }`).
  * Perform authorization checks using parameters (e.g. verifying `userId` matches the row's owner before doing data modification).

---

## 8. Known Gotchas & Bugs to Avoid
* **Gotcha 1: useEffect Overwrites Client-State During Refetches**
  * When opening an edit dialog loaded with server state (e.g. `EditAllDialog.tsx`), the state might initialize in a `useEffect` on query data load.
  * **Issue**: A background query refetch or cache invalidation will update the query reference, re-triggering the `useEffect` and silently wiping out all unsaved edits.
  * **Fix**: Use a `useRef` guard (e.g., `initialisedRef.current = false`) to ensure state initialization runs exactly once when the modal is opened. Clean up the ref inside an unmount/closed-state useEffect.
* **Gotcha 2: Prisma update `where` constraints**
  * **Issue**: Prisma's `db.model.update` expects unique parameters (`@id` or `@@unique` constraints) in the `where` clause. If you attempt to update passing `where: { id: number, userId: string }` where there is no unique index covering both columns, Prisma will throw a build/runtime validation error.
  * **Fix**: Provide *only* the primary unique key (like `id`) in the `where` parameter. Ownership/authorization logic should be validated ahead of the update query using a query like `db.model.findMany({ where: { id: { in: ids }, userId } })`.
* **Gotcha 3: Custom Prisma Client Output**
  * **Issue**: Standard `@prisma/client` package imports might refer to empty stubs because the Prisma generator output in `schema.prisma` is redirected to `../src/generated/prisma`.
  * **Fix**: Always import the Prisma database client instance `db` from `@/src/lib/prisma-client`, or if using types, import directly from `@/src/generated/prisma`.
* **Gotcha 4: Route IDs Type Matching**
  * **Issue**: Bookmark `id` is a database `Int`. Next.js parameters are parsed as strings by default.
  * **Fix**: Explicitly cast IDs to integers (e.g., `Number(id)` or `parseInt(id)`) before passing them to server actions or querying them via Prisma.

---

## 9. Common Terminal Commands
Always execute command prefixes using `bun` / `bunx`.

* **Dev Environment**:
  ```bash
  bun dev
  ```
* **Build Application**:
  ```bash
  bun run build
  ```
* **Generate Prisma Client**:
  ```bash
  bunx prisma generate
  ```
* **Run Database Migrations**:
  ```bash
  bunx prisma migrate dev
  ```
* **Push Prisma Schema Changes directly to DB**:
  ```bash
  bunx prisma db push
  ```
* **Open Prisma Studio**:
  ```bash
  bunx prisma studio
  ```
* **Run Linter**:
  ```bash
  bun run lint
  ```
