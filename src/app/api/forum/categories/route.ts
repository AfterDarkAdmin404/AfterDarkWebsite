import { NextRequest, NextResponse } from 'next/server';
import { typedSupabaseAdmin } from '@/lib/supabase';

// GET /api/forum/categories - Get all active categories
export async function GET() {
  try {
    const { data: categories, error } = await typedSupabaseAdmin
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/forum/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, color, icon, sort_order } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCategory } = await typedSupabaseAdmin
      .from('forum_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the category
    const { data: category, error } = await typedSupabaseAdmin
      .from('forum_categories')
      .insert({
        name,
        description,
        slug,
        color: color || '#3B82F6',
        icon,
        sort_order: sort_order || 0,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 