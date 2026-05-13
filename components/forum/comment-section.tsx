'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  content: string
  author_name: string
  created_at: string
}

const fetchComments = async (postId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('forum_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export function CommentSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: comments, error, isLoading } = useSWR(
    ['forum_comments', postId],
    () => fetchComments(postId)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('forum_comments')
      .insert({
        post_id: postId,
        content: newComment.trim(),
        author_name: 'Anonymous',
      })
    
    if (error) {
      console.error('Error posting comment:', error)
    } else {
      setNewComment('')
      mutate(['forum_comments', postId])
    }
    
    setIsSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="mt-4 border-t border-border-muted pt-4">
      {isLoading && (
        <div className="text-sm text-primary/50">Loading comments...</div>
      )}
      
      {error && (
        <div className="text-sm text-primary">Error loading comments</div>
      )}
      
      <div className="space-y-3">
        {comments?.map((comment: Comment) => (
          <div key={comment.id} className="border-l-2 border-primary/30 pl-3">
            <div className="flex items-center gap-2 text-xs text-primary/60">
              <span>{comment.author_name}</span>
              <span>•</span>
              <span>{formatDate(comment.created_at)}</span>
            </div>
            <p className="mt-1 text-sm text-primary/80">{comment.content}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full resize-none border border-primary/30 bg-transparent p-2 text-sm text-primary placeholder-primary/30 focus:border-primary focus:outline-none"
          rows={2}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="mt-2 border border-primary px-3 py-1 text-xs uppercase text-primary transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  )
}
