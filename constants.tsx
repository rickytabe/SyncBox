
import { 
  Inbox, 
  Link as LinkIcon, 
  Code, 
  Image as ImageIcon,
  Video,
  FileText,
  Search, 
  Plus, 
  Settings, 
  Trash2, 
  Copy, 
  Share2,
  Mic,
  Sparkles,
  Command,
  LayoutGrid,
  FileCode,
  Globe
} from 'lucide-react';
import { Collection } from './types';

export const COLLECTIONS: Collection[] = [
  // TEXT
  { id: 'inbox', name: 'Inbox', icon: Inbox, color: 'text-blue-500', category: 'text' },
  { id: 'links', name: 'Links', icon: LinkIcon, color: 'text-purple-500', category: 'text' },
  { id: 'code', name: 'Code', icon: Code, color: 'text-orange-500', category: 'text' },
  // MEDIA
  { id: 'images', name: 'Images', icon: ImageIcon, color: 'text-emerald-500', category: 'media' },
  { id: 'videos', name: 'Videos', icon: Video, color: 'text-rose-500', category: 'media' },
  // DOCS
  { id: 'documents', name: 'Docs', icon: FileText, color: 'text-amber-500', category: 'docs' },
  // SYSTEM
  { id: 'trash', name: 'Trash', icon: Trash2, color: 'text-slate-400', category: 'text', is_system: true },
];

export const ICONS = {
  Trash: Trash2,
  Copy: Copy,
  Share: Share2,
  Search: Search,
  Settings: Settings,
  Plus: Plus,
  Mic: Mic,
  Sparkles: Sparkles,
  Command: Command,
  Layout: LayoutGrid,
  File: FileText,
  Globe: Globe,
  Code: FileCode
};
