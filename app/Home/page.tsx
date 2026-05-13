'use client'

import { useRouter } from 'next/navigation'

export default function SecretHomePage() {
  const router = useRouter()

  const handleYes = () => {
    router.push('/')
  }

  const handleNo = () => {
    // Stay on this page - do nothing or subtle effect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-16 text-6xl font-bold tracking-[0.3em] text-primary md:text-8xl">
        GO?
      </h1>
      
      <div className="flex gap-8">
        <button
          onClick={handleYes}
          className="text-4xl font-bold uppercase tracking-wider text-primary transition-opacity hover:opacity-70 md:text-6xl"
        >
          YES
        </button>
        <span className="text-4xl text-primary/30 md:text-6xl">/</span>
        <button
          onClick={handleNo}
          className="text-4xl font-light lowercase tracking-wider text-primary/50 transition-opacity hover:opacity-70 md:text-6xl"
        >
          no
        </button>
      </div>
    </div>
  )
}
