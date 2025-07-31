import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    console.log('Fixing username for:', email, 'to:', username);

    // Update the user's metadata in Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: { username: username }
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      return NextResponse.json(
        { error: 'Failed to update user metadata' },
        { status: 500 }
      );
    }

    console.log('User metadata updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Username updated successfully'
    });

  } catch (error) {
    console.error('Error in /api/auth/fix-username:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 