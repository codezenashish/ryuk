# Ryuk 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![ORM: Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A unified developer workflow ecosystem featuring a centralized web application, command-line terminal tool (CLI), and browser extension—powered by Supabase and Drizzle ORM.

---

![image](/public/landing.png)


## Overview

This project provides a fully integrated toolset across three interfaces:
1. **Web Dashboard:** Central hub for viewing data, analytics, and managing application settings.
2. **CLI Terminal:** Command-line tool for developers to query data and automate tasks without leaving the terminal.
3. **Browser Extension:** Manifest V3 extension for quick capture and contextual actions directly from the browser.

All interfaces connect directly to a single **Supabase PostgreSQL** instance with strict type safety managed by **Drizzle ORM**.

---

## Tech Stack

- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth)
- **Database ORM & Migrations:** Drizzle ORM, Drizzle Kit
- **Web Application:** Next.js 16 (App Router), Tailwind CSS 4, TypeScript
- **CLI Interface:** Node.js, TypeScript, Commander.js
- **Browser Extension:** Manifest V3, TypeScript, Vite

---

## Project Structure

```text
.
├── src/                  # Next.js Web Application source code
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # Reusable React components (Shadcn UI)
│   ├── features/         # Feature-specific hooks and modules
│   ├── lib/              # Supabase clients and utility functions
│   └── proxy.ts          # Next.js middleware handler
├── cli/                  # Command Line Interface (CLI) source code
├── drizzle/              # Drizzle ORM schemas and database migrations
├── extension/            # Chrome Extension (Manifest V3) source code
└── tests/                # Unit and integration tests (Vitest)
```

---

## Key Features

### Web Application
- **Automated Web Clipping**: Paste any link to automatically extract page titles, descriptions, and high-resolution favicons.
- **Multi-Category & Tag Filtering**: Organize bookmarks with custom categories, icons, color codes, and user-scoped unique tags.
- **Block-Based & Plain Text Note Editor**: Create and manage structured documentation and code snippets with markdown support.
- **API Key Lifecycle Management**: Generate, view, and revoke external API keys for CLI and browser extension integrations directly from the settings workspace.

### Command-Line Interface (CLI)
- **Headless Ingestion**: Add bookmarks and capture quick notes directly from terminal windows without context-switching.
- **Credentials Persistence**: Secure local storage of API keys for persistent session management.
- **Quick Querying**: List, search, and inspect saved resources directly within shell environments.

### Chrome Extension
- **One-Click Page Capture**: Save current browser tabs with auto-populated title, URL, and meta fields.
- **Immediate Synchronization**: Saved bookmarks instantly reflect across web and CLI workspaces.
- **Configurable Endpoint Target**: Connect the extension to self-hosted or cloud-deployed server instances.

---

## Getting Started

Follow these instructions to set up the web application, CLI, and Chrome extension locally.

### Prerequisites

Ensure the following tools are installed on your machine:
- Node.js (v20.0.0 or higher)
- pnpm (v10.0.0 or higher)
- Supabase Project (Create a project at [Supabase](https://supabase.com))

### Web Application Setup

1. **Database Migration & Drizzle Configuration**
   Generate the Drizzle schema and push it to your Supabase database:

   ```bash
   # Generate SQL migrations
   pnpm db:generate
   
   # Apply database schema to your Supabase PostgreSQL instance
   pnpm db:push
   ```

2. **Running the Development Server**
   Start the local Next.js Turbopack development server:

   ```bash
   pnpm dev
   ```

   The application will be accessible at `http://localhost:3000`.

### CLI Terminal Tool Setup

The CLI provides terminal-native access to your bookmarks and notes.

#### One-Line User Installation
End-users can install the CLI globally without cloning the repository.

- **Linux / macOS**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/codezenashish/ryuk/main/install.sh | bash
  ```

- **Windows (PowerShell)**
  ```powershell
  irm https://raw.githubusercontent.com/codezenashish/ryuk/main/install.ps1 | iex
  ```

#### Local Development Installation
If you are developing locally from source, link the CLI binary globally from the root directory:

```bash
# Build the CLI tool
pnpm build:cli

# Link local CLI binary globally
pnpm link --global
```

#### CLI Command Reference

##### Authentication & Setup
```bash
# Authenticate using your API Key
ryuk login

# Show current authentication status & user profile
ryuk status

# Sign out and clear stored credentials
ryuk logout

# Remove CLI configuration and links
ryuk uninstall
```

##### Unified Search
```bash
# Interactive menu asking whether to search Bookmarks or Notes
ryuk search
```

##### Bookmark Commands
```bash
# Add a bookmark with metadata auto-extraction
ryuk add https://nextjs.org

# Direct live fuzzy search for bookmarks only
ryuk bookmark search

# List saved bookmarks
ryuk list
```

##### Notes & Code Snippets Commands
```bash
# Create a new note or code snippet
ryuk notes add "Deployment Checklist"

# Direct live fuzzy search for notes & snippets only
ryuk notes search

# List saved notes
ryuk notes list
```

### Browser Extension Setup

The Chrome Extension allows instant saving of web links directly from your browser toolbar.

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked** in the top-left menu.
4. Select the `extension/` directory located within the repository.
5. Click the Extension icon in your Chrome toolbar.
6. Open **Options** or **Settings**.
7. Enter your Web Instance URL (e.g., `http://localhost:3000` or your deployed domain).
8. Enter your API Key obtained from the `/setting` page.
9. Click **Save Credentials**.

---

## Environment Variables

Create a `.env.local` file in the root directory by copying the sample configuration:

```bash
cp .env.example .env.local
```

Configure your `.env.local` file with the required Supabase environment variables:

```env
# Supabase PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase Auth / Client Variables
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
```

---

## API Reference

The server exposes a REST API for programmatic interaction and integrations. All external API requests require a Bearer token header.

`Authorization: Bearer <YOUR_API_KEY>`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookmark` | Retrieve bookmarks for the authenticated session | Yes (Session Cookie) |
| `POST` | `/api/bookmark` | Create a new bookmark with optional auto-parsing | Yes (Session Cookie) |
| `GET` | `/api/bookmark/external` | Retrieve bookmarks via API key | Yes (Bearer Token) |
| `POST` | `/api/bookmark/external` | Add a bookmark via external tool or CLI | Yes (Bearer Token) |
| `GET` | `/api/bookmark/metadata` | Extract page title, description, and favicon for a URL | No |
| `GET` | `/api/user/api-key` | Retrieve current API key | Yes (Session Cookie) |
| `POST` | `/api/user/api-key` | Generate or regenerate API key | Yes (Session Cookie) |

---

## Roadmap

- [ ] Add dark mode support for web interface
- [ ] Implement bi-directional synchronization with Notion
- [ ] Support custom tags and folder hierarchies in the extension

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**: Create your feature branch from `main` (`git checkout -b feature/amazing-feature`).
2. **Follow Code Standards**: Ensure code complies with ESLint and TypeScript rules (`pnpm lint`).
3. **Commit Changes**: Write concise commit messages (`git commit -m 'Add amazing feature'`).
4. **Submit Pull Request**: Open a PR describing your changes, testing steps, and relevant context.

---

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

If you have any questions or suggestions, feel free to reach out via GitHub Issues or contact [codezenashish](https://github.com/codezenashish).
