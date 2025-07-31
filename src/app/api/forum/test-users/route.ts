import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/forum/test-users - Get users for testing (no auth required)
export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, user_role')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      users,
      message: 'Use one of these user IDs for testing. Copy the ID and set it as userId variable in Postman.'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
