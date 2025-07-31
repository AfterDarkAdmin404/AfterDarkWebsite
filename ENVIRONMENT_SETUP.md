# Environment Setup Guide

## Required Environment Variables

This application requires the following environment variables to be set. **No hardcoded fallback values are provided** - you must set these manually.

### For Local Development

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (REQUIRED - for server-side operations only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### For Production Deployment (Vercel)

Set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://after-dark-website.vercel.app` | Production |

## Getting Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following values:
   - **Project URL**: Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret**: Use this for `SUPABASE_SERVICE_ROLE_KEY`

## Important Notes

1. **Never commit `.env.local` to version control** - it's already in `.gitignore`
2. The `NEXT_PUBLIC_` prefix makes variables available to the client-side code
3. The service role key should only be used in API routes (server-side)
4. The anon key is safe to expose to the client
5. **No fallback values are provided** - the app will fail to start if these variables are missing

## Troubleshooting

If you see "Missing environment variable" errors:
1. Make sure all required environment variables are set
2. For local development: Check your `.env.local` file
3. For production: Check your Vercel environment variables
4. Restart your development server after creating/modifying environment files

## Security

- The anon key is designed to be public and safe for client-side use
- The service role key has elevated permissions and should only be used server-side
- Never expose the service role key in client-side code
- Keep your service role key secure and never commit it to version control 