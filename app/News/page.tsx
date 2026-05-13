'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'
import { CategoryFilter } from '@/components/category-filter'

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

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL')
  
  const { data: newsItems, error, isLoading } = useSWR(
    ['news_items', selectedCategory],
    () => fetcher(selectedCategory),
    { revalidateOnFocus: false }
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-primary">
          News
        </h1>

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
            <div className="text-center text-primary">Error loading news</div>
          )}
          
          {newsItems?.map((item: NewsItem) => (
            <article key={item.id} className="border border-border-muted bg-black p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
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
              
              <p className="mb-3 text-sm text-primary/80">{item.description}</p>
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded border border-primary/20 px-2 py-0.5 text-xs text-primary/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
          
          {newsItems?.length === 0 && !isLoading && (
            <div className="text-center text-primary/50">No news items</div>
          )}
        </div>
      </div>
    </div>
  )
}
