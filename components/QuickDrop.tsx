
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { analyzeDrop } from '../services/geminiService';
import { syncService } from '../services/syncService';
import { Drop } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Helper functions for audio encoding/decoding as per Gemini Live requirements
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const QuickDrop: React.FC = () => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
      collectionId: analysis.suggestedCollectionId || 'inbox',
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

  const startVoiceSync = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioCtx.createMediaStreamSource(stream);
            const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioCtx.destination);
            (window as any).syncDropAudioNodes = { source, scriptProcessor };
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle transcription
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) {
                setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + text);
              }
            }
          },
          onerror: (e) => {
            console.error('Gemini Live Error:', e);
            stopVoiceSync();
          },
          onclose: () => {
            console.log('Gemini Live session closed');
            setIsRecording(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'You are a real-time transcription engine for a digital clipboard. Transcribe clearly and accurately.'
        }
      });
      
      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Failed to start voice sync:', err);
      setIsRecording(false);
    }
  };

  const stopVoiceSync = () => {
    if (sessionRef.current) {
      // In a real app we might close the session properly
      // sessionRef.current.close(); 
      // But for this simple implementation we just clear the local state and context
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    const nodes = (window as any).syncDropAudioNodes;
    if (nodes) {
      nodes.source.disconnect();
      nodes.scriptProcessor.disconnect();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceSync();
    } else {
      startVoiceSync();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSync();
    };
  }, []);

  return (
    <div className="relative w-full drop-shadow-apple">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-500">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? (Cmd+Enter to sync)"
          className="w-full min-h-[140px] p-7 bg-transparent resize-none outline-none text-[15px] text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 leading-relaxed font-medium"
        />
        <div className="flex items-center justify-between px-7 py-5 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-5">
            <button 
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-all group relative ${isRecording ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
              title="Voice Sync"
            >
              <ICONS.Mic className="w-5 h-5" />
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2">
              <ICONS.Sparkles className={`w-4 h-4 ${isProcessing ? 'text-blue-500 animate-spin' : 'text-slate-300 dark:text-zinc-700'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                {isProcessing ? 'Smart Routing...' : isRecording ? 'Listening...' : 'AI Active'}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isProcessing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              content.trim() && !isProcessing
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl shadow-slate-900/10 hover:opacity-90'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>Sync</span>
            <ICONS.Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
