'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, MessageSquare, Newspaper, MapPin, Eye } from 'lucide-react'

const navItems = [
  { href: '/Search', icon: Search, label: 'Search' },
  { href: '/Forum', icon: MessageSquare, label: 'Forum' },
  { href: '/News', icon: Newspaper, label: 'News' },
  { href: '/Locations', icon: MapPin, label: 'Locations' },
  { href: '/IAmEverywhere', icon: Eye, label: 'I Am Everywhere' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center gap-6 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-opacity hover:opacity-100 ${
              isActive ? 'opacity-100' : 'opacity-70'
            }`}
            title={item.label}
          >
            <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </Link>
        )
      })}
    </nav>
  )
}
