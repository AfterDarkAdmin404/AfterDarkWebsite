# AfterDark Backend API

This directory contains all the backend API routes for the AfterDark application.

## 📁 Directory Structure

```
src/app/api/
├── auth/                    # Authentication endpoints
│   ├── login/              # POST /api/auth/login
│   └── register/           # POST /api/auth/register
├── users/                  # User management endpoints
│   └── profile/            # GET/PUT /api/users/profile
├── community/              # Community features
│   └── posts/              # GET/POST /api/community/posts
└── README.md              # This file

src/lib/                    # Shared utilities
├── auth.ts                # Authentication utilities
└── db.ts                  # Database utilities
```

## 🔐 Authentication Endpoints

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "username": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login successful"
}
```

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

## 👤 User Endpoints

### GET /api/users/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

### PUT /api/users/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "username": "updatedusername",
  "bio": "Updated bio",
  "avatar": "avatar_url"
}
```

## 🌐 Community Endpoints

### GET /api/community/posts
Get community posts with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

### POST /api/community/posts
Create a new community post (requires authentication).

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content..."
}
```

## 🛠️ Utilities

### Authentication Utilities (`src/lib/auth.ts`)
- `generateToken(user)`: Generate JWT token
- `verifyToken(token)`: Verify JWT token
- `getUserFromRequest(request)`: Extract user from request headers
- `hashPassword(password)`: Hash password for storage
- `comparePassword(password, hash)`: Compare password with hash

### Database Utilities (`src/lib/db.ts`)
- Database connection management
- User operations (CRUD)
- Post operations (CRUD)

## 🚀 Next Steps

1. **Install Dependencies:**
   ```bash
   npm install jsonwebtoken bcryptjs
   # or for database
   npm install @prisma/client
   npm install prisma --save-dev
   ```

2. **Set up Environment Variables:**
   ```env
   JWT_SECRET=your_jwt_secret_here
   DATABASE_URL=your_database_url_here
   ```

3. **Configure Database:**
   - Choose your database (PostgreSQL, MongoDB, etc.)
   - Update `src/lib/db.ts` with your database connection
   - Set up database schema

4. **Implement Real Authentication:**
   - Replace mock functions in `src/lib/auth.ts`
   - Add proper password hashing
   - Implement JWT token generation/verification

5. **Add Error Handling:**
   - Create custom error classes
   - Add input validation middleware
   - Implement proper error responses

## 📝 Notes

- All endpoints currently return mock data
- Authentication is simulated with mock tokens
- Database operations are stubbed
- Replace TODO comments with actual implementations 