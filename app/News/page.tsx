'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'

const CATEGORIES = ['ALL', 'DECLASSIFIED', 'LEAKED', 'WHISTLEBLOWER', 'FOIA', 'ANONYMOUS'] as const

type Category = typeof CATEGORIES[number]

interface NewsItem {
  id: string
  title: string
  description: string
  category: string
  source_name: string | null
  source_url: string | null
  tags: string[]
  created_at: string
}

const fetcher = async (category: Category) => {
  const supabase = createClient()
  
  let query = supabase
    .from('news_items')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category !== 'ALL') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

const fetchCategoryCounts = async () => {
  const supabase = createClient()
  const counts: Record<string, number> = { ALL: 0 }
  
  for (const cat of CATEGORIES) {
    if (cat === 'ALL') {
      const { count } = await supabase
        .from('news_items')
        .select('*', { count: 'exact', head: true })
      counts.ALL = count || 0
    } else {
      const { count } = await supabase
        .from('news_items')
        .select('*', { count: 'exact', head: true })
        .eq('category', cat)
      counts[cat] = count || 0
    }
  }
  
  return counts
}

// Declassification animation component
function DeclassifiedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setRevealed(true)
            return 100
          }
          return prev + 2
        })
      }, 50)
      
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [delay])

  if (revealed) {
    return <span>{text}</span>
  }

  // Create a partially revealed text effect
  const words = text.split(' ')
  const revealedWordCount = Math.floor((progress / 100) * words.length)

  return (
    <span>
      {words.map((word, index) => (
        <span key={index}>
          {index < revealedWordCount ? (
            word
          ) : (
            <span className="relative inline-block">
              <span className="invisible">{word}</span>
              <span 
                className="absolute inset-0 bg-primary"
                style={{ opacity: 1 - (progress / 100) }}
              />
            </span>
          )}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className="border border-border-muted bg-black p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-primary">
          <DeclassifiedText text={item.title} delay={index * 200} />
        </h3>
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-primary/60 transition-colors hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded border border-primary/50 px-2 py-0.5 uppercase text-primary">
          {item.category}
        </span>
        {item.source_name && (
          <>
            <span className="text-primary/40">•</span>
            <span className="text-primary/60">{item.source_name}</span>
          </>
        )}
        <span className="text-primary/40">•</span>
        <span className="text-primary/60">{formatDate(item.created_at)}</span>
      </div>
      
      <p className="mb-3 text-sm text-primary/80">
        <DeclassifiedText text={item.description} delay={index * 200 + 500} />
      </p>
      
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="rounded border border-primary/20 px-2 py-0.5 text-xs text-primary/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL')
  
  const { data: newsItems, error, isLoading } = useSWR(
    ['news_items', selectedCategory],
    () => fetcher(selectedCategory),
    { revalidateOnFocus: false }
  )

  const { data: categoryCounts } = useSWR(
    'news_category_counts',
    fetchCategoryCounts,
    { revalidateOnFocus: false }
  )

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-primary">
          News
        </h1>

        {/* Category filter with counts and notification badges */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-black'
                  : 'border border-primary/30 text-primary/60 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
              {categoryCounts && categoryCounts[cat] > 0 && (
                <>
                  <span className="ml-1.5 opacity-70">{categoryCounts[cat]}</span>
                  {/* Notification dot for unread items */}
                  {cat !== 'ALL' && cat !== selectedCategory && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {isLoading && (
            <div className="text-center text-primary/50">Loading...</div>
          )}
          
          {error && (
            <div className="text-center text-primary">Error loading news</div>
          )}
          
          {newsItems?.map((item: NewsItem, index: number) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
          
          {newsItems?.length === 0 && !isLoading && (
            <div className="text-center text-primary/50">No news items</div>
          )}
        </div>
      </div>
    </div>
  )
}
