# DevNest

DevNest is a secure, interactive dashboard application built for developers. It provides a centralized interface to organize bookmarks, manage interconnected code notes, visualize systems diagrams, and build habits. The application features a comprehensive, modern dark-mode aesthetic.

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Database ORM: Prisma
- Database: PostgreSQL
- Authentication: Clerk
- Styling: Tailwind CSS
- Animation: Framer Motion
- Package Manager: Bun

## Key Features

- Bookmarks Manager: Save, organize, and categorize URLs.
- Automated Metadata Parsing: Fetch website titles and favicons automatically upon entering a URL.
- Advanced Filtering and Sorting: View bookmarks in list or grid layouts with complete sorting capabilities.
- Bulk Edit Functionality: Modify multiple entries simultaneously with full database transaction safety.
- Dark-mode First Design: Premium UI utilizing glassmorphism and Framer Motion transitions.

## Installation Steps

1. Clone the repository.
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. Set up environment variables. Create a `.env` file and configure your PostgreSQL connection string and Clerk authentication keys.
4. Generate the Prisma client:
   ```bash
   bunx prisma generate
   ```
5. Apply database migrations:
   ```bash
   bunx prisma db push
   ```
6. Start the development server:
   ```bash
   bun dev
   ```

## Usage Guide

Once the development server is running, navigate to `http://localhost:3000` in your web browser. Ensure you authenticate via Clerk to access the primary dashboard. Use the sidebar navigation to manage bookmarks, edit categories, and interact with the application. 

## License

This project is licensed under the MIT License. Please refer to the LICENSE.md file for the complete legal text.