import { NextRequest, NextResponse } from 'next/server';

// GET all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: Fetch posts from database with pagination
    const mockPosts = [
      {
        id: '1',
        title: 'Welcome to AfterDark',
        content: 'This is a safe space to explore your desires...',
        author: {
          id: '1',
          username: 'user123',
          avatar: null
        },
        likes: 15,
        comments: 5,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        title: 'Community Guidelines',
        content: 'Remember to be respectful and follow our rules...',
        author: {
          id: '2',
          username: 'admin',
          avatar: null
        },
        likes: 25,
        comments: 8,
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ];

    return NextResponse.json({
      success: true,
      posts: mockPosts,
      pagination: {
        page,
        limit,
        total: 100,
        totalPages: Math.ceil(100 / limit)
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CREATE new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // TODO: Get user ID from JWT token
    // TODO: Save post to database

    const newPost = {
      id: '3',
      title,
      content,
      author: {
        id: '1',
        username: 'user123',
        avatar: null
      },
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 