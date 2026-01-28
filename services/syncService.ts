
import { Drop } from '../types';
import { supabase } from './supabase';

const DB_NAME = 'SyncDropDB';
const STORE_NAME = 'drops';
const CHANNEL_NAME = 'syncdrop_realtime';

class SyncService {
  private channel: BroadcastChannel;
  private listeners: Map<string, (drops: Drop[]) => void> = new Map();
  private db: IDBDatabase | null = null;
  private deviceId: string;
  private currentCollection: string = 'inbox';

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.deviceId = this.getOrCreateDeviceId();
    this.channel.onmessage = (event) => {
      if (event.data === 'REFRESH') {
        this.loadAndNotify();
      }
    };
    this.initDB();
    this.listenToSupabase();
  }

  private getOrCreateDeviceId() {
    let id = localStorage.getItem('syncdrop_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('syncdrop_device_id', id);
    }
    return id;
  }

  private listenToSupabase() {
    supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drops' }, () => {
        this.loadAndNotify();
      })
      .subscribe();
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.loadAndNotify();
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async loadAndNotify() {
    const drops = await this.getAllDrops(this.currentCollection);
    this.notify(drops);
  }

  async getAllDrops(collectionId: string = 'inbox'): Promise<Drop[]> {
    this.currentCollection = collectionId;
    const { data: { user } } = await supabase.auth.getUser();
    const isTrash = collectionId === 'trash';
    
    if (user) {
      let query = supabase.from('drops').select('*');
      
      if (isTrash) {
        // Fetch only items that HAVE a deleted_at timestamp
        query = query.not('deleted_at', 'is', null);
      } else {
        // Fetch items that DO NOT have a deleted_at timestamp
        query = query.is('deleted_at', null);
        if (collectionId !== 'all') {
          query = query.eq('collection_id', collectionId);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) return [];
      return data.map(d => ({
        ...d,
        collectionId: d.collection_id,
        createdAt: new Date(d.created_at).getTime(),
        deleted_at: d.deleted_at ? new Date(d.deleted_at).getTime() : undefined
      }));
    }

    const db = await this.initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        let results = (request.result as any[]).map(d => ({
            ...d,
            deleted_at: d.deleted_at || d.deletedAt // migration path
        }));
        
        if (isTrash) {
          results = results.filter(d => !!d.deleted_at);
        } else {
          results = results.filter(d => !d.deleted_at);
          if (collectionId !== 'all') {
            results = results.filter(d => d.collectionId === collectionId);
          }
        }
        
        resolve(results.sort((a, b) => b.createdAt - a.createdAt));
      };
    });
  }

  async addDrop(drop: Drop) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('drops').insert({
        content: drop.content,
        type: drop.type,
        collection_id: drop.collectionId,
        user_id: user.id,
        metadata: drop.metadata,
        source_device_id: await this.getSupabaseDeviceId(user.id),
        created_at: new Date(drop.createdAt).toISOString()
      });
      if (!error) {
        this.loadAndNotify();
      }
      return;
    }

    const db = await this.initDB();
    return new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.add(drop).onsuccess = () => {
        this.channel.postMessage('REFRESH');
        this.loadAndNotify();
        resolve();
      };
    });
  }

  async removeDrop(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('drops').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      this.loadAndNotify();
      return;
    }

    const db = await this.initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const drop = request.result;
      if (drop) {
        drop.deleted_at = Date.now();
        store.put(drop).onsuccess = () => {
          this.channel.postMessage('REFRESH');
          this.loadAndNotify();
        };
      }
    };
  }

  async restoreDrop(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('drops').update({ deleted_at: null }).eq('id', id);
      this.loadAndNotify();
      return;
    }

    const db = await this.initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const drop = request.result;
      if (drop) {
        delete drop.deleted_at;
        delete drop.deletedAt;
        store.put(drop).onsuccess = () => {
          this.channel.postMessage('REFRESH');
          this.loadAndNotify();
        };
      }
    };
  }

  async permanentlyDelete(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('drops').delete().eq('id', id);
      this.loadAndNotify();
      return;
    }

    const db = await this.initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id).onsuccess = () => {
      this.channel.postMessage('REFRESH');
      this.loadAndNotify();
    };
  }

  private async getSupabaseDeviceId(userId: string) {
    const { data } = await supabase
      .from('devices')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (data && data.length > 0) return data[0].id;
    
    const { data: newDevice } = await supabase
      .from('devices')
      .insert({ user_id: userId, device_name: navigator.userAgent.substring(0, 50) })
      .select('id')
      .single();
    
    return newDevice?.id;
  }

  async migrateGuestData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const db = await this.initDB();
    const guestDrops = await new Promise<Drop[]>((res) => {
      const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => res(req.result);
    });

    if (guestDrops.length === 0) return;
    const deviceId = await this.getSupabaseDeviceId(user.id);

    const payload = guestDrops.map(d => ({
      user_id: user.id,
      content: d.content,
      type: d.type,
      collection_id: d.collectionId,
      metadata: d.metadata,
      source_device_id: deviceId,
      created_at: new Date(d.createdAt).toISOString()
    }));

    const { error } = await supabase.from('drops').insert(payload);
    if (!error) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      this.loadAndNotify();
    }
  }

  subscribe(collectionId: string, callback: (drops: Drop[]) => void) {
    const listenerId = crypto.randomUUID();
    this.currentCollection = collectionId;
    this.listeners.set(listenerId, callback);
    
    // Initial fetch for the specified collection
    this.getAllDrops(collectionId).then(drops => callback(drops));
    
    return () => {
      this.listeners.delete(listenerId);
    };
  }

  private notify(drops: Drop[]) {
    this.listeners.forEach(l => l(drops));
  }
}

export const syncService = new SyncService();
