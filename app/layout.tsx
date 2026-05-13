import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'primitive.jar',
  description: 'The truth is out there.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen font-mono antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
