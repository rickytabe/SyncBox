
import { supabase } from './supabase';
import { syncService } from './syncService';

class AuthService {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (data.user) {
      await syncService.migrateGuestData();
    }
    return { data, error };
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  }

  async signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  }

  // Fix: Removed async keyword to return the subscription object synchronously as required by layout.tsx's useEffect destructuring.
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        syncService.migrateGuestData();
      }
    });
  }
}

export const authService = new AuthService();
