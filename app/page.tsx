
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { QuickDrop } from '../components/QuickDrop';
import { DropItem } from '../components/DropItem';
import { syncService } from '../services/syncService';
import { Drop } from '../types';
import { ICONS, COLLECTIONS } from '../constants';

interface PageProps {
  currentCollection?: string;
}

export default function Home({ currentCollection = 'inbox' }: PageProps) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fix: Return the cleanup function directly from subscribe to ensure the correct return type for useEffect
  useEffect(() => {
    return syncService.subscribe((updatedDrops) => {
      setDrops(updatedDrops);
    });
  }, []);

  const filteredDrops = useMemo(() => {
    return drops.filter(drop => {
      const matchesSearch = drop.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          drop.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          drop.metadata?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCollection = currentCollection === 'all' || drop.collectionId === currentCollection;
      
      return matchesSearch && matchesCollection;
    });
  }, [drops, currentCollection, searchQuery]);

  const currentCollectionData = COLLECTIONS.find(c => c.id === currentCollection);

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-32 md:pt-16 md:pb-16 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
                {currentCollectionData?.name || 'Inbox'}
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">
                {filteredDrops.length} items synced across your devices
              </p>
            </div>
            <div className="relative group flex-1 max-w-sm">
              <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <QuickDrop />
        </div>

        {/* List View */}
        <div className="space-y-4">
          {filteredDrops.length > 0 ? (
            <div className="grid gap-4">
              {filteredDrops.map((drop) => (
                <DropItem key={drop.id} drop={drop} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
                {currentCollectionData?.icon || '🏝️'}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-200">Everything is in sync</h3>
                <p className="text-slate-500 dark:text-zinc-500 max-w-[280px] mx-auto text-sm">
                  Start by typing something above or sharing a link from your mobile phone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center active:scale-95 transition-transform z-30"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ICONS.Plus className="w-8 h-8" />
      </button>
    </main>
  );
}