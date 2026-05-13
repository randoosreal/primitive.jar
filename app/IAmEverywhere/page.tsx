import { ExternalLink } from 'lucide-react'

const RIDDLE_LINKS = [
  {
    text: 'Tumbling down a cliff.',
    url: 'https://www.tumblr.com/22-24-26-28-26-30-26-42-44',
  },
  {
    text: "You've come quite a long way from here.",
    url: 'https://3301337cb.straw.page/',
  },
  {
    text: 'Help and hell are one in the same for you.',
    url: 'https://hellpyou.straw.page/',
  },
  {
    text: 'Where disdainful things go.',
    url: 'https://the-meatshop.straw.page/',
  },
]

export default function IAmEverywherePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-[0.3em] text-primary">
          I AM EVERYWHERE
        </h1>
        <p className="mb-12 text-sm text-primary/50">
          you cannot contain what has no borders.
        </p>

        <div className="space-y-4">
          {RIDDLE_LINKS.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border border-border-muted bg-black p-4 transition-colors hover:border-primary"
            >
              <span className="text-primary/80 transition-colors group-hover:text-primary">
                {link.text}
              </span>
              <ExternalLink className="h-4 w-4 text-primary/40 transition-colors group-hover:text-primary" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
