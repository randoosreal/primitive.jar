export interface ForumPost {
  id: string
  title: string
  content: string
  category: 'CONSPIRACY' | 'SIGHTINGS' | 'DOCUMENTS' | 'THEORIES' | 'LOCATIONS' | 'GENERAL'
  author_name: string
  votes: number
  created_at: string
  updated_at: string
  is_pinned?: boolean
  is_hot?: boolean
  image_url?: string | null
  comment_count?: number
}

export interface ForumComment {
  id: string
  post_id: string
  content: string
  author_name: string
  created_at: string
}

export interface PostVote {
  id: string
  post_id: string
  session_id: string
  vote_type: -1 | 1
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  description: string
  category: 'DECLASSIFIED' | 'LEAKED' | 'WHISTLEBLOWER' | 'FOIA' | 'ANONYMOUS'
  source_name: string | null
  source_url: string | null
  tags: string[]
  created_at: string
}

export interface Location {
  id: string
  name: string
  description: string
  coordinates: string
  category: 'SUSPICIOUS' | 'CLASSIFIED' | 'ANOMALOUS' | 'RESTRICTED' | 'UNKNOWN'
  access_notes: string | null
  created_at: string
  updated_at?: string
}

export const FORUM_CATEGORIES = ['ALL', 'CONSPIRACY', 'SIGHTINGS', 'DOCUMENTS', 'THEORIES', 'LOCATIONS', 'GENERAL'] as const
export const NEWS_CATEGORIES = ['ALL', 'DECLASSIFIED', 'LEAKED', 'WHISTLEBLOWER', 'FOIA', 'ANONYMOUS'] as const
export const LOCATION_CATEGORIES = ['ALL', 'SUSPICIOUS', 'CLASSIFIED', 'ANOMALOUS', 'RESTRICTED', 'UNKNOWN'] as const
