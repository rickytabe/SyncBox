
import React, { useState } from 'react';
import { Drop } from '../types';
import { ICONS } from '../constants';
import { syncService } from '../services/syncService';

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
    if (confirm('Delete this drop?')) {
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
          className="group block p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 hover:border-blue-500/50 transition-colors"
        >
          <div className="flex gap-3">
            {drop.metadata?.image && (
              <img src={drop.metadata.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-zinc-100 truncate">
                {drop.metadata?.title || drop.content}
              </h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">
                {drop.metadata?.siteName || new URL(drop.content).hostname}
              </p>
            </div>
          </div>
        </a>
      );
    }

    if (drop.type === 'snippet') {
      return (
        <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-300 font-mono text-sm overflow-x-auto">
          <code>{drop.content}</code>
        </pre>
      );
    }

    return (
      <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
        {drop.content}
      </p>
    );
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
          {drop.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleCopy}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${copied ? 'text-green-500' : 'text-slate-400'}`}
          >
            <ICONS.Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
          >
            <ICONS.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        {renderContent()}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-600 font-medium">
        <span>{new Date(drop.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${drop.type === 'url' ? 'bg-purple-500' : drop.type === 'snippet' ? 'bg-orange-500' : 'bg-blue-500'}`} />
          <span className="capitalize">{drop.type}</span>
        </div>
      </div>
    </div>
  );
};
