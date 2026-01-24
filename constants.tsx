
import { 
  Inbox, 
  Briefcase, 
  User, 
  Link as LinkIcon, 
  Code, 
  Search, 
  Plus, 
  Settings, 
  Trash2, 
  Copy, 
  Share2,
  Mic,
  Sparkles,
  Command,
  LayoutGrid
} from 'lucide-react';

export const COLLECTIONS = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, color: 'text-blue-500' },
  { id: 'work', name: 'Work', icon: Briefcase, color: 'text-indigo-500' },
  { id: 'personal', name: 'Personal', icon: User, color: 'text-rose-500' },
  { id: 'links', name: 'Links', icon: LinkIcon, color: 'text-purple-500' },
  { id: 'code', name: 'Code', icon: Code, color: 'text-orange-500' },
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
  Layout: LayoutGrid
};
