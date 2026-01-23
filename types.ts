
export type DropType = 'text' | 'url' | 'snippet';

export interface DropMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  language?: string;
}

export interface Drop {
  id: string;
  content: string;
  type: DropType;
  collectionId: string;
  tags: string[];
  createdAt: number;
  metadata?: DropMetadata;
  fileUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export enum ViewMode {
  ALL = 'all',
  COLLECTION = 'collection',
  TAG = 'tag',
  SEARCH = 'search'
}
