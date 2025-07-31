# After Dark Forum - Backend Setup Guide

## Overview

This guide covers the complete backend setup for the After Dark Forum system, including database migration, API endpoints, and testing with Postman.

## Phase 1: Database Migration

### 1. Run the Forum Migration

First, apply the forum database migration to your Supabase project:

```sql
-- Copy and run the contents of forum-migration.sql in your Supabase SQL editor
```

This migration creates:
- `forum_categories` - Forum categories with colors and icons
- `forum_threads` - Threads with metadata and statistics
- `forum_comments` - Comments with nested reply support
- `forum_reactions` - User reactions (like, love, laugh, etc.)

### 2. Database Features

#### Row Level Security (RLS)
- **Categories**: Only admins can create/update/delete
- **Threads**: Users can manage their own, admins can manage all
- **Comments**: Users can manage their own, admins can manage all
- **Reactions**: Users can only manage their own reactions

#### Automatic Features
- Thread reply counts update automatically
- Last reply information updates automatically
- View counts increment on thread view
- Timestamps update automatically

#### Performance Indexes
- Optimized for common queries (threads by category, comments by thread)
- Full-text search support on thread titles and content
- Efficient sorting by various criteria

## Phase 2: API Endpoints

### Categories API

#### GET `/api/forum/categories`
Get all active categories
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "General Discussion",
      "description": "General topics and discussions",
      "slug": "general",
      "color": "#3B82F6",
      "icon": "chat",
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

#### POST `/api/forum/categories` (Admin Only)
Create a new category
```json
{
  "name": "New Category",
  "description": "A new forum category",
  "slug": "new-category",
  "color": "#10B981",
  "icon": "star",
  "sort_order": 5
}
```

### Threads API

#### GET `/api/forum/threads`
Get threads with filtering and pagination

Query Parameters:
- `categoryId` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (created_at, last_reply_at, view_count, reply_count)
- `sortOrder` - Sort direction (asc, desc)
- `search` - Search in title and content

```json
{
  "threads": [
    {
      "id": "uuid",
      "title": "Thread Title",
      "content": "Thread content...",
      "category_id": "uuid",
      "author_id": "uuid",
      "view_count": 10,
      "reply_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "forum_categories": {
        "name": "General Discussion",
        "slug": "general",
        "color": "#3B82F6"
      },
      "users": {
        "username": "user_one"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### POST `/api/forum/threads`
Create a new thread
```json
{
  "title": "My First Thread",
  "content": "This is the content of my first thread.",
  "category_id": "uuid",
  "author_id": "uuid"
}
```

#### GET `/api/forum/threads/[id]`
Get a single thread with comments
```json
{
  "thread": {
    "id": "uuid",
    "title": "Thread Title",
    "content": "Thread content...",
    "view_count": 15,
    "reply_count": 8,
    "forum_categories": {
      "name": "General Discussion",
      "slug": "general",
      "color": "#3B82F6"
    },
    "users": {
      "username": "user_one"
    }
  },
  "comments": [
    {
      "id": "uuid",
      "content": "Comment content...",
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "username": "user_two"
      }
    }
  ]
}
```

### Comments API

#### GET `/api/forum/comments`
Get comments for a thread
```json
{
  "comments": [
    {
      "id": "uuid",
      "content": "Comment content...",
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "username": "user_one"
      }
    }
  ]
}
```

#### POST `/api/forum/comments`
Create a new comment
```json
{
  "thread_id": "uuid",
  "author_id": "uuid",
  "parent_id": "uuid", // Optional, for replies
  "content": "This is my comment."
}
```

### Reactions API

#### GET `/api/forum/reactions`
Get reactions for a target
```json
{
  "reactions": [
    {
      "id": "uuid",
      "reaction_type": "like",
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "username": "user_one"
      }
    }
  ],
  "reactionCounts": {
    "like": {
      "count": 5,
      "users": [
        {"id": "uuid", "username": "user_one"}
      ]
    }
  }
}
```

#### POST `/api/forum/reactions`
Add a reaction
```json
{
  "user_id": "uuid",
  "target_type": "thread", // or "comment"
  "target_id": "uuid",
  "reaction_type": "like" // like, love, laugh, wow, sad, angry
}
```

## Phase 3: Testing with Postman

### 1. Import the Collection

1. Open Postman
2. Click "Import" 
3. Select the `forum-api-postman-collection.json` file
4. The collection will be imported with all endpoints

### 2. Set Up Environment Variables

In the collection variables, set:
- `baseUrl`: `http://localhost:3000/api` (or your server URL)
- `userId`: Get from `/api/users` endpoint
- `categoryId`: Get from `/api/forum/categories` endpoint
- `threadId`: Will be set after creating a thread

### 3. Testing Workflow

#### Step 1: Get User ID
1. Run "Get User ID (Setup)" to get a user ID
2. Copy the user ID and set it as the `userId` variable

#### Step 2: Get Category ID
1. Run "Get Category ID (Setup)" to get category IDs
2. Copy a category ID and set it as the `categoryId` variable

#### Step 3: Create and Test Threads
1. Run "Create Thread" to create a new thread
2. Copy the returned thread ID and set it as `threadId`
3. Test "Get Single Thread" to view the thread
4. Test "Get All Threads" to see all threads

#### Step 4: Test Comments
1. Run "Create Comment" to add a comment to the thread
2. Test "Get Comments for Thread" to see all comments
3. Test "Create Reply to Comment" for nested replies

#### Step 5: Test Reactions
1. Run "Add Like Reaction to Thread" to add a reaction
2. Test "Get Reactions for Thread" to see reaction counts
3. Test different reaction types (love, laugh, etc.)

### 4. Common Test Scenarios

#### Thread Management
```bash
# Create thread
POST /api/forum/threads
{
  "title": "Test Thread",
  "content": "This is a test thread content.",
  "category_id": "your-category-id",
  "author_id": "your-user-id"
}

# Get thread with comments
GET /api/forum/threads/{thread-id}

# Update thread
PUT /api/forum/threads/{thread-id}
{
  "title": "Updated Title",
  "content": "Updated content."
}
```

#### Comment System
```bash
# Add comment
POST /api/forum/comments
{
  "thread_id": "thread-id",
  "author_id": "user-id",
  "content": "This is a comment."
}

# Add reply
POST /api/forum/comments
{
  "thread_id": "thread-id",
  "author_id": "user-id",
  "parent_id": "comment-id",
  "content": "This is a reply."
}
```

#### Reaction System
```bash
# Add reaction
POST /api/forum/reactions
{
  "user_id": "user-id",
  "target_type": "thread",
  "target_id": "thread-id",
  "reaction_type": "like"
}

# Get reactions
GET /api/forum/reactions?targetType=thread&targetId={thread-id}
```

## Phase 4: Next Steps

### Frontend Integration
1. Create React components for ThreadCard, CommentSection, ReactionToolbar
2. Implement thread list page with filtering
3. Create thread creation form with rich text editor
4. Build single thread view with comments

### Advanced Features
1. Real-time updates with Supabase subscriptions
2. File uploads for thread attachments
3. User mentions and notifications
4. Advanced search with filters
5. Thread moderation tools

### Performance Optimization
1. Implement caching for frequently accessed data
2. Add database query optimization
3. Set up CDN for static assets
4. Monitor and optimize API response times

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure you're using the correct user ID format
2. **Foreign Key Errors**: Ensure referenced IDs exist in the database
3. **Permission Errors**: Check if the user has the required role (admin vs user)
4. **Validation Errors**: Verify all required fields are provided

### Debug Tips

1. Check Supabase logs for detailed error messages
2. Use the Supabase dashboard to inspect data directly
3. Test RLS policies in the Supabase SQL editor
4. Verify environment variables are set correctly

## Security Considerations

1. **Input Validation**: All endpoints validate input data
2. **RLS Policies**: Database-level security prevents unauthorized access
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Content Moderation**: Plan for content filtering and moderation tools

This backend setup provides a solid foundation for your forum system. The API is designed to be scalable and secure, with proper error handling and validation throughout. 