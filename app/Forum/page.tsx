'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import { ForumPost } from '@/components/forum/forum-post'
import { NewPostModal } from '@/components/forum/new-post-modal'
import { CategoryFilter } from '@/components/category-filter'

const CATEGORIES = ['ALL', 'CONSPIRACY', 'SIGHTINGS', 'DOCUMENTS', 'THEORIES', 'LOCATIONS', 'GENERAL'] as const

type Category = typeof CATEGORIES[number]

interface Post {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  votes: number
  created_at: string
  comment_count?: number
}

const fetcher = async (category: Category) => {
  const supabase = createClient()
  
  let query = supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category !== 'ALL') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  // Get comment counts
  const postsWithCounts = await Promise.all(
    (data || []).map(async (post) => {
      const { count } = await supabase
        .from('forum_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)
      
      return { ...post, comment_count: count || 0 }
    })
  )
  
  return postsWithCounts
}

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL')
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  
  useEffect(() => {
    // Generate or retrieve session ID for vote tracking
    let id = localStorage.getItem('primitive_session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('primitive_session_id', id)
    }
    setSessionId(id)
  }, [])
  
  const { data: posts, error, isLoading } = useSWR(
    ['forum_posts', selectedCategory],
    () => fetcher(selectedCategory),
    { revalidateOnFocus: false }
  )

  const handleNewPost = async (title: string, content: string, category: string) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('forum_posts')
      .insert({
        title,
        content,
        category,
        author_name: 'Anonymous',
      })
    
    if (error) {
      console.error('Error creating post:', error)
      return
    }
    
    mutate(['forum_posts', selectedCategory])
    setIsNewPostModalOpen(false)
  }

  const handleVote = async (postId: string, voteType: 1 | -1) => {
    if (!sessionId) return
    
    const supabase = createClient()
    
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('post_votes')
      .select('*')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
      .single()
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        await supabase.from('post_votes').delete().eq('id', existingVote.id)
        await supabase.rpc('increment_votes', { post_id: postId, amount: -voteType })
      } else {
        // Change vote
        await supabase
          .from('post_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id)
        await supabase.rpc('increment_votes', { post_id: postId, amount: voteType * 2 })
      }
    } else {
      // New vote
      await supabase.from('post_votes').insert({
        post_id: postId,
        session_id: sessionId,
        vote_type: voteType,
      })
      await supabase.rpc('increment_votes', { post_id: postId, amount: voteType })
    }
    
    mutate(['forum_posts', selectedCategory])
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-primary">
            Forum
          </h1>
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="border border-primary px-4 py-2 text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-black"
          >
            New Post
          </button>
        </div>

        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat as Category)}
        />

        <div className="mt-8 space-y-4">
          {isLoading && (
            <div className="text-center text-primary/50">Loading...</div>
          )}
          
          {error && (
            <div className="text-center text-primary">Error loading posts</div>
          )}
          
          {posts?.map((post: Post) => (
            <ForumPost
              key={post.id}
              post={post}
              onVote={handleVote}
              sessionId={sessionId}
            />
          ))}
          
          {posts?.length === 0 && !isLoading && (
            <div className="text-center text-primary/50">No posts yet</div>
          )}
        </div>
      </div>

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
        categories={CATEGORIES.filter(c => c !== 'ALL')}
      />
    </div>
  )
}
