import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('Supabase user API called with:', { email });

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
      // Always use email's local part as username
      const finalUsername = email.split('@')[0];
      
      console.log('Creating new user with username:', finalUsername);
      
      // Create user in custom table
      user = await db.createUser({
        username: finalUsername.toLowerCase(),
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
    } else {
      // User exists, but check if we need to update their username
      // Always use email's local part as the source of truth
      const expectedUsername = email.split('@')[0].toLowerCase();
      if (user.username !== expectedUsername) {
        console.log('Updating existing user username from:', user.username, 'to:', expectedUsername);
        
        // Update the user's username to match email's local part
        const updatedUser = await db.updateUser(user.id, {
          username: expectedUsername
        });
        
        if (updatedUser) {
          user = updatedUser;
        }
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