
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SettingsModal } from '../components/SettingsModal';
import { AuthModal } from '../components/AuthModal';
import { authService } from '../services/authService';
import { ICONS, COLLECTIONS } from '../constants';
import { AlertCircle, X, Mail } from 'lucide-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [currentCollection, setCurrentCollection] = useState('inbox');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // Initialize user state with pending user immediately to avoid auth screen flash
  const [user, setUser] = useState<any>(() => authService.getPendingUser());
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('syncdrop_theme') || 'system';
      const root = document.documentElement;
      
      const isDark = savedTheme === 'dark' || 
                    (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('syncdrop_theme') === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('syncdrop_theme_change', applyTheme);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('syncdrop_theme_change', applyTheme);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      
      // Check for email verification status
      const isUnverified = newUser && (!newUser.email_confirmed_at && (newUser.app_metadata?.provider === 'email' || newUser.is_pending));
      
      if (isUnverified) {
        setShowVerifyBanner(true);
      } else {
        setShowVerifyBanner(false);
      }

      const isGuest = localStorage.getItem('syncdrop_guest');
      // Only open auth if no user (real or pending) and not a guest
      if (!newUser && !isGuest) {
        setIsAuthOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-zinc-100 transition-colors duration-300">
      <Sidebar 
        currentCollection={currentCollection} 
        onSelectCollection={setCurrentCollection}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onTriggerAuth={() => setIsAuthOpen(true)}
        user={user}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {/* Verification Reminder Banner */}
      {showVerifyBanner && (
        <div className="fixed top-20 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-in slide-in-from-top duration-500">
          <div className="bg-blue-600 text-white p-4 md:p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-blue-400/30 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Verify your email</p>
              <p className="text-[11px] opacity-80 font-medium">Please check <span className="underline">{user?.email}</span> to enable cloud sync.</p>
            </div>
            <button 
              onClick={() => setShowVerifyBanner(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-40 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
             <ICONS.Command size={18} />
           </div>
           <h1 className="text-lg font-black tracking-tighter dark:text-white">SyncDrop</h1>
        </div>
        <button onClick={() => setIsMobileNavOpen(true)} className="p-2 text-slate-400">
          <ICONS.Layout size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { 
              currentCollection,
              onTriggerAuth: () => setIsAuthOpen(true)
            });
          }
          return child;
        })}
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white dark:bg-zinc-950 p-8 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Workspace</h2>
            <button onClick={() => setIsMobileNavOpen(false)} className="p-2">
              <ICONS.Trash size={24} className="rotate-45" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {COLLECTIONS.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => { setCurrentCollection(c.id); setIsMobileNavOpen(false); }}
                  className={`p-6 rounded-[2rem] flex flex-col items-center gap-3 transition-all ${
                    currentCollection === c.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 dark:bg-zinc-900 text-slate-500'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-bold text-xs uppercase tracking-widest">{c.name}</span>
                </button>
              );
            })}
          </div>
          <button 
            onClick={() => { setIsSettingsOpen(true); setIsMobileNavOpen(false); }}
            className="w-full mt-8 p-6 rounded-[2rem] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center gap-3 font-bold text-slate-500"
          >
            <ICONS.Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}
