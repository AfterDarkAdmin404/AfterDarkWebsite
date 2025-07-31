import { NextRequest, NextResponse } from 'next/server';
import { generateToken, comparePassword } from '@/lib/auth';
import { db } from '@/lib/db';

// Rate limiting map (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Input validation
function validateLoginInput(email: string, password: string) {
  const errors: string[] = [];

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
  }

  return errors;
}

// Rate limiting check
function checkRateLimit(email: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts) {
    return { allowed: true };
  }

  // Check if lockout period has expired
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(email);
    return { allowed: true };
  }

  // Check if max attempts exceeded
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingTime = LOCKOUT_DURATION - (now - attempts.lastAttempt);
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
}

// Update rate limiting
function updateRateLimit(email: string, success: boolean) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

  if (success) {
    // Reset on successful login
    loginAttempts.delete(email);
  } else {
    // Increment failed attempts
    attempts.count += 1;
    attempts.lastAttempt = now;
    loginAttempts.set(email, attempts);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // Validate input
    const validationErrors = validateLoginInput(email, password);
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

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(email);
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
      return NextResponse.json(
        { 
          success: false,
          error: `Too many login attempts. Please try again in ${minutes} minutes.`,
          type: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // Find user in database
    const user = await db.findUserByEmail(email);
    
    // Check if user exists
    if (!user) {
      updateRateLimit(email, false);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password',
          type: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Account is deactivated. Please contact support.',
          type: 'ACCOUNT_DEACTIVATED'
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      updateRateLimit(email, false);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password',
          type: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at
    });

    // Update last login time
    await db.updateLastLogin(user.id);

    // Update rate limiting (successful login)
    updateRateLimit(email, true);

    // Prepare response data
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      user_role: user.user_role,
      createdAt: user.created_at
    };

    // Set cookie for remember me functionality
    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Login successful',
      token: token
    });

    // Set HTTP-only cookie for security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // Changed from 'strict' to 'lax' for development
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day
    };

    console.log('Setting auth cookie with token:', token);
    response.cookies.set('auth-token', token, cookieOptions);
    console.log('Login response sent with cookie');

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // Log error for monitoring (in production, use proper logging service)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (Sentry, etc.)
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

// Handle GET request for testing (remove in production)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Login API endpoint",
    method: "Use POST method to login",
    example: {
      email: "user1@gmail.com",
      password: "password123"
    }
  });
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
