
import React from 'react';
import { COLLECTIONS, ICONS } from '../constants';

interface SidebarProps {
  currentCollection: string;
  onSelectCollection: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentCollection, onSelectCollection }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <ICONS.Plus className="w-6 h-6 rotate-45" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">SyncDrop</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">Collections</p>
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCollection(c.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              currentCollection === c.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{c.icon}</span>
            <span className="font-medium text-sm">{c.name}</span>
            {currentCollection === c.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <ICONS.Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">Pro Plan</p>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500">Unlimited Drops</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
