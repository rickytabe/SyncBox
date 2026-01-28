
"use client";

import React from 'react';
import { COLLECTIONS, ICONS } from '../constants';

interface SidebarProps {
  currentCollection: string;
  onSelectCollection: (id: string) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentCollection, onSelectCollection, onOpenSettings }) => {
  const categories = [
    { name: 'Collections', items: COLLECTIONS.filter(c => c.category === 'text' && !c.is_system) },
    { name: 'Media', items: COLLECTIONS.filter(c => c.category === 'media') },
    { name: 'Docs', items: COLLECTIONS.filter(c => c.category === 'docs') },
  ];

  const systemItems = COLLECTIONS.filter(c => c.is_system);

  return (
    <aside className="hidden md:flex flex-col w-[300px] h-screen border-r border-slate-200 dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-3xl p-10 sticky top-0 overflow-hidden">
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="w-11 h-11 rounded-[1.25rem] bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <ICONS.Command size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-zinc-100">SyncDrop</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Active</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
        {categories.map(cat => (
          <div key={cat.name}>
            <p className="px-4 mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 dark:text-zinc-700">{cat.name}</p>
            <div className="space-y-1">
              {cat.items.map((c) => {
                const Icon = c.icon;
                const isActive = currentCollection === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCollection(c.id)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white'
                        : 'text-slate-400 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon size={18} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-300 dark:text-zinc-700 group-hover:text-slate-600'}`} />
                    <span className="font-bold text-[13px] tracking-tight">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* System / Trash Section */}
        <div>
           <p className="px-4 mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 dark:text-zinc-700">System</p>
           <div className="space-y-1">
             {systemItems.map(item => {
               const Icon = item.icon;
               const isActive = currentCollection === item.id;
               return (
                <button
                  key={item.id}
                  onClick={() => onSelectCollection(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-rose-50 dark:bg-rose-900/10 text-rose-600'
                      : 'text-slate-400 dark:text-zinc-600 hover:bg-rose-50/50 dark:hover:bg-rose-900/5 hover:text-rose-600'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-bold text-[13px] tracking-tight">{item.name}</span>
                </button>
               )
             })}
           </div>
        </div>
      </nav>

      <div className="mt-10 pt-10 border-t border-slate-100 dark:border-zinc-900">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all font-bold text-[13px]"
        >
          <ICONS.Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
