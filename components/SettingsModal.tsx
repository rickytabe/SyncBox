
"use client";

import React from 'react';
import { ICONS } from '../constants';
import { X, User, Shield, Zap, Globe, Bell, Cloud, LogOut } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-auto md:min-h-[500px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-56 bg-slate-50 dark:bg-zinc-950/50 p-6 border-r border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900">
              <ICONS.Settings size={18} />
            </div>
            <h2 className="font-bold text-lg">Prefs</h2>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
              <User size={16} /> <span>Account</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-sm transition-colors">
              <Shield size={16} /> <span>Security</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-sm transition-colors">
              <Cloud size={16} /> <span>Sync</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-sm transition-colors">
              <Zap size={16} /> <span>AI Lab</span>
            </button>
          </nav>

          <div className="mt-auto pt-8">
             <button className="flex items-center gap-3 px-3 text-rose-500 font-bold text-sm opacity-50 cursor-not-allowed">
               <LogOut size={16} /> <span>Sign Out</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-zinc-900">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
            <X size={20} />
          </button>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600 mb-4">Account Profile</h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xl font-bold">
                  JD
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-slate-500">john@example.com</p>
                </div>
                <button className="ml-auto px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold opacity-50 cursor-not-allowed">
                  Edit Profile
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600 mb-4">AI & Transcription</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-blue-500" />
                    <div>
                      <h4 className="text-sm font-bold">Google Search Grounding</h4>
                      <p className="text-xs text-slate-400">Enhance link metadata with live search results.</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <ICONS.Mic size={18} className="text-emerald-500" />
                    <div>
                      <h4 className="text-sm font-bold">Native Voice Sync</h4>
                      <p className="text-xs text-slate-400">Use Gemini 2.5 Live for real-time transcription.</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 1.2.0-beta</p>
              <div className="flex gap-2">
                 <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
                 <button className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm opacity-50 cursor-not-allowed">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
