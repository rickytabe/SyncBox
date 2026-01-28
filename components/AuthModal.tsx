
"use client";

import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ICONS } from '../constants';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Loader2, CheckCircle2, Inbox } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'verification-sent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: authError, data } = mode === 'login' 
      ? await authService.signIn(email, password)
      : await authService.signUp(email, password, fullName);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      if (mode === 'signup') {
        setMode('verification-sent');
        setLoading(false);
      } else {
        onClose();
      }
    }
  };

  const handleGoogle = async () => {
    await authService.signInWithGoogle();
  };

  if (mode === 'verification-sent') {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
        <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 p-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Inbox size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Check your inbox</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-8 font-medium">
            We've sent a verification link to <span className="text-blue-600 font-bold">{email}</span>. 
            Please confirm your email to activate your SyncDrop account.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-sm transition-all"
            >
              Back to Sign In
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Didn't receive it? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
      
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <ICONS.Command size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm font-medium">
              Sync your workspace across all your devices instantly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center px-2">{error}</p>}

            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-zinc-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400"><span className="px-4 bg-white dark:bg-zinc-900">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-100 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold text-sm transition-all"
            >
              <Chrome size={20} />
              <span>Google</span>
            </button>
          </div>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            <div className="block pt-2">
               <button 
                 onClick={() => { localStorage.setItem('syncdrop_guest', 'true'); onClose(); }}
                 className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200"
               >
                 Continue as Guest
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
