# Ryuk

Ryuk is a unified personal knowledge base and productivity ecosystem engineered for seamless bookmark management, structured note-taking, and cross-platform data synchronization. Built for modern developers and power users, Ryuk integrates a responsive web application, a headless CLI, and a lightweight Chrome extension into a single cohesive data pipeline backed by secure Bearer token authentication.

---

## System Architecture & Cross-Platform Integration Overview

Ryuk operates on a centralized API service architecture that connects three distinct client interfaces to a common PostgreSQL datastore.

```
+-------------------------------------------------------------------+
|                        Ryuk Core Platform                         |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP / REST API (Bearer Token)
                                  |
    +-----------------------------+-----------------------------+
    |                             |                             |
    v                             v                             v
+-----------------------+ +-----------------------+ +-----------------------+
|    Web Application    | |   CLI Terminal Tool   | |   Chrome Extension    |
|  (Next.js App Router) | |   (Node.js / Commander)| |     (Manifest V3)     |
+-----------------------+ +-----------------------+ +-----------------------+
    |                             |                             |
    +-----------------------------+-----------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                 Prisma ORM & PostgreSQL Database                   |
+-------------------------------------------------------------------+
```

### Architecture Highlights

- Single Source of Truth: All bookmarks, categories, tags, and notes reside in a centralized PostgreSQL relational database managed by Prisma ORM.
- Unified Authentication: Web sessions are managed via Better Auth (Email/Password & Social OAuth). Headless CLI instances and browser extensions authenticate securely using user-generated API keys (Bearer tokens).
- Streamlined Metadata Ingestion: Server-side streaming HTML parsers automatically extract domain metadata, favicon references, and page summaries with sub-second fallbacks.

---

## Core Features

### Web Application
- Automated Web Clipping: Paste any link to automatically extract page titles, descriptions, and high-resolution favicons.
- Multi-Category & Tag Filtering: Organize bookmarks with custom categories, icons, color codes, and user-scoped unique tags.
- Block-Based & Plain Text Note Editor: Create and manage structured documentation and code snippets with markdown support.
- API Key Lifecycle Management: Generate, view, and revoke external API keys for CLI and browser extension integrations directly from the settings workspace.

### Command-Line Interface (CLI)
- Headless Ingestion: Add bookmarks and capture quick notes directly from terminal windows without context-switching.
- Credentials Persistence: Secure local storage of API keys for persistent session management.
- Quick Querying: List, search, and inspect saved resources directly within shell environments.

### Chrome Extension
- One-Click Page Capture: Save current browser tabs with auto-populated title, URL, and meta fields.
- Immediate Synchronization: Saved bookmarks instantly reflect across web and CLI workspaces.
- Configurable Endpoint Target: Connect the extension to self-hosted or cloud-deployed Ryuk server instances.

---

## Technology Stack

| Layer | Technology | Usage Description |
| :--- | :--- | :--- |
| Framework | Next.js 16 (App Router) | Full-stack SSR, Server Actions, and REST API handlers |
| Language | TypeScript 5 | End-to-end type safety across web app, CLI, and extension |
| Styling | Tailwind CSS 4 | Utility-first styling system |
| UI Components | Shadcn UI & Base UI | Accessible component primitives and modal dialogs |
| Database | PostgreSQL (Neon DB) | Relational datastore for users, sessions, bookmarks, and notes |
| ORM | Prisma ORM 7 | Schema definitions, migration management, and type-safe queries |
| Authentication | Better Auth | Session-based web auth and Bearer token verification |
| CLI Framework | Commander.js & Inquirer | Command parsing, terminal interactivity, and shell outputs |
| Parser | Cheerio | Server-side HTML metadata extraction streaming |

---

## Getting Started & Local Development Setup

Follow these instructions to set up the Ryuk web application and database locally.

### Prerequisites

Ensure the following tools are installed on your machine:
- Node.js (v20.0.0 or higher)
- pnpm (v10.0.0 or higher)
- PostgreSQL database instance (local PostgreSQL or serverless PostgreSQL like Neon DB)

### Environment Variables Setup

Create a `.env.local` file in the root directory by copying the sample configuration:

```bash
cp .env.example .env.local
```

Configure your `.env.local` file with the required environment variables:

```env
# Database Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/ryuk_db?schema=public"

# Better Auth Secret
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Optional Social OAuth Credentials
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Database Migration & Prisma Configuration

Generate the Prisma Client and push the database schema:

```bash
# Generate Prisma Client types
pnpm prisma generate

# Apply database schema to your PostgreSQL instance
pnpm prisma db push
```

### Running the Development Server

Start the local development server:

```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000`.

---

## CLI Installation and Usage

The Ryuk CLI provides terminal-native access to your bookmarks and notes.

### One-Line User Installation

End-users can install the Ryuk CLI globally without cloning the repository.

#### Linux / macOS
```bash
curl -fsSL https://raw.githubusercontent.com/codezenashish/devnest/main/install.sh | bash
```

#### Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/codezenashish/devnest/main/install.ps1 | iex
```

### Local Development Installation

If you are developing Ryuk locally from source, link the CLI binary globally from the root directory:

```bash
# Link local CLI binary globally
pnpm link --global
```

### Authentication

Authenticate the CLI tool with your Ryuk account using an API Key generated from the Web Application (`/setting` page):

```bash
ryuk login
```

You will be prompted to enter your API key:
```
? Enter your Ryuk API Key: ryuk_sk_abcdef1234567890...
```

To inspect your current authentication state:

```bash
ryuk status
```

To remove stored credentials:

```bash
ryuk logout
```

### Command Reference

#### Adding Bookmarks
```bash
# Add a bookmark with title auto-extraction
ryuk add https://nextjs.org

# Add a bookmark with explicit title and category
ryuk add https://tailwindcss.com --title "Tailwind CSS" --category "Development"
```

#### Unified Search Switcher
```bash
# Interactive menu asking whether to search Bookmarks or Notes
ryuk search
```

#### Bookmark Commands
```bash
# Direct live fuzzy search for bookmarks only
ryuk bookmark search

# Add a bookmark
ryuk add https://nextjs.org

# List saved bookmarks
ryuk list
```

#### Notes & Code Snippets Commands
```bash
# Direct live fuzzy search for notes & snippets only
ryuk notes search

# Create a new note or code snippet
ryuk notes add "Deployment Checklist"

# List saved notes
ryuk notes list
```

---

## Chrome Extension Installation

The Chrome Extension allows instant saving of web links directly from your browser toolbar.

### Loading the Unpacked Extension

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable Developer mode using the toggle in the top-right corner.
3. Click Load unpacked in the top-left menu.
4. Select the `extension/` directory located within the Ryuk repository.

### Configuring Extension Options

1. Click the Ryuk Extension icon in your Chrome toolbar.
2. Open Options or Settings.
3. Enter your Ryuk Web Instance URL (e.g., `http://localhost:3000` or your deployed domain).
4. Enter your API Key obtained from `/setting`.
5. Click Save Credentials.

---

## API Reference Overview

Ryuk exposes a REST API for programmatic interaction and integrations. All external API requests require a Bearer token header.

`Authorization: Bearer <YOUR_API_KEY>`

### Endpoints Summary

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

## Contributing Guidelines

Contributions are welcome. Please follow these guidelines:

1. Fork the Repository: Create your feature branch from `main` (`git checkout -b feature/amazing-feature`).
2. Follow Code Standards: Ensure code complies with ESLint and TypeScript rules (`pnpm lint`).
3. Commit Changes: Write concise commit messages (`git commit -m 'Add amazing feature'`).
4. Submit Pull Request: Open a PR describing your changes, testing steps, and relevant context.

---

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](file:///home/ashish/Desktop/dev-nest/LICENSE) file for details.
