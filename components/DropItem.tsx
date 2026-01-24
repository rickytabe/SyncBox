
import React, { useState } from 'react';
import { Drop } from '../types';
import { ICONS, COLLECTIONS } from '../constants';
import { syncService } from '../services/syncService';
import { Globe, FileText, Code } from 'lucide-react';

interface DropItemProps {
  drop: Drop;
}

export const DropItem: React.FC<DropItemProps> = ({ drop }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(drop.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm('Permanently delete this drop?')) {
      syncService.removeDrop(drop.id);
    }
  };

  const renderContent = () => {
    if (drop.type === 'url') {
      return (
        <a 
          href={drop.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group/link block p-5 rounded-[1.25rem] bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 text-slate-400 group-hover/link:text-blue-500 transition-colors">
               <Globe size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-zinc-100 truncate group-hover/link:text-blue-600 transition-colors">
                {drop.metadata?.title || drop.content}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {drop.metadata?.description || drop.metadata?.siteName || new URL(drop.content).hostname}
              </p>
            </div>
          </div>
        </a>
      );
    }

    if (drop.type === 'snippet') {
      return (
        <div className="relative group/code">
          <div className="absolute top-4 right-4 text-zinc-600 group-hover/code:text-zinc-400 transition-colors">
             <Code size={16} />
          </div>
          <pre className="p-5 rounded-[1.25rem] bg-zinc-950 text-zinc-300 font-mono text-[13px] overflow-x-auto border border-zinc-800">
            <code>{drop.content}</code>
          </pre>
        </div>
      );
    }

    return (
      <div className="flex gap-3 px-1">
        <FileText className="w-5 h-5 text-slate-300 dark:text-zinc-700 shrink-0 mt-1" />
        <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-loose text-[15px] font-medium flex-1">
          {drop.content}
        </p>
      </div>
    );
  };

  const collection = COLLECTIONS.find(c => c.id === drop.collectionId);
  const CollectionIcon = collection?.icon;

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-[1.75rem] p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {CollectionIcon && <CollectionIcon size={12} />}
            {drop.collectionId}
          </span>
          {drop.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleCopy}
            className={`p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${copied ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            <ICONS.Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <ICONS.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        {renderContent()}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest">
        <span>{new Date(drop.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${drop.type === 'url' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : drop.type === 'snippet' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
          <span>{drop.type}</span>
        </div>
      </div>
    </div>
  );
};
