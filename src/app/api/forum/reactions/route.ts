import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user_id, content_type, content_id, emoji } = await request.json();

    if (!user_id || !content_type || !content_id || !emoji) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate content_type
    if (!['thread', 'comment'].includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content_type' },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', user_id)
      .eq('content_type', content_type)
      .eq('content_id', content_id)
      .eq('emoji', emoji)
      .single();

    if (existingReaction) {
      return NextResponse.json(
        { error: 'Reaction already exists' },
        { status: 409 }
      );
    }

    // Add reaction
    const { data: reaction, error } = await supabase
      .from('reactions')
      .insert({
        user_id,
        content_type,
        content_id,
        emoji,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding reaction:', error);
      return NextResponse.json(
        { error: 'Failed to add reaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reaction });
  } catch (error) {
    console.error('Error in POST /api/forum/reactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user_id, content_type, content_id, emoji } = await request.json();

    if (!user_id || !content_type || !content_id || !emoji) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Remove reaction
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', user_id)
      .eq('content_type', content_type)
      .eq('content_id', content_id)
      .eq('emoji', emoji);

    if (error) {
      console.error('Error removing reaction:', error);
      return NextResponse.json(
        { error: 'Failed to remove reaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/forum/reactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const content_type = searchParams.get('content_type');
    const content_id = searchParams.get('content_id');
    const user_id = searchParams.get('user_id');

    if (!content_type || !content_id) {
      return NextResponse.json(
        { error: 'Missing content_type or content_id' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('reactions')
      .select(`
        *,
        users:user_id(username)
      `)
      .eq('content_type', content_type)
      .eq('content_id', content_id);

    // If user_id is provided, also get user's reactions
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: reactions, error } = await query;

    if (error) {
      console.error('Error fetching reactions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reactions' },
        { status: 500 }
      );
    }

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
      const emoji = reaction.emoji;
      if (!acc[emoji]) {
        acc[emoji] = {
          emoji,
          count: 0,
          users: [],
          userReacted: false
        };
      }
      acc[emoji].count++;
      acc[emoji].users.push(reaction.users.username);
      
      // Check if current user reacted
      if (user_id && reaction.user_id === user_id) {
        acc[emoji].userReacted = true;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ reactions: Object.values(groupedReactions) });
  } catch (error) {
    console.error('Error in GET /api/forum/reactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 