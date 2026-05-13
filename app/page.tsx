'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/Home">
        <h1 className="mb-16 cursor-pointer text-6xl font-bold tracking-[0.3em] text-primary transition-opacity hover:opacity-80 md:text-8xl">
          PRIMITIVE
        </h1>
      </Link>
      
      <form onSubmit={handleSearch} className="w-full max-w-2xl">
        <div className="relative flex items-center border border-primary bg-transparent">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-4 py-3 text-primary placeholder-primary/50 focus:outline-none"
            placeholder=""
          />
          <button
            type="submit"
            className="absolute right-4 text-primary transition-opacity hover:opacity-70"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </form>
    </div>
  )
}
