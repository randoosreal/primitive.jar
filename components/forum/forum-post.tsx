'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, MessageSquare, Flame, Pin, Zap, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CommentSection } from './comment-section'

interface Post {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  votes: number
  created_at: string
  comment_count?: number
  is_pinned?: boolean
  is_hot?: boolean
  image_url?: string | null
}

interface ForumPostProps {
  post: Post
  onVote: (postId: string, voteType: 1 | -1) => void
  sessionId: string
}

export function ForumPost({ post, onVote, sessionId }: ForumPostProps) {
  const [showComments, setShowComments] = useState(false)
  const [userVote, setUserVote] = useState<1 | -1 | null>(null)
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!sessionId) return
      
      const supabase = createClient()
      const { data } = await supabase
        .from('post_votes')
        .select('vote_type')
        .eq('post_id', post.id)
        .eq('session_id', sessionId)
        .single()
      
      if (data) {
        setUserVote(data.vote_type as 1 | -1)
      }
    }
    
    fetchUserVote()
  }, [post.id, sessionId])

  const handleVote = (voteType: 1 | -1) => {
    if (userVote === voteType) {
      setUserVote(null)
    } else {
      setUserVote(voteType)
    }
    onVote(post.id, voteType)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Determine if post should show lightning (random popular posts)
  const showLightning = post.votes > 30 && post.votes < 100

  return (
    <article className={`border bg-black p-4 ${post.is_pinned ? 'border-primary' : 'border-border-muted'}`}>
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote(1)}
            className={`transition-colors ${
              userVote === 1 ? 'text-primary' : 'text-primary/30 hover:text-primary'
            }`}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-primary">{post.votes}</span>
          <button
            onClick={() => handleVote(-1)}
            className={`transition-colors ${
              userVote === -1 ? 'text-primary' : 'text-primary/30 hover:text-primary'
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {/* Pin icon for pinned posts */}
            {post.is_pinned && (
              <Pin className="h-4 w-4 text-primary" />
            )}
            
            {/* Lightning icon for trending posts */}
            {showLightning && (
              <Zap className="h-4 w-4 text-primary" />
            )}
            
            <h3 className="text-lg font-semibold text-primary">{post.title}</h3>
            
            {/* HOT badge */}
            {post.is_hot && (
              <span className="flex items-center gap-1 rounded border border-primary bg-primary/10 px-2 py-0.5 text-xs uppercase text-primary">
                <Flame className="h-3 w-3" />
                HOT
              </span>
            )}
            
            <span className="rounded border border-primary/50 px-2 py-0.5 text-xs uppercase text-primary">
              {post.category}
            </span>
          </div>
          
          <div className="mb-2 flex items-center gap-2 text-xs text-primary/60">
            <span>{post.author_name}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          <p className="mb-4 whitespace-pre-wrap text-sm text-primary/80">
            {post.content}
          </p>
          
          {/* Image attachment */}
          {post.image_url && (
            <div className="mb-4">
              <button
                onClick={() => setShowImage(!showImage)}
                className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{showImage ? 'Hide' : 'Show'} Attachment</span>
              </button>
              {showImage && (
                <div className="mt-2 border border-border-muted p-2">
                  <img
                    src={post.image_url}
                    alt="Post attachment"
                    className="max-h-64 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comment_count || 0} Comments</span>
          </button>
          
          {showComments && (
            <CommentSection postId={post.id} />
          )}
        </div>
      </div>
    </article>
  )
}
