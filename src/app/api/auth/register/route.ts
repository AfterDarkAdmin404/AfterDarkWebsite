import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';

// Input validation
function validateRegistrationInput(username: string, email: string, password: string, confirmPassword: string) {
  const errors: string[] = [];

  // Username validation
  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (username.length > 50) {
    errors.push('Username must be less than 50 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.push('Password confirmation is required');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, confirmPassword } = body;

    // Validate input
    const validationErrors = validateRegistrationInput(username, email, password, confirmPassword);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          details: validationErrors 
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
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const newUser = await db.createUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      user_role: 2, // Default role (2 = user)
      is_active: true
    });

    if (!newUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create user account',
          type: 'CREATION_FAILED'
        },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.created_at
    });

    // Prepare response data
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      user_role: newUser.user_role,
      createdAt: newUser.created_at
    };

    // Set cookie for automatic login
    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Registration successful',
      token: token
    });

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 30 * 24 * 60 * 60 // 30 days
    };

    response.cookies.set('auth-token', token, cookieOptions);

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error. Please try again later.',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 
