import { createClient } from '@supabase/supabase-js';

// Comprehensive debugging
console.log('=== SUPABASE ENVIRONMENT DEBUG ===');
console.log('process.env.NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
console.log('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
console.log('typeof process.env.NEXT_PUBLIC_SUPABASE_URL:', typeof process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY:', typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('=== END DEBUG ===');

// Use environment variables with fallback to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dciipajoatfzclkeiamp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWlwYWpvYXRmemNsa2VpYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTgzNjksImV4cCI6MjA2ODg5NDM2OX0.zIl9SSZiw3SD1flb5tzFqu7GxIpVIL3DhZm2QCENmDk';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaWlwYWpvYXRmemNsa2VpYW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMxODM2OSwiZXhwIjoyMDY4ODk0MzY5fQ.6TKhjgTRzm8sPvkwr7lanvXqC7bVUDHfAYTwMhgDm08';

// Debug the actual values being passed to createClient
console.log('=== CREATE CLIENT DEBUG ===');
console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseAnonKey:', supabaseAnonKey);
console.log('supabaseServiceRoleKey:', supabaseServiceRoleKey);
console.log('supabaseUrl type:', typeof supabaseUrl);
console.log('supabaseAnonKey type:', typeof supabaseAnonKey);
console.log('supabaseServiceRoleKey type:', typeof supabaseServiceRoleKey);
console.log('supabaseUrl truthy:', !!supabaseUrl);
console.log('supabaseAnonKey truthy:', !!supabaseAnonKey);
console.log('supabaseServiceRoleKey truthy:', !!supabaseServiceRoleKey);
console.log('=== END CREATE CLIENT DEBUG ===');

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

console.log('=== CREATING SUPABASE CLIENT ===');
// Client-side Supabase client (only needs anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('=== SUPABASE CLIENT CREATED SUCCESSFULLY ===');

// Server-side Supabase client with service role key (only used in API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          password_hash: string;
          user_role: number; // 1 = admin, 2 = user
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          password_hash: string;
          user_role?: number; // 1 = admin, 2 = user
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          password_hash?: string;
          user_role?: number; // 1 = admin, 2 = user
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
      };
      forum_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          color: string;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          slug?: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_threads: {
        Row: {
          id: string;
          title: string;
          content: string;
          category_id: string;
          author_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          is_sticky: boolean;
          view_count: number;
          reply_count: number;
          last_reply_at: string | null;
          last_reply_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category_id: string;
          author_id: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          is_sticky?: boolean;
          view_count?: number;
          reply_count?: number;
          last_reply_at?: string | null;
          last_reply_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category_id?: string;
          author_id?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          is_sticky?: boolean;
          view_count?: number;
          reply_count?: number;
          last_reply_at?: string | null;
          last_reply_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_comments: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          is_edited: boolean;
          edited_at: string | null;
          edited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          is_edited?: boolean;
          edited_at?: string | null;
          edited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          author_id?: string;
          parent_id?: string | null;
          content?: string;
          is_edited?: boolean;
          edited_at?: string | null;
          edited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_reactions: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'thread' | 'comment';
          target_id: string;
          reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'thread' | 'comment';
          target_id: string;
          reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: 'thread' | 'comment';
          target_id?: string;
          reaction_type?: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
          created_at?: string;
        };
      };
    };
  };
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const typedSupabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 