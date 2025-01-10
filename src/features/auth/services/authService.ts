import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

interface AuthResponse {
  user: User | null;
  error: Error | null;
}

interface RefreshTokenResponse {
  session: any;
  error: Error | null;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.role,
          firstName: data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.lastName || ''
        } : null,
        error: null
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async refreshSession(): Promise<RefreshTokenResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;

      return { session: data.session, error: null };
    } catch (error) {
      return { session: null, error: error as Error };
    }
  },

  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
};