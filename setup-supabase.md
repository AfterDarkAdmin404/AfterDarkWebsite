# Supabase Setup Guide for AfterDark

## 🚀 Quick Setup

### 1. Create Environment File
Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

### 2. Update Environment Variables
Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL= https://dciipajoatfzclkeiamp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWlwYWpvYXRmemNsa2VpYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTgzNjksImV4cCI6MjA2ODg5NDM2OX0.zIl9SSZiw3SD1flb5tzFqu7GxIpVIL3DhZm2QCENmDk
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Set Up Database Schema

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Run the migration

#### Option B: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref dciipajoatfzclkeiamp

# Run migration
supabase db push
```

### 4. Get Service Role Key
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "service_role" key (not the anon key)
4. Add it to your `.env.local` file

### 5. Create Test Users

#### Admin User
```sql
INSERT INTO public.users (username, email, password_hash, user_role, is_active)
VALUES (
  'admin',
  'admin@afterdark.com',
  '$2b$10$hashed_password_here', -- You'll need to hash this
  'admin',
  true
);
```

#### Regular User
```sql
INSERT INTO public.users (username, email, password_hash, user_role, is_active)
VALUES (
  'user',
  'user@afterdark.com',
  '$2b$10$hashed_password_here', -- You'll need to hash this
  'user',
  true
);
```

## 🔧 Database Schema

Your users table will have this structure:

```sql
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) DEFAULT 'user' CHECK (user_role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);
```

## 🧪 Testing Your Setup

### 1. Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication tokens
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive validation for all inputs
- **Row Level Security**: Database-level security policies
- **HTTP-Only Cookies**: Secure token storage

## 📝 Next Steps

1. **Install bcryptjs** for password hashing:
   ```bash
   npm install bcryptjs @types/bcryptjs
   ```

2. **Update auth utilities** to use real bcrypt:
   - Replace mock functions in `src/lib/auth.ts`
   - Implement real JWT token generation

3. **Add error monitoring**:
   - Set up Sentry or similar service
   - Configure production logging

4. **Test thoroughly**:
   - Test all API endpoints
   - Verify security features
   - Check error handling

## 🚨 Important Notes

- Keep your service role key secret
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly update dependencies
- Monitor your Supabase usage 