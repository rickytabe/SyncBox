
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
    
    if (!error && data.user) {
      // Store pending verification info so the UI knows who we are even without a session
      localStorage.setItem('syncdrop_pending_user', JSON.stringify({
        email: data.user.email,
        user_metadata: { full_name: fullName },
        id: data.user.id,
        is_pending: true,
        app_metadata: { provider: 'email' }
      }));
    }
    
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (data.user) {
      localStorage.removeItem('syncdrop_pending_user');
      await syncService.migrateGuestData();
    } else if (error?.message.toLowerCase().includes('email not confirmed')) {
      // If they try to sign in but aren't confirmed, update the pending status
      localStorage.setItem('syncdrop_pending_user', JSON.stringify({
        email: email,
        is_pending: true,
        app_metadata: { provider: 'email' }
      }));
    }
    
    return { data, error };
  }

  getPendingUser() {
    const stored = localStorage.getItem('syncdrop_pending_user');
    return stored ? JSON.parse(stored) : null;
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
    localStorage.removeItem('syncdrop_pending_user');
    localStorage.removeItem('syncdrop_guest');
    await supabase.auth.signOut();
    window.location.reload();
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user || this.getPendingUser();
  }

  async getProfile() {
    const user = await this.getCurrentUser();
    if (!user || user.is_pending) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  }

  onAuthStateChange(callback: (user: any) => void) {
    // Immediately check for current state to avoid flashes
    this.getCurrentUser().then(user => {
      callback(user);
    });

    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        localStorage.removeItem('syncdrop_pending_user');
        syncService.migrateGuestData();
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('syncdrop_pending_user');
      }

      const user = session?.user ?? this.getPendingUser();
      callback(user);
    });
  }
}

export const authService = new AuthService();
