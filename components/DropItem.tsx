
"use client";

import React, { useState, useMemo } from 'react';
import { Drop } from '../types';
import { ICONS, COLLECTIONS } from '../constants';
import { syncService } from '../services/syncService';
import { FileText, Code, ChevronDown, Link as LinkIcon, Download, RotateCcw, Trash2, Globe, ExternalLink } from 'lucide-react';

interface DropItemProps {
  drop: Drop;
}

export const DropItem: React.FC<DropItemProps> = ({ drop }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isDeleted = !!drop.deleted_at;

  // 🔥 TRUNCATION HELPER
  const truncateText = (text: string, max = 50) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(drop.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (isDeleted) {
      if (confirm('Permanently delete this drop? This cannot be undone.')) {
        syncService.permanentlyDelete(drop.id);
      }
    } else {
      syncService.removeDrop(drop.id);
    }
  };

  const handleRestore = () => {
    syncService.restoreDrop(drop.id);
  };

  const lineInfo = useMemo(() => {
    if (drop.type !== 'snippet') return { hasMoreLines: false, visibleLines: [], totalLines: 0, visibleCount: 0 };
    const lines = drop.content.split('\n');
    const lineCount = lines.length;

    let maxLines = 10;
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) maxLines = 5;
      else if (window.innerWidth < 1024) maxLines = 7;
    }

    const hasMoreLines = lineCount > maxLines;
    const visibleLines = isExpanded ? lines : lines.slice(0, maxLines);

    return {
      hasMoreLines,
      visibleLines,
      totalLines: lineCount,
      visibleCount: visibleLines.length,
    };
  }, [drop.content, isExpanded, drop.type]);

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const renderContent = () => {
    // ================= MEDIA TYPES (IMAGE/VIDEO/DOC) =================
    if (drop.type === 'image') {
      return (
        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800">
          <img src={drop.content} alt={drop.metadata?.fileName} className="w-full h-auto object-cover max-h-[400px]" />
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{drop.metadata?.fileName}</span>
            <a href={drop.content} download={drop.metadata?.fileName} className="text-blue-500 hover:text-blue-600 p-1">
              <Download size={16} />
            </a>
          </div>
        </div>
      );
    }

    if (drop.type === 'video') {
      return (
        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-black">
          <video src={drop.content} controls className="w-full h-auto max-h-[400px]" />
        </div>
      );
    }

    if (drop.type === 'document') {
      return (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
             <ICONS.File size={24} />
          </div>
          <div className="flex-1 min-w-0">
             <h3 className="font-bold text-sm truncate">{drop.metadata?.fileName}</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
               {drop.metadata?.fileSize ? (drop.metadata.fileSize / 1024 / 1024).toFixed(2) : '0.00'} MB • {drop.metadata?.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
             </p>
          </div>
          <a href={drop.content} download={drop.metadata?.fileName} className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800">
             <Download size={18} className="text-slate-600 dark:text-zinc-400" />
          </a>
        </div>
      );
    }

    // ================= URL TYPE =================
    if (drop.type === 'url') {
      const absoluteUrl = ensureAbsoluteUrl(drop.content);
      let hostname = '';
      try {
        hostname = new URL(absoluteUrl).hostname;
      } catch {
        hostname = drop.content;
      }

      const titleText = truncateText(drop.metadata?.title || hostname, 60);
      const descText = truncateText(drop.metadata?.description || absoluteUrl, 120);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

      return (
        <div className="rounded-[1.25rem] bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all overflow-hidden w-full group/card">
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex flex-col sm:flex-row gap-0 w-full h-full"
            title={absoluteUrl}
          >
            <div className="w-full sm:w-20 h-24 sm:h-auto flex items-center justify-center bg-slate-100 dark:bg-zinc-900 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-zinc-700 shrink-0 relative">
              <img 
                src={faviconUrl} 
                alt="Favicon" 
                className="w-10 h-10 object-contain z-10 drop-shadow-sm" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Globe size={32} className="text-slate-400 absolute hidden" />
            </div>
            <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 group-hover/link:text-blue-600 transition-colors text-sm truncate">
                  {titleText}
                </h3>
                <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed break-words line-clamp-2">
                {descText}
              </p>
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/60 mt-2">
                {hostname}
              </span>
            </div>
          </a>
        </div>
      );
    }

    // ================= SNIPPET TYPE =================
    if (drop.type === 'snippet') {
      const displayContent = lineInfo.visibleLines.join('\n');
      const language = drop.metadata?.language || 'code';

      return (
        <div className="relative group/code w-full min-w-0">
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {language && language !== 'code' && (
              <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 font-black uppercase tracking-wider border border-zinc-700">
                {language}
              </span>
            )}
            <div className="text-zinc-600 group-hover/code:text-zinc-400 transition-colors pointer-events-none">
              <Code size={16} />
            </div>
          </div>

          <div className="relative w-full max-w-full bg-zinc-950 rounded-[1.25rem] border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
              <pre className="p-5 text-zinc-300 font-mono text-[13px] whitespace-pre leading-relaxed min-w-fit">
                <code>{displayContent}</code>
              </pre>
            </div>

            {lineInfo.hasMoreLines && !isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent flex items-end justify-center pb-4 pointer-events-none">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all text-[11px] font-black uppercase tracking-widest pointer-events-auto shadow-2xl"
                >
                  <span>Show all {lineInfo.totalLines} lines</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {isExpanded && lineInfo.hasMoreLines && (
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent flex items-end justify-center pb-2 pointer-events-none">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all text-[11px] font-black uppercase tracking-widest pointer-events-auto"
                >
                  <span>Show less</span>
                  <ChevronDown size={14} className="rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ================= TEXT TYPE =================
    return (
      <div className="flex gap-4 px-1 min-w-0">
        <div className="w-1 rounded-full bg-slate-100 dark:bg-zinc-800 shrink-0" />
        <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-loose text-[15px] font-medium flex-1 break-words">
          {drop.content}
        </p>
      </div>
    );
  };

  const collection = COLLECTIONS.find(c => c.id === drop.collectionId);
  const CollectionIcon = collection?.icon;

  return (
    <div className={`group relative w-full max-w-full overflow-hidden bg-white dark:bg-zinc-900 border ${isDeleted ? 'border-dashed border-slate-300 dark:border-zinc-700 opacity-80' : 'border-slate-200 dark:border-zinc-800/80'} rounded-[1.75rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300`}>
      <div className="flex justify-between items-center mb-5 gap-4">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 shrink-0">
            {CollectionIcon && <CollectionIcon size={12} />}
            {drop.collectionId}
          </span>
          {drop.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 truncate max-w-[100px]">
              #{tag}
            </span>
          ))}
          {isDeleted && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-[10px] font-bold uppercase tracking-widest text-rose-600 shrink-0">Deleted</span>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0">
          {!isDeleted ? (
            <>
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
            </>
          ) : (
            <>
              <button onClick={handleRestore} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors" title="Restore"><RotateCcw size={14} /></button>
              <button onClick={handleDelete} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 transition-colors" title="Delete Permanently"><Trash2 size={14} /></button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 w-full overflow-hidden">{renderContent()}</div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest">
        <span>{new Date(drop.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${
            drop.type === 'url' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 
            drop.type === 'snippet' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 
            drop.type === 'image' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
            'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} 
          />
          <span>{drop.type}</span>
        </div>
      </div>
    </div>
  );
};
