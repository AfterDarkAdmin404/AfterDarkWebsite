import { NextRequest, NextResponse } from 'next/server';
import { typedSupabaseAdmin } from '@/lib/supabase';

// GET /api/forum/comments - Get comments for a thread
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!threadId) {
      return NextResponse.json(
        { error: 'threadId is required' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Get total count first
    const { count: totalCount } = await typedSupabaseAdmin
      .from('forum_comments')
      .select('*', { count: 'exact', head: true })
      .eq('thread_id', threadId);

    // Get comments for the thread
    const { data: comments, error } = await typedSupabaseAdmin
      .from('forum_comments')
      .select(`
        *,
        users!forum_comments_author_id_fkey(username),
        edited_by_user:users!forum_comments_edited_by_fkey(username)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/forum/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { thread_id, author_id, parent_id, content } = body;

    // Validate required fields
    if (!thread_id || !author_id || !content) {
      return NextResponse.json(
        { error: 'thread_id, author_id, and content are required' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length < 1) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    // Check if thread exists and is not locked
    const { data: thread } = await typedSupabaseAdmin
      .from('forum_threads')
      .select('id, is_locked')
      .eq('id', thread_id)
      .single();

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    if (thread.is_locked) {
      return NextResponse.json(
        { error: 'Cannot comment on locked thread' },
        { status: 403 }
      );
    }

    // Check if parent comment exists (if provided)
    if (parent_id) {
      const { data: parentComment } = await typedSupabaseAdmin
        .from('forum_comments')
        .select('id')
        .eq('id', parent_id)
        .eq('thread_id', thread_id)
        .single();

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create the comment
    const { data: comment, error } = await typedSupabaseAdmin
      .from('forum_comments')
      .insert({
        thread_id,
        author_id,
        parent_id,
        content
      })
      .select(`
        *,
        users!forum_comments_author_id_fkey(username)
      `)
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 