
import React, { useState, useRef, useEffect } from 'react';
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

    // AI Analysis
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
    <div className="relative w-full group">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Drop a link, snippet, or thought..."
          className="w-full min-h-[100px] max-h-[300px] p-4 bg-transparent resize-none outline-none text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
        />
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex gap-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
            <span>⌘ + Enter to drop</span>
            {isProcessing && <span className="animate-pulse text-blue-500">Processing...</span>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isProcessing}
            className={`p-2 rounded-lg transition-all ${
              content.trim() && !isProcessing
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-slate-200 dark:bg-zinc-700 text-slate-400 dark:text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ICONS.Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
