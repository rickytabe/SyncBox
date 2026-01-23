
"use client";

import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ICONS, COLLECTIONS } from '../constants';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentCollection, setCurrentCollection] = useState('inbox');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const currentCollectionData = COLLECTIONS.find(c => c.id === currentCollection);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <Sidebar 
        currentCollection={currentCollection} 
        onSelectCollection={setCurrentCollection} 
      />

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-40 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs italic">S</div>
           <h1 className="text-lg font-bold text-slate-900 dark:text-zinc-100">SyncDrop</h1>
        </div>
        <button 
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800"
        >
          <span className="text-xl">{currentCollectionData?.icon || '📥'}</span>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-zinc-900 p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Collections</h2>
            <button onClick={() => setIsMobileNavOpen(false)} className="p-2">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {COLLECTIONS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentCollection(c.id);
                  setIsMobileNavOpen(false);
                }}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  currentCollection === c.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-zinc-800'
                }`}
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="font-semibold text-sm">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Pass state to children via context or clones if needed, but for this simplified Next.js structure we will handle the logic in the Page */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { currentCollection });
          }
          return child;
        })}

        {/* Mobile Tab Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 glass border-t border-slate-200 dark:border-zinc-800 flex items-center justify-around px-6 z-40">
           <button onClick={() => setCurrentCollection('inbox')} className={`flex flex-col items-center gap-1 ${currentCollection === 'inbox' ? 'text-blue-600' : 'text-slate-400'}`}>
             <span className="text-xl">📥</span>
             <span className="text-[10px] font-bold">Inbox</span>
           </button>
           <button onClick={() => setCurrentCollection('links')} className={`flex flex-col items-center gap-1 ${currentCollection === 'links' ? 'text-blue-600' : 'text-slate-400'}`}>
             <span className="text-xl">🔗</span>
             <span className="text-[10px] font-bold">Links</span>
           </button>
           <div className="w-12 h-12" /> {/* Space for FAB */}
           <button onClick={() => setCurrentCollection('work')} className={`flex flex-col items-center gap-1 ${currentCollection === 'work' ? 'text-blue-600' : 'text-slate-400'}`}>
             <span className="text-xl">💼</span>
             <span className="text-[10px] font-bold">Work</span>
           </button>
           <button onClick={() => setIsMobileNavOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
             <span className="text-xl">📁</span>
             <span className="text-[10px] font-bold">More</span>
           </button>
        </nav>
      </div>
    </div>
  );
}
