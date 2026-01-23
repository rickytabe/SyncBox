
import { Drop } from '../types';

const STORAGE_KEY = 'syncdrop_items';
const CHANNEL_NAME = 'syncdrop_realtime';

class SyncService {
  private channel: BroadcastChannel;
  private listeners: Set<(drops: Drop[]) => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (event) => {
      if (event.data === 'REFRESH') {
        const drops = this.getAllDrops();
        this.notify(drops);
      }
    };
  }

  getAllDrops(): Drop[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveDrops(drops: Drop[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
    this.channel.postMessage('REFRESH');
    this.notify(drops);
  }

  addDrop(drop: Drop) {
    const drops = this.getAllDrops();
    const updated = [drop, ...drops];
    this.saveDrops(updated);
  }

  removeDrop(id: string) {
    const drops = this.getAllDrops();
    const updated = drops.filter(d => d.id !== id);
    this.saveDrops(updated);
  }

  subscribe(callback: (drops: Drop[]) => void) {
    this.listeners.add(callback);
    callback(this.getAllDrops());
    return () => this.listeners.delete(callback);
  }

  private notify(drops: Drop[]) {
    this.listeners.forEach(l => l(drops));
  }
}

export const syncService = new SyncService();
