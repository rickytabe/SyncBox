
"use client";

import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { authService } from '../services/authService';
import { X, User, Cloud, LogOut, ChevronRight, Brain, Moon, Sun, Monitor, ChevronLeft, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAuth?: () => void;
  user?: any;
}

type SettingsSection = 'appearance' | 'account' | 'ai' | 'sync';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onTriggerAuth, user }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  // On desktop, we want to see the content immediately. On mobile, we start with the menu.
  const [mobileView, setMobileView] = useState<'menu' | 'detail'>('menu');
  const [theme, setTheme] = useState(() => localStorage.getItem('syncdrop_theme') || 'system');

  useEffect(() => {
    if (isOpen) {
      setMobileView('menu');
    }
  }, [isOpen]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('syncdrop_theme', newTheme);
    window.dispatchEvent(new Event('syncdrop_theme_change'));
  };

  const handleSectionSelect = (section: SettingsSection) => {
    setActiveSection(section);
    setMobileView('detail');
  };

  const handleSignInClick = () => {
    if (onTriggerAuth) {
      onTriggerAuth();
      onClose();
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'account', label: 'Profile', icon: User },
    { id: 'ai', label: 'Intelligence', icon: Brain },
    { id: 'sync', label: 'Devices', icon: Cloud }
  ];

  const currentSectionData = sections.find(s => s.id === activeSection);
  const isPending = user?.is_pending || (user && !user.email_confirmed_at && user.app_metadata?.provider === 'email');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/90 backdrop-blur-sm md:backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-white dark:bg-zinc-900 md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[600px] border-slate-100 dark:border-zinc-800">
        
        {/* Sidebar Navigation */}
        <div className={`w-full md:w-72 bg-slate-50 dark:bg-zinc-950/50 p-6 md:p-10 md:border-r border-slate-100 dark:border-zinc-800 flex flex-col transition-all duration-300 ${mobileView === 'detail' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <ICONS.Settings size={22} />
              </div>
              <h2 className="text-2xl font-black tracking-tight dark:text-white">Settings</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-3 flex-1">
            {sections.map((s) => (
              <button 
                key={s.id} 
                onClick={() => handleSectionSelect(s.id as SettingsSection)}
                className={`w-full flex items-center justify-between px-6 py-5 md:py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                  activeSection === s.id 
                    ? 'md:bg-blue-600 md:text-white md:shadow-xl md:shadow-blue-500/20 bg-blue-600 text-white md:bg-blue-600' 
                    : 'bg-white md:bg-transparent dark:bg-zinc-900 md:dark:bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-800 md:border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                   <s.icon size={20} />
                   <span>{s.label}</span>
                </div>
                <ChevronRight size={16} className={activeSection === s.id ? 'opacity-100' : 'opacity-40'} />
              </button>
            ))}
          </nav>

          {user && (
            <button onClick={() => authService.signOut()} className="mt-8 flex items-center gap-3 px-6 py-5 md:py-4 text-rose-500 font-black text-xs uppercase tracking-widest bg-rose-50 md:bg-transparent dark:bg-rose-950/20 md:dark:bg-transparent rounded-2xl transition-all">
              <LogOut size={20} /> <span>Sign Out</span>
            </button>
          )}
        </div>

        {/* Detail Content Area */}
        <div className={`flex-1 p-6 md:p-12 overflow-y-auto bg-white dark:bg-zinc-900 transition-colors duration-500 ${mobileView === 'menu' ? 'hidden md:block' : 'block'}`}>
          
          {/* Header for Mobile Detail View */}
          <div className="md:hidden flex items-center gap-4 mb-10">
            <button onClick={() => setMobileView('menu')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ChevronLeft size={28} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{currentSectionData?.label}</h3>
          </div>

          {/* Desktop Close Button */}
          <button onClick={onClose} className="hidden md:block absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
          
          <div className="animate-in slide-in-from-right-4 md:slide-in-from-bottom-2 duration-300">
            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-10">
                <div className="hidden md:block">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Appearance</h3>
                  <p className="text-slate-400 text-sm">Personalize your SyncDrop interface.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'Auto', icon: Monitor }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => toggleTheme(t.id)}
                      className={`flex items-center sm:flex-col justify-between sm:justify-center gap-4 p-6 rounded-[2rem] border transition-all ${
                        theme === t.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' 
                          : 'bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center sm:flex-col gap-4">
                        <t.icon size={24} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{t.label}</span>
                      </div>
                      {theme === t.id && <div className="w-2 h-2 rounded-full bg-white sm:hidden" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === 'account' && (
               <div className="space-y-10">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white hidden md:block">Profile</h3>
                  {user ? (
                     <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                        <div className="relative">
                          <img 
                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || user.email}`} 
                            className="w-24 h-24 rounded-full ring-8 ring-white dark:ring-zinc-700 shadow-2xl" 
                            alt="Avatar"
                          />
                          {isPending && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg">
                              <ShieldAlert size={16} />
                            </div>
                          )}
                        </div>
                        <div className="text-center sm:text-left space-y-2">
                           <h4 className="text-2xl font-black text-slate-900 dark:text-white">{user.user_metadata?.full_name || 'Sync User'}</h4>
                           <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                           {isPending ? (
                             <div className="mt-4 flex flex-col items-center sm:items-start gap-2">
                               <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl">Verification Pending</span>
                               <p className="text-[10px] text-slate-400 font-bold max-w-xs">Please check your email to enable cloud sync features.</p>
                             </div>
                           ) : (
                             <span className="mt-4 inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl">Verified Cloud Account</span>
                           )}
                        </div>
                     </div>
                  ) : (
                    <div className="text-center py-16 md:py-24 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] px-8">
                       <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                         <User size={40} className="text-slate-300" />
                       </div>
                       <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Guest Access</h4>
                       <p className="text-slate-400 mb-8 text-sm max-w-xs mx-auto">Sign in to unlock real-time sync across all your mobile and desktop devices.</p>
                       <button 
                        onClick={handleSignInClick} 
                        className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                       >
                        Connect Account
                       </button>
                    </div>
                  )}
               </div>
            )}

            {/* AI Section */}
            {activeSection === 'ai' && (
               <div className="space-y-10">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white hidden md:block">Intelligence</h3>
                  <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                           <Brain size={28} />
                        </div>
                        <div>
                           <h4 className="text-lg font-bold text-slate-900 dark:text-white">Gemini Engine</h4>
                           <p className="text-xs text-slate-400">Smart categorization & tagging</p>
                        </div>
                      </div>
                      <div className="w-14 h-7 bg-emerald-500 rounded-full p-1 cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full translate-x-7 transition-all shadow-sm" />
                      </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 dark:border-zinc-700">
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                        Artificial intelligence processes your drops to extract URLs, code snippets, and key themes. This data is used only to improve your organizational experience.
                      </p>
                    </div>
                  </div>
               </div>
            )}

            {/* Sync Section */}
            {activeSection === 'sync' && (
               <div className="space-y-10 flex flex-col items-center justify-center md:py-16 text-center px-4">
                  <div className="w-28 h-28 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center mb-8 shadow-inner">
                    <Cloud size={56} className="text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Active Sync</h3>
                  <div className="space-y-6 max-w-sm">
                     <p className="text-sm text-slate-500 font-medium">Unique Device ID:</p>
                     <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-800 font-mono text-blue-500 font-black text-lg tracking-wider border border-slate-200 dark:border-zinc-700">
                       {localStorage.getItem('syncdrop_device_id')?.slice(0, 8).toUpperCase()}
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       Changes made on this device are instantly mirrored across your connected ecosystem via our real-time network.
                     </p>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
