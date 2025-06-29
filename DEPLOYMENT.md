# Cloudflare Workers Deployment Guide

This guide explains how to deploy the React Router Todo App to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Create a free account at [Cloudflare](https://cloudflare.com)
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **Authentication**: Login to Cloudflare with `wrangler login`

## Deployment Steps

### 1. Create D1 Database

First, create a new D1 database for the application:

```bash
wrangler d1 create todo-app-database
```

This command will output something like:
```
✅ Successfully created DB 'todo-app-database' in region APAC
Created your database using D1's new storage backend. This is 10x faster than the previous storage backend!

[[d1_databases]]
binding = "DB"
database_name = "todo-app-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. Update Configuration

Update `wrangler.jsonc` with the actual database ID from step 1:

1. Replace `REPLACE_WITH_ACTUAL_DATABASE_ID` with the actual database ID
2. Verify the database_name matches what you created

### 3. Run Database Migrations

Apply the database schema to your D1 database:

```bash
# For production
wrangler d1 migrations apply todo-app-database

# For local development
npm run db:migrate
```

### 4. Deploy to Cloudflare Workers

Build and deploy the application:

```bash
npm run deploy
```

This command will:
- Build the React Router application for production
- Deploy to Cloudflare Workers
- Provide a URL where your app is accessible

### 5. Verify Deployment

After deployment, you should see output like:
```
✨ Your worker has been successfully deployed to:
https://todo-app-workers.your-subdomain.workers.dev
```

Visit the URL to verify your application is running correctly.

## Environment Variables

If you need to set environment variables or secrets:

```bash
# Set a secret
wrangler secret put SECRET_NAME

# Set a variable
wrangler vars set VAR_NAME "value"
```

## Local Development

For local development with D1:

```bash
# Start local dev server
npm run dev

# The app will be available at http://localhost:5173
```

## Troubleshooting

### Common Issues

1. **Database not found**: Ensure you've created the D1 database and updated the database_id in wrangler.jsonc
2. **Migration errors**: Check that your migration files are in the correct format
3. **Build errors**: Ensure all dependencies are installed with `npm install`

### Useful Commands

```bash
# Check D1 databases
wrangler d1 list

# Query your database
wrangler d1 execute todo-app-database --command="SELECT * FROM guestBook"

# View logs
wrangler tail

# Delete deployment (if needed)
wrangler delete
```

## Database Schema

The application uses a simple guest book schema:

```sql
CREATE TABLE `guestBook` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL
);
CREATE UNIQUE INDEX `guestBook_email_unique` ON `guestBook` (`email`);
```

## Next Steps

After successful deployment:

1. Test all application features
2. Set up custom domain (optional)
3. Configure analytics and monitoring
4. Set up CI/CD pipeline for automatic deployments