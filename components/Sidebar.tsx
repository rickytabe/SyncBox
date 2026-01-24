
"use client";

import React from 'react';
import { COLLECTIONS, ICONS } from '../constants';

interface SidebarProps {
  currentCollection: string;
  onSelectCollection: (id: string) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentCollection, onSelectCollection, onOpenSettings }) => {
  return (
    <aside className="hidden md:flex flex-col w-[280px] h-screen border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl p-8 sticky top-0">
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-10 h-10 rounded-[12px] bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-lg">
          <ICONS.Command className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">SyncDrop</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connected</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        <p className="px-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-zinc-700">Collections</p>
        {COLLECTIONS.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCollection(c.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                currentCollection === c.id
                  ? 'bg-white dark:bg-blue-600 shadow-sm border border-slate-100 dark:border-blue-500 text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${currentCollection === c.id ? '' : 'text-slate-400 group-hover:text-slate-600'}`} size={20} />
              <span className="font-bold text-[13px]">{c.name}</span>
              {currentCollection === c.id && (
                <div className="ml-auto w-1 h-4 rounded-full bg-slate-900 dark:bg-white/40" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-5 rounded-3xl bg-slate-900 dark:bg-zinc-800 text-white">
           <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Usage</p>
           <h4 className="text-sm font-bold mb-3">Sync Professional</h4>
           <div className="w-full h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
              <div className="w-1/3 h-full bg-blue-400" />
           </div>
           <p className="text-[10px] opacity-60">12.4GB / 50GB Shared Storage</p>
        </div>
        
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 transition-all font-bold text-[13px]"
        >
          <ICONS.Settings className="w-5 h-5" />
          <span>System Prefs</span>
        </button>
      </div>
    </aside>
  );
};
