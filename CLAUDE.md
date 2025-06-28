# Tech Stack

- **Framework**: React Router v7 (with framework mode)
- **Runtime**: Cloudflare Workers  
- **Database**: SQLite via Cloudflare D1
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Language**: TypeScript
- **Package Manager**: npm

# Project Structure

- `app/`: React Router v7 app directory (routes, components, loaders)
- `app/routes/`: Route definitions with loaders and actions
- `app/components/`: Reusable React components
- `migrations/`: D1 database migration files
- `tests/unit/`: Vitest unit tests
- `tests/e2e/`: Playwright end-to-end tests
- `wrangler.toml`: Cloudflare Workers configuration
- `drizzle.config.ts`: Database schema configuration

# Commands

- `npm run dev`: Start local development server with HMR
- `npm run build`: Build for Cloudflare Workers deployment
- `npm run deploy`: Deploy to Cloudflare Workers
- `npm run test`: Run Vitest unit tests
- `npm run test:e2e`: Run Playwright E2E tests
- `npm run test:watch`: Run Vitest in watch mode
- `npx wrangler d1 execute DB_NAME --file=migrations/001_init.sql`: Run database migrations
- `npx wrangler d1 execute DB_NAME --command="SELECT * FROM todos"`: Query D1 database

# Code Style

- Use React Router v7 framework mode with `route()` definitions
- Implement loaders for data fetching, actions for mutations
- Use TypeScript with strict mode enabled
- Components must be function components with named exports
- Use modern React patterns (hooks, functional components)
- Prefer arrow functions for inline functions
- Use ES modules (import/export)

# Database Guidelines

- **D1 Naming**: Use descriptive names under 32 chars with dashes (e.g., `todo-app-prod`)
- **Transactions**: Avoid BEGIN TRANSACTION - D1 only supports one write transaction at a time
- **Batch Operations**: Use D1 batch API for multiple SQL statements
- **Foreign Keys**: Enable foreign key constraints for data integrity
- **Migrations**: Use numbered migration files (001_init.sql, 002_add_column.sql)
- **Size Limits**: Keep databases under 10GB for optimal performance

# React Router v7 Patterns

- Use `loader()` functions for data fetching on routes
- Use `action()` functions for form submissions and mutations
- Implement proper error boundaries with `ErrorBoundary` components
- Use `useLoaderData()` hook to access loader data
- Use `Form` component for progressive enhancement
- Leverage automatic code splitting and optimization

# Testing Strategy

## Vitest (Unit Tests)
- Test individual components with @testing-library/react
- Mock external dependencies and API calls
- Use jsdom environment for DOM testing
- Focus on component logic and user interactions

## Playwright (E2E Tests)
- Test complete user workflows and interactions
- Test against deployed Cloudflare Workers environment
- Use page object model pattern for maintainable tests
- Include visual regression testing for UI consistency

# Deployment

- **Environment**: Use wrangler.toml for environment configuration
- **Secrets**: Store sensitive data in Cloudflare Workers secrets
- **Database Binding**: Bind D1 database in wrangler.toml
- **Staging**: Use separate D1 databases for dev/staging/prod
- **Preview**: Use `wrangler pages dev` for local development

# Repository Guidelines

- **Branch Naming**: `feature/todo-list-ui`, `fix/database-migration`
- **Commits**: Descriptive messages following conventional commits
- **PRs**: Require tests and successful deployment preview
- **Database Changes**: Always include migration files in commits

# Core Files & Utilities

- `wrangler.toml`: Cloudflare Workers configuration and D1 bindings
- `app/root.tsx`: Root component with global error boundary
- `app/lib/db.ts`: Database connection and query utilities
- `app/lib/types.ts`: TypeScript type definitions
- `vitest.config.ts`: Vitest configuration with browser mode
- `playwright.config.ts`: Playwright E2E test configuration

# Do Not Touch

- Do not edit `.wrangler/` directory (generated files)
- Do not commit environment variables to version control
- Do not use client-side routing patterns (use React Router v7 framework mode)
- Do not create database transactions manually (use D1 batch operations)
- Do not test against production D1 database

# Terminology

- **Loader**: Server-side data fetching function for routes
- **Action**: Server-side mutation function for forms
- **D1**: Cloudflare's distributed SQLite database
- **Workers**: Cloudflare's serverless runtime environment
- **Framework Mode**: React Router v7's full-stack capabilities
- **Binding**: Connection between Workers and Cloudflare services

# Important Notes

- React Router v7 uses framework mode - do not use react-router-dom patterns
- D1 databases are eventually consistent across global locations
- All form submissions should use React Router `Form` component
- Database queries should use prepared statements for security
- Always test deployment previews before merging to main