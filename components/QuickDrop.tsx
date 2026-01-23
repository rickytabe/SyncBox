
"use client";

import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';
import { analyzeDrop } from '../services/geminiService';
import { syncService } from '../services/syncService';
import { Drop } from '../types';

export const QuickDrop: React.FC = () => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const currentContent = content.trim();
    setContent('');
    setIsProcessing(true);

    const analysis = await analyzeDrop(currentContent);
    
    const newDrop: Drop = {
      id: crypto.randomUUID(),
      content: currentContent,
      type: analysis.type,
      collectionId: 'inbox',
      tags: analysis.tags,
      createdAt: Date.now(),
      metadata: analysis.metadata
    };

    syncService.addDrop(newDrop);
    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm focus-within:shadow-xl focus-within:border-blue-500/30 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Sync a link, snippet, or note..."
          className="w-full min-h-[120px] p-6 bg-transparent resize-none outline-none text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 leading-relaxed font-medium"
        />
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-zinc-800/20 border-t border-slate-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              {isProcessing ? 'Analyzing...' : 'Ready to Sync'}
            </span>
            {isProcessing && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] text-slate-400 font-medium">⌘ + Enter</span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isProcessing}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                content.trim() && !isProcessing
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
