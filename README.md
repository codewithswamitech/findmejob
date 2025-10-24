# Job Board Application

A modern, production-ready job search platform built with Next.js 14, Supabase, and Prisma.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase) + Prisma ORM
- **State Management**: React Server Components + Client Components
- **Theme**: next-themes (light/dark mode)
- **Testing**: Vitest + Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Error Tracking**: Sentry (optional)
- **API Integration**: Adzuna Jobs API

## Features

- 🔐 **Authentication**: Secure sign-up/sign-in with Supabase Auth
- 🔍 **Job Search**: Search jobs by keywords, location, and remote options
- 🛡️ **Security**:
  - Rate limiting (per-IP and per-user) with sliding window algorithm
  - Content Security Policy and strict security headers
  - HTML sanitization with DOMPurify
- 🎨 **UI/UX**:
  - Responsive design with Tailwind CSS
  - Dark/light theme support
  - Clean navbar and sidebar navigation
- ⚡ **Performance**: Server-side rendering with Next.js App Router
- 🧪 **Testing**: Unit tests with Vitest, E2E tests with Playwright
- 🔄 **CI/CD**: Automated testing and building with GitHub Actions

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database (Supabase recommended)
- Adzuna API credentials

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd project
pnpm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root directory with the following variables:

\`\`\`env

# Database

DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

# Supabase

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Adzuna API

ADZUNA_APP_ID="your-adzuna-app-id"
ADZUNA_APP_KEY="your-adzuna-app-key"
ADZUNA_COUNTRY="us"

# Sentry (optional)

SENTRY_DSN=""
SENTRY_ENABLED="false"
NEXT_PUBLIC_SENTRY_ENABLED="false"

# Site Configuration

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Rate Limiting

RATE_LIMIT_WINDOW_SEC="60"
RATE_LIMIT_MAX_REQUESTS="10"
\`\`\`

### 3. Database Setup

\`\`\`bash

# Generate Prisma client

pnpm db:generate

# Push schema to database

pnpm db:push

# Or run migrations (production)

pnpm db:migrate
\`\`\`

### 4. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm typecheck\` - Run TypeScript type checking
- \`pnpm format\` - Check code formatting
- \`pnpm format:write\` - Format code with Prettier
- \`pnpm test\` - Run unit tests
- \`pnpm test:watch\` - Run unit tests in watch mode
- \`pnpm test:e2e\` - Run E2E tests with Playwright
- \`pnpm db:generate\` - Generate Prisma client
- \`pnpm db:push\` - Push Prisma schema to database
- \`pnpm db:migrate\` - Run database migrations
- \`pnpm db:studio\` - Open Prisma Studio

## Project Structure

\`\`\`
project/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI pipeline
├── .husky/ # Git hooks
├── e2e/ # Playwright E2E tests
├── prisma/
│ └── schema.prisma # Database schema
├── public/ # Static assets
├── src/
│ ├── app/ # Next.js App Router pages
│ │ ├── api/ # API routes
│ │ │ └── jobs/
│ │ │ └── search/ # Job search API endpoint
│ │ ├── app/ # Protected app routes
│ │ │ ├── jobs/ # Jobs search page
│ │ │ └── layout.tsx # App layout with navbar/sidebar
│ │ ├── auth/ # Authentication page
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Marketing homepage
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── navigation/ # Navigation components
│ │ └── providers/ # React providers
│ ├── lib/
│ │ ├── adzuna/ # Adzuna API client
│ │ ├── supabase/ # Supabase client utilities
│ │ ├── prisma.ts # Prisma client
│ │ ├── rate-limit.ts # Rate limiting implementation
│ │ └── sanitize.ts # HTML sanitization
│ ├── test/ # Test utilities
│ └── middleware.ts # Next.js middleware (auth + security)
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── .nvmrc # Node version
├── .prettierrc # Prettier configuration
├── eslint.config.mjs # ESLint configuration
├── next.config.ts # Next.js configuration
├── package.json # Dependencies and scripts
├── playwright.config.ts # Playwright configuration
├── tsconfig.json # TypeScript configuration
└── vitest.config.ts # Vitest configuration
\`\`\`

## Security Features

### Rate Limiting

The application implements rate limiting on API endpoints using a sliding window algorithm:

- Per-IP rate limiting for unauthenticated requests
- Per-user rate limiting for authenticated users
- Configurable limits via environment variables
- Rate limit data stored in PostgreSQL

### Security Headers

All responses include strict security headers:

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (restricted)

### HTML Sanitization

All HTML content from external sources (job descriptions) is sanitized using DOMPurify to prevent XSS attacks.

## API Routes

### POST /api/jobs/search

Search for jobs using the Adzuna API.

**Query Parameters:**

- \`query\` (string): Job title or keywords
- \`location\` (string): Location to search in
- \`remote\` (boolean): Filter for remote jobs only
- \`page\` (number): Page number (default: 1)
- \`limit\` (number): Results per page (default: 10, max: 50)

**Response:**
\`\`\`json
{
"success": true,
"data": {
"jobs": [...],
"total": 100,
"page": 1,
"perPage": 10,
"totalPages": 10
}
}
\`\`\`

## Deployment

### Vercel Deployment

1. **Create a new Vercel project** and link your repository

2. **Add environment variables** in Vercel project settings:
   - \`DATABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`SUPABASE_SERVICE_ROLE_KEY\`
   - \`ADZUNA_APP_ID\`
   - \`ADZUNA_APP_KEY\`
   - \`ADZUNA_COUNTRY\`
   - \`NEXT_PUBLIC_SITE_URL\`
   - \`RATE_LIMIT_WINDOW_SEC\`
   - \`RATE_LIMIT_MAX_REQUESTS\`
   - \`SENTRY_DSN\` (optional)
   - \`SENTRY_ENABLED\` (optional)
   - \`NEXT_PUBLIC_SENTRY_ENABLED\` (optional)

3. **Set up Supabase**:
   - Create a new Supabase project
   - Copy the connection string to \`DATABASE_URL\`
   - Copy the URL and anon key to the respective variables

4. **Run database migrations**:
   \`\`\`bash
   pnpm db:migrate
   \`\`\`

5. **Deploy**: Push to your main branch or deploy manually

### Environment Variables Reference

| Variable                          | Required | Description                                            |
| --------------------------------- | -------- | ------------------------------------------------------ |
| \`DATABASE_URL\`                  | Yes      | PostgreSQL connection string                           |
| \`NEXT_PUBLIC_SUPABASE_URL\`      | Yes      | Supabase project URL                                   |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Yes      | Supabase anonymous key                                 |
| \`SUPABASE_SERVICE_ROLE_KEY\`     | No       | Supabase service role key (for server-side operations) |
| \`ADZUNA_APP_ID\`                 | Yes      | Adzuna API application ID                              |
| \`ADZUNA_APP_KEY\`                | Yes      | Adzuna API application key                             |
| \`ADZUNA_COUNTRY\`                | Yes      | Country code for Adzuna API (e.g., us, gb, ca)         |
| \`NEXT_PUBLIC_SITE_URL\`          | Yes      | Full URL of your deployed site                         |
| \`RATE_LIMIT_WINDOW_SEC\`         | No       | Rate limit window in seconds (default: 60)             |
| \`RATE_LIMIT_MAX_REQUESTS\`       | No       | Max requests per window (default: 10)                  |
| \`SENTRY_DSN\`                    | No       | Sentry DSN for error tracking                          |
| \`SENTRY_ENABLED\`                | No       | Enable Sentry on server (default: false)               |
| \`NEXT_PUBLIC_SENTRY_ENABLED\`    | No       | Enable Sentry on client (default: false)               |

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Linting**: Runs ESLint on all TypeScript files
- **Type Checking**: Validates TypeScript types
- **Unit Tests**: Runs Vitest tests
- **E2E Tests**: Runs Playwright tests
- **Build**: Ensures the project builds successfully
- **Caching**: Caches pnpm store for faster builds

## Git Hooks

- **pre-commit**: Runs lint-staged (linting and formatting)
- **commit-msg**: Validates commit messages with commitlint (conventional commits)

## Testing

### Unit Tests

\`\`\`bash

# Run once

pnpm test

# Watch mode

pnpm test:watch
\`\`\`

### E2E Tests

\`\`\`bash

# Run E2E tests

pnpm test:e2e
\`\`\`

## Contributing

1. Create a new branch from \`main\`
2. Make your changes
3. Ensure all tests pass and code is formatted
4. Create a pull request

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## License

This project is licensed under the MIT License.
