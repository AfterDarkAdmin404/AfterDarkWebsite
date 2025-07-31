import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email in the custom users table
    let user = await db.findUserByEmail(email);
    
    // If user doesn't exist, create one
    if (!user) {
      // Generate a username if not provided
      const generatedUsername = username || email.split('@')[0];
      
      // Create user in custom table
      user = await db.createUser({
        username: generatedUsername.toLowerCase(),
        email: email.toLowerCase(),
        password_hash: '', // Empty since we're using Supabase Auth
        user_role: 2, // Default role (2 = user)
        is_active: true
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        user_role: user.user_role
      }
    });

  } catch (error) {
    console.error('Error in /api/auth/supabase-user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 