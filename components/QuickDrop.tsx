
"use client";

import React, { useState, useRef } from 'react';
import { ICONS } from '../constants';
import { analyzeDrop } from '../services/geminiService';
import { syncService } from '../services/syncService';
import { authService } from '../services/authService';
import { Drop, DropType } from '../types';
import { Sparkles, Paperclip, Loader2, Command as CmdIcon } from 'lucide-react';

interface QuickDropProps {
  onTriggerAuth?: () => void;
}

export const QuickDrop: React.FC<QuickDropProps> = ({ onTriggerAuth }) => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkGuestAction = async () => {
    const user = await authService.getCurrentUser();
    if (!user && onTriggerAuth) {
      onTriggerAuth();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await checkGuestAction();
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Content = event.target?.result as string;
      let type: DropType = 'text';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type === 'application/pdf') type = 'document';
      
      const analysis = await analyzeDrop(file.name, type);
      const newDrop: Drop = {
        id: crypto.randomUUID(),
        content: base64Content,
        type,
        collectionId: analysis.suggestedCollectionId,
        tags: [file.type.split('/')[1] || 'file'],
        createdAt: Date.now(),
        metadata: { title: file.name, fileName: file.name, fileSize: file.size, fileType: file.type }
      };
      await syncService.addDrop(newDrop);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const ensureProtocol = (input: string) => {
    // Basic regex for domain-like strings without protocol
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/.*)?$/;
    if (domainRegex.test(input.trim())) {
      return `https://${input.trim()}`;
    }
    return input.trim();
  };

  const handleSubmit = async () => {
    if (!content.trim() || isProcessing) return;
    
    await checkGuestAction();
    
    let currentContent = content.trim();
    // Validate and fix URLs without protocols
    currentContent = ensureProtocol(currentContent);
    
    setContent('');
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeDrop(currentContent);
      const newDrop: Drop = {
        id: crypto.randomUUID(),
        content: currentContent,
        type: analysis.type,
        collectionId: analysis.suggestedCollectionId || 'inbox',
        tags: analysis.tags,
        createdAt: Date.now(),
        metadata: analysis.metadata
      };
      await syncService.addDrop(newDrop);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
      
      <div className="relative group overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5">
        
        {/* AI Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
             <div className="relative">
               <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
               <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
             </div>
             <div className="flex items-center gap-2">
               <Sparkles size={16} className="text-blue-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Syncing to Cloud...</span>
             </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Sync a drop... (Cmd + Enter)"
          className="w-full min-h-[160px] p-8 pb-20 bg-transparent resize-none outline-none text-[16px] text-slate-800 dark:text-zinc-100 placeholder:text-slate-300 dark:placeholder:text-zinc-700 leading-relaxed font-medium transition-opacity duration-300"
        />

        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              <Paperclip size={20} />
            </button>
            <button className="p-3 rounded-2xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
              <ICONS.Mic size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 text-[9px] font-bold text-slate-400 border border-slate-100 dark:border-zinc-700">
                <CmdIcon size={10} />
                <span>ENTER</span>
             </div>
             <button 
              onClick={handleSubmit}
              disabled={!content.trim() || isProcessing}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                content.trim() && !isProcessing 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-700 cursor-not-allowed'
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
