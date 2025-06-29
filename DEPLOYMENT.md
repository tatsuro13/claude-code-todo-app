# Cloudflare Workers Deployment Guide

This guide explains how to deploy the React Router Todo App to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Create a free account at [Cloudflare](https://cloudflare.com)

### Recommended: API Token Authentication
2. **API Token**: Create a Cloudflare API token with the following permissions:
   - Zone:Zone:Read (for your domain, if using custom domains)
   - Account:Cloudflare Workers:Edit
   - Account:D1:Edit
   - Account:Account:Read
3. **Set Environment Variable**: `export CLOUDFLARE_API_TOKEN=your_api_token_here`
4. **Wrangler CLI**: Install globally with `npm install -g wrangler`

### Alternative: Interactive Login (May Have Issues)
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **Authentication**: Login to Cloudflare with `wrangler login`

> ⚠️ **Note**: The interactive `wrangler login` can sometimes get stuck at "Allow Wrangler to make changes to your Cloudflare account?" without progressing. Using API tokens is more reliable for automated deployments.

## Deployment Steps

### 1. Create D1 Database

#### Option A: Using Wrangler CLI
```bash
wrangler d1 create todo-app-database
```

#### Option B: Using Cloudflare API
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "todo-app-database"
  }'
```

Replace `{account_id}` with your Cloudflare Account ID (found in the right sidebar of your Cloudflare dashboard).

Both methods will output something like:
```json
{
  "result": {
    "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "todo-app-database",
    "version": "alpha"
  }
}
```

Save the `uuid` value - this is your database ID.

### 2. Update Configuration

Update `wrangler.jsonc` with the actual database ID from step 1:

1. Replace `REPLACE_WITH_ACTUAL_DATABASE_ID` with the actual database ID
2. Verify the database_name matches what you created

### 3. Run Database Migrations

Apply the database schema to your D1 database:

#### Option A: Using Wrangler CLI
```bash
# For production
wrangler d1 migrations apply todo-app-database

# For local development
npm run db:migrate
```

#### Option B: Using Cloudflare API
```bash
# First, read the migration file
MIGRATION_SQL=$(cat drizzle/0000_outstanding_trauma.sql)

# Apply the migration
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{
    \"sql\": \"${MIGRATION_SQL}\"
  }"
```

### 4. Deploy to Cloudflare Workers

#### Option A: Using Wrangler CLI
```bash
npm run deploy
```

#### Option B: Using Cloudflare API
```bash
# First, build the application
npm run build

# Deploy using the API (requires creating a multipart upload)
# Note: This is more complex - using wrangler CLI is recommended for deployment
# See: https://developers.cloudflare.com/workers/configuration/deploy-in-ci/
```

**Note**: For API-based deployment, wrangler CLI is still the recommended approach as it handles the complex multipart upload process. The API method is primarily useful for CI/CD pipelines.

Both deployment methods will:
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

## API-Only Deployment Workflow

If you prefer to use only the Cloudflare API without the CLI:

### Quick API Setup Script
```bash
#!/bin/bash
# Set your credentials
export CLOUDFLARE_API_TOKEN="your_api_token_here"
export ACCOUNT_ID="your_account_id_here"

# 1. Create D1 Database
DATABASE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"name": "todo-app-database"}')

# Extract database ID
DATABASE_ID=$(echo $DATABASE_RESPONSE | jq -r '.result.uuid')
echo "Database ID: $DATABASE_ID"

# 2. Update wrangler.jsonc with the database ID
sed -i "s/REPLACE_WITH_ACTUAL_DATABASE_ID/$DATABASE_ID/g" wrangler.jsonc

# 3. Apply migrations
MIGRATION_SQL=$(cat drizzle/0000_outstanding_trauma.sql)
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "{\"sql\": \"${MIGRATION_SQL}\"}"

# 4. Build and deploy (still requires wrangler for deployment)
npm run build
npx wrangler deploy
```

## Environment Variables

#### Using Wrangler CLI
```bash
# Set a secret
wrangler secret put SECRET_NAME

# Set a variable
wrangler vars set VAR_NAME "value"
```

#### Using Cloudflare API
```bash
# Set environment variables
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/services/{service_name}/environments/{environment_name}/vars/{var_name}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"value": "your_value_here"}'

# Set secrets
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/services/{service_name}/environments/{environment_name}/secrets/{secret_name}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"text": "your_secret_here"}'
```

## Local Development

For local development with D1:

```bash
# Start local dev server
npm run dev

# The app will be available at http://localhost:5173
```

## Creating a Cloudflare API Token

1. **Go to Cloudflare Dashboard**: Visit [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Navigate to API Tokens**: Click on your profile icon → "My Profile" → "API Tokens" tab
3. **Create Token**: Click "Create Token"
4. **Use Custom Token**: Click "Get started" next to "Custom token"
5. **Set Permissions**:
   - Account | Cloudflare Workers:Edit | All accounts
   - Account | D1:Edit | All accounts  
   - Account | Account:Read | All accounts
   - Zone | Zone:Read | All zones (optional, for custom domains)
6. **Set Account Resources**: Select "Include - All accounts"
7. **Set Zone Resources**: Select "Include - All zones" (if you added Zone permissions)
8. **Create and Copy**: Click "Continue to summary" → "Create Token" → Copy the token

## Non-Interactive Deployment Workflow

For environments where interactive login doesn't work (CI/CD, containers, etc.):

```bash
# Set your API token
export CLOUDFLARE_API_TOKEN="your_api_token_here"

# Verify authentication works
npx wrangler whoami

# Create database
npx wrangler d1 create todo-app-database

# Update wrangler.jsonc with the database ID returned above

# Apply migrations
npx wrangler d1 migrations apply todo-app-database

# Deploy
npm run deploy
```

## Troubleshooting

### Authentication Issues

**Problem**: `wrangler login` gets stuck at "Allow Wrangler to make changes to your Cloudflare account?"

**Solutions**:
1. **Use API Token Instead** (Recommended):
   ```bash
   export CLOUDFLARE_API_TOKEN="your_api_token_here"
   npx wrangler whoami  # Test authentication
   ```

2. **Clear Browser Cache**: Clear cookies/cache for cloudflare.com and try again

3. **Try Different Browser**: Some browsers block the callback URL

4. **Manual Token Method**:
   ```bash
   # Get your Global API Key from Cloudflare dashboard
   export CLOUDFLARE_EMAIL="your@email.com"
   export CLOUDFLARE_API_KEY="your_global_api_key"
   ```

5. **Force Re-authentication**:
   ```bash
   wrangler logout
   wrangler login --compatibility-date 2023-05-18
   ```

### Common Issues

1. **Database not found**: Ensure you've created the D1 database and updated the database_id in wrangler.jsonc
2. **Migration errors**: Check that your migration files are in the correct format
3. **Build errors**: Ensure all dependencies are installed with `npm install`
4. **Authentication timeout**: Use API tokens instead of interactive login
5. **Permission denied**: Ensure your API token has the correct permissions

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