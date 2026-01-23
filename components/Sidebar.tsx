
"use client";

import React from 'react';
import { COLLECTIONS, ICONS } from '../constants';

interface SidebarProps {
  currentCollection: string;
  onSelectCollection: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentCollection, onSelectCollection }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 h-screen border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <div className="text-xl font-black italic">S</div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-none">SyncDrop</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">Version 1.0</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Workspace</p>
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCollection(c.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              currentCollection === c.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <span className={`text-xl transition-transform duration-300 ${currentCollection === c.id ? 'scale-110' : 'group-hover:scale-110'}`}>{c.icon}</span>
            <span className="font-bold text-sm">{c.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
             <div className="min-w-0">
               <p className="text-xs font-bold truncate">Premium User</p>
               <p className="text-[10px] text-slate-500">Cloud Sync Active</p>
             </div>
           </div>
           <button className="w-full py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-colors">
              Account Settings
           </button>
        </div>
      </div>
    </aside>
  );
};
