'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { MapPin, ExternalLink, Copy, Check } from 'lucide-react'
import { CategoryFilter } from '@/components/category-filter'

const CATEGORIES = ['ALL', 'SUSPICIOUS', 'CLASSIFIED', 'ANOMALOUS', 'RESTRICTED', 'UNKNOWN'] as const

type Category = typeof CATEGORIES[number]

interface Location {
  id: string
  name: string
  description: string
  coordinates: string
  category: string
  access_notes: string | null
  created_at: string
}

const fetcher = async (category: Category) => {
  const supabase = createClient()
  
  let query = supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category !== 'ALL') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

function LocationCard({ location }: { location: Location }) {
  const [copied, setCopied] = useState(false)

  const copyCoordinates = async () => {
    await navigator.clipboard.writeText(location.coordinates)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getGoogleMapsUrl = (coords: string) => {
    // Parse coordinates and create Google Maps URL
    const cleanCoords = coords.replace(/°/g, '').replace(/\s/g, '')
    return `https://www.google.com/maps/search/${encodeURIComponent(coords)}`
  }

  return (
    <article className="border border-border-muted bg-black p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary/60" />
          <h3 className="text-lg font-semibold text-primary">{location.name}</h3>
        </div>
        <a
          href={getGoogleMapsUrl(location.coordinates)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-primary/60 transition-colors hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded border border-primary/50 px-2 py-0.5 uppercase text-primary">
          {location.category}
        </span>
        <span className="text-primary/40">•</span>
        <span className="text-primary/60">Updated {formatDate(location.created_at)}</span>
      </div>

      {/* Coordinates box */}
      <div className="mb-3 flex items-center justify-between bg-muted p-3">
        <div>
          <div className="text-xs uppercase text-primary/40">Coordinates</div>
          <div className="text-sm text-primary">{location.coordinates}</div>
        </div>
        <button
          onClick={copyCoordinates}
          className="text-xs uppercase text-primary/60 transition-colors hover:text-primary"
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="h-3 w-3" /> Copy
            </span>
          )}
        </button>
      </div>
      
      <p className="mb-3 text-sm text-primary/80">{location.description}</p>
      
      {location.access_notes && (
        <div className="border-l-2 border-primary/30 pl-3">
          <div className="text-xs uppercase text-primary/40">Access Notes</div>
          <p className="text-sm text-primary/60">{location.access_notes}</p>
        </div>
      )}
    </article>
  )
}

export default function LocationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL')
  
  const { data: locations, error, isLoading } = useSWR(
    ['locations', selectedCategory],
    () => fetcher(selectedCategory),
    { revalidateOnFocus: false }
  )

  return (
    <div className="min-h-screen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-primary">
          Locations
        </h1>

        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat as Category)}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoading && (
            <div className="col-span-2 text-center text-primary/50">Loading...</div>
          )}
          
          {error && (
            <div className="col-span-2 text-center text-primary">Error loading locations</div>
          )}
          
          {locations?.map((location: Location) => (
            <LocationCard key={location.id} location={location} />
          ))}
          
          {locations?.length === 0 && !isLoading && (
            <div className="col-span-2 text-center text-primary/50">No locations found</div>
          )}
        </div>
      </div>
    </div>
  )
}
