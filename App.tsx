import React, { useState, useEffect, useMemo } from 'react';
import { QuickDrop } from './components/QuickDrop';
import { DropItem } from './components/DropItem';
import { Sidebar } from './components/Sidebar';
import { syncService } from './services/syncService';
// Removed non-existent ViewMode from import
import { Drop } from './types';
import { ICONS, COLLECTIONS } from './constants';

const App: React.FC = () => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [currentCollection, setCurrentCollection] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Fix: Provide currentCollection as the first argument to subscribe and add it to dependencies to resolve the parameter count error.
  useEffect(() => {
    return syncService.subscribe(currentCollection, (updatedDrops) => {
      setDrops(updatedDrops);
    });
  }, [currentCollection]);

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Sidebar - Desktop */}
      <Sidebar 
        currentCollection={currentCollection} 
        onSelectCollection={setCurrentCollection} 
      />

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-40 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-blue-600">SyncDrop</h1>
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

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-32 md:pt-12 md:pb-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header & Search */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {currentCollectionData?.name || 'My Drops'}
                </h2>
                <p className="text-slate-500 dark:text-zinc-400">
                  {filteredDrops.length} items synced
                </p>
              </div>
              <div className="relative group flex-1 max-w-sm">
                <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search your drops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Input Component */}
            <QuickDrop />
          </div>

          {/* List View */}
          <div className="space-y-4">
            {filteredDrops.length > 0 ? (
              <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredDrops.map((drop) => (
                  <DropItem key={drop.id} drop={drop} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-3xl opacity-50">
                  {currentCollectionData?.icon || '🏜️'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-200">No drops here yet</h3>
                  <p className="text-slate-500 dark:text-zinc-500 max-w-[250px] mx-auto">
                    Start by typing something above or sharing from another app.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center active:scale-90 transition-transform z-30"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ICONS.Plus className="w-6 h-6" />
      </button>

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
  );
};

export default App;