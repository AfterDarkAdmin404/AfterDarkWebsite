import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          type: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role'); // Filter by role (1 or 2)
    const search = searchParams.get('search'); // Search by username or email
    const active = searchParams.get('active'); // Filter by active status

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid pagination parameters',
          type: 'INVALID_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // TODO: Check if user is admin (role = 1)
    // For now, we'll allow all authenticated users to view users
    // In production, you should check: if (user.role !== 1) return 403

    // Build query
    let query = db.typedSupabaseAdmin
      .from('users')
      .select('id, username, email, user_role, created_at, updated_at, last_login, is_active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (role) {
      const roleNum = parseInt(role);
      if (roleNum === 1 || roleNum === 2) {
        query = query.eq('user_role', roleNum);
      }
    }

    if (active !== null) {
      const isActive = active === 'true';
      query = query.eq('is_active', isActive);
    }

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: users, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch users',
          type: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let totalCount = 0;
    if (count === null) {
      // If count is not available, get it separately
      const { count: total } = await db.typedSupabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });
      totalCount = total || 0;
    } else {
      totalCount = count;
    }

    // Transform data to include role names
    const transformedUsers = users?.map((user: any) => ({
      ...user,
      role_name: user.user_role === 1 ? 'admin' : 'user'
    })) || [];

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      filters: {
        role: role || null,
        search: search || null,
        active: active || null
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        type: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          type: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // TODO: Check if user is admin (role = 1)
    // if (user.role !== 1) {
    //   return NextResponse.json(
    //     { success: false, error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    const body = await request.json();
    const { username, email, password, user_role = 2 } = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Username, email, and password are required',
          type: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate role
    if (user_role !== 1 && user_role !== 2) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid user role. Must be 1 (admin) or 2 (user)',
          type: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { emailExists, usernameExists } = await db.checkUserExists(email, username);
    
    if (emailExists) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email already registered',
          type: 'EMAIL_EXISTS'
        },
        { status: 409 }
      );
    }

    if (usernameExists) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Username already taken',
          type: 'USERNAME_EXISTS'
        },
        { status: 409 }
      );
    }

    // Hash password
    const { hashPassword } = await import('@/lib/auth');
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.createUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      user_role,
      is_active: true
    });

    if (!newUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create user',
          type: 'CREATION_FAILED'
        },
        { status: 500 }
      );
    }

    // Return user data without password
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      user_role: newUser.user_role,
      role_name: newUser.user_role === 1 ? 'admin' : 'user',
      created_at: newUser.created_at,
      is_active: newUser.is_active
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        type: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 