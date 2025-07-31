import { supabaseAdmin } from './supabase';
import type { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class SupabaseDatabase {
  private static instance: SupabaseDatabase;
  
  private constructor() {
    // Initialize Supabase connection
  }
  
  public static getInstance(): SupabaseDatabase {
    if (!SupabaseDatabase.instance) {
      SupabaseDatabase.instance = new SupabaseDatabase();
    }
    return SupabaseDatabase.instance;
  }
  
  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Error finding user by email:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
  
  async findUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error finding user by ID:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
  
  async createUser(userData: UserInsert): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
  
  async updateUser(id: string, userData: UserUpdate): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
  
  async updateLastLogin(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating last login:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }
  
  async checkUserExists(email: string, username: string): Promise<{ emailExists: boolean; usernameExists: boolean }> {
    try {
      const [emailResult, usernameResult] = await Promise.all([
        supabaseAdmin.from('users').select('id').eq('email', email).single(),
        supabaseAdmin.from('users').select('id').eq('username', username).single()
      ]);
      
      return {
        emailExists: !!emailResult.data,
        usernameExists: !!usernameResult.data
      };
    } catch (error) {
      console.error('Database error:', error);
      return { emailExists: false, usernameExists: false };
    }
  }

  // Helper function to get role name
  getRoleName(role: number): string {
    return role === 1 ? 'admin' : 'user';
  }

  // Get typed Supabase admin client
  get typedSupabaseAdmin() {
    return supabaseAdmin;
  }
  
  // Post operations (for future use)
  async findPosts(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error finding posts:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }
  
  async createPost(postData: any) {
    try {
      const { data, error } = await supabaseAdmin
        .from('posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating post:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const db = SupabaseDatabase.getInstance(); 