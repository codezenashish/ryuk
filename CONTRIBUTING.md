# Contributing to DevNest

Thank you for your interest in contributing to DevNest! We welcome contributions from developers of all skill levels. This document outlines the process for contributing to the main web application and companion Chrome extension.

---

## Code of Conduct

All contributors and community members are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating to ensure a welcoming and inclusive environment.

---

## Getting Started

### Prerequisites

Before setting up your local development environment, ensure you have installed:

- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher (recommended package manager)
- **PostgreSQL**: Local instance or remote database (such as Neon Database)
- **Git**: Latest version

### Local Development Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/devnest.git
   cd devnest
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file and fill in required values:
   ```bash
   cp .env.example .env.local
   ```
   Set your `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`.

4. **Initialize Database**
   Generate the Prisma client and sync schema with your PostgreSQL database:
   ```bash
   pnpm run prebuild
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   pnpm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## How to Contribute

### 1. Reporting Bugs

Before creating a bug report, search existing issues to see if it has already been reported. If not, open a new issue and include:

- A clear and descriptive title.
- Operating system, browser version, and Node.js version.
- Step-by-step instructions to reproduce the issue.
- Expected vs. actual behavior.
- Relevant screenshots or terminal stack traces.

### 2. Requesting Features

To suggest an enhancement or new feature:

- Check existing issues and open discussions.
- Open a feature request issue explaining the proposal, use cases, and why it benefits DevNest users.

### 3. Submitting Pull Requests

1. **Create a Feature Branch**
   Branch off from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-bug-fix
   ```

2. **Keep Changes Focused**
   Limit pull requests to a single logical feature or bug fix. Avoid mixing unrelated refactoring or code cleanup.

3. **Run Code Quality Checks**
   Before committing, verify that your code passes linting and formatting rules:
   ```bash
   pnpm run lint
   ```

4. **Submit your Pull Request**
   Push your branch to GitHub and open a Pull Request against `main`. Provide a detailed description of your changes and link any related issues.

---

## Style Guidelines

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <short description>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code formatting, missing semicolons, etc. (no functional change)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling updates

**Examples:**
```bash
git commit -m "feat(bookmarks): add search filter by category"
git commit -m "fix(auth): handle expired session token redirect"
git commit -m "docs(readme): update environment variable table"
```

### TypeScript & Code Conventions

- **Strict Typing**: Maintain explicit TypeScript types. Avoid using `any` where possible.
- **App Router Architecture**: Place route handlers under `src/app/api/` and page routes under `src/app/(dashboard)/` or `src/app/(landing)/`.
- **Feature Organization**: Keep domain logic, server actions, and domain-specific UI components grouped inside `src/features/<feature-name>/`.
- **Reusable UI Components**: Generic, reusable UI primitives belong in `src/components/ui/`.
- **Styling**: Use Tailwind CSS utility classes and `clsx` / `tailwind-merge` (`cn` helper) for dynamic styling. Avoid inline styles.
- **Server Actions**: Server action files must start with `"use server"` and enforce authenticated user checks (`getAuthenticatedUserId()`).

---

## Contributing to the Chrome Extension

If your contribution affects the companion Chrome extension (`devnest-extension`):

1. Load the unpacked extension from Chrome (`chrome://extensions/` with Developer Mode enabled).
2. Test API key linking and bookmark saving against your local dev server (`http://localhost:3000`).
3. Ensure Manifest V3 compatibility and minimal permission scope (`storage`, `tabs`).

---

## Licensing

By contributing to DevNest, you agree that your contributions will be licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
