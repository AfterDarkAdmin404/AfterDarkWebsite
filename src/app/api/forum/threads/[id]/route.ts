import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/forum/threads/[id] - Get a single thread with comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;

    // Get the thread with category and author info
    const { data: thread, error: threadError } = await supabaseAdmin
      .from('forum_threads')
      .select(`
        *,
        forum_categories!inner(name, slug, color),
        users!forum_threads_author_id_fkey(username),
        last_reply_user:users!forum_threads_last_reply_by_fkey(username)
      `)
      .eq('id', threadId)
      .eq('is_locked', false)
      .single();

    if (threadError || !thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabaseAdmin
      .from('forum_threads')
      .update({ view_count: thread.view_count + 1 })
      .eq('id', threadId);

    // Get comments for this thread
    const { data: comments, error: commentsError } = await supabaseAdmin
      .from('forum_comments')
      .select(`
        *,
        users!forum_comments_author_id_fkey(username),
        edited_by_user:users!forum_comments_edited_by_fkey(username)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      thread,
      comments
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/forum/threads/[id] - Update a thread
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;
    const body = await request.json();
    const { title, content, category_id } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length < 3 || title.length > 255) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 255 characters' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Content must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Check if category exists (if provided)
    if (category_id) {
      const { data: category } = await supabaseAdmin
        .from('forum_categories')
        .select('id')
        .eq('id', category_id)
        .eq('is_active', true)
        .single();

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found or inactive' },
          { status: 404 }
        );
      }
    }

    // Update the thread
    const { data: thread, error } = await supabaseAdmin
      .from('forum_threads')
      .update({
        title,
        content,
        ...(category_id && { category_id }),
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)
      .select(`
        *,
        forum_categories!inner(name, slug, color),
        users!forum_threads_author_id_fkey(username)
      `)
      .single();

    if (error) {
      console.error('Error updating thread:', error);
      return NextResponse.json(
        { error: 'Failed to update thread' },
        { status: 500 }
      );
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/threads/[id] - Delete a thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;

    // Delete the thread (comments will be deleted automatically due to CASCADE)
    const { error } = await supabaseAdmin
      .from('forum_threads')
      .delete()
      .eq('id', threadId);

    if (error) {
      console.error('Error deleting thread:', error);
      return NextResponse.json(
        { error: 'Failed to delete thread' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 