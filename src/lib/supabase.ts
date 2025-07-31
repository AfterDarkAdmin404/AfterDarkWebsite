import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
export const typedSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const typedSupabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 