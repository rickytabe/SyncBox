
export type DropType = 'text' | 'url' | 'snippet' | 'image' | 'video' | 'document';

export interface DropMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  language?: string;
  fileSize?: number;
  fileType?: string;
  fileName?: string;
}

export interface Drop {
  id: string;
  user_id?: string;
  content: string; 
  type: DropType;
  collectionId: string;
  tags: string[];
  createdAt: number;
  metadata?: DropMetadata;
  source_device_id?: string;
  deleted_at?: number;
}

export interface Collection {
  id: string;
  name: string;
  icon: any; 
  color: string;
  category: 'text' | 'media' | 'docs';
  is_system?: boolean;
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
  tier: 'free' | 'pro';
  created_at: string;
}
