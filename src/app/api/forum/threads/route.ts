import { NextRequest, NextResponse } from 'next/server';
import { typedSupabaseAdmin } from '@/lib/supabase';

// GET /api/forum/threads - Get threads with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'last_reply_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build the query
    let query = typedSupabaseAdmin
      .from('forum_threads')
      .select(`
        *,
        forum_categories!inner(name, slug, color),
        users!forum_threads_author_id_fkey(username),
        last_reply_user:users!forum_threads_last_reply_by_fkey(username)
      `)
      .eq('is_locked', false);

    // Add category filter
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Add search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Add sorting
    if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'last_reply_at') {
      query = query.order('last_reply_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'view_count') {
      query = query.order('view_count', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'reply_count') {
      query = query.order('reply_count', { ascending: sortOrder === 'asc' });
    }

    // Get total count first
    let countQuery = typedSupabaseAdmin
      .from('forum_threads')
      .select('*', { count: 'exact', head: true })
      .eq('is_locked', false);

    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId);
    }
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { count: totalCount } = await countQuery;

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: threads, error } = await query;

    if (error) {
      console.error('Error fetching threads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch threads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      threads,
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

// POST /api/forum/threads - Create a new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category_id, author_id } = body;

    // Validate required fields
    if (!title || !content || !category_id || !author_id) {
      return NextResponse.json(
        { error: 'Title, content, category_id, and author_id are required' },
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

    // Check if category exists and is active
    const { data: category } = await typedSupabaseAdmin
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

    // Create the thread
    const { data: thread, error } = await typedSupabaseAdmin
      .from('forum_threads')
      .insert({
        title,
        content,
        category_id,
        author_id,
        view_count: 0,
        reply_count: 0
      })
      .select(`
        *,
        forum_categories!inner(name, slug, color),
        users!forum_threads_author_id_fkey(username)
      `)
      .single();

    if (error) {
      console.error('Error creating thread:', error);
      return NextResponse.json(
        { error: 'Failed to create thread' },
        { status: 500 }
      );
    }

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 