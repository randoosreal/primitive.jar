'use client'

import { useState } from 'react'
import { X, ImagePlus, Trash2 } from 'lucide-react'

interface NewPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, content: string, category: string, imageUrl?: string) => void
  categories: readonly string[]
}

export function NewPostModal({ isOpen, onClose, onSubmit, categories }: NewPostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    await onSubmit(title.trim(), content.trim(), category, imageUrl.trim() || undefined)
    setTitle('')
    setContent('')
    setCategory(categories[0])
    setImageUrl('')
    setShowImageInput(false)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-primary bg-black p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider text-primary">
            New Post
          </h2>
          <button
            onClick={onClose}
            className="text-primary transition-opacity hover:opacity-70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase text-primary/60">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-primary/30 bg-transparent p-2 text-primary placeholder-primary/30 focus:border-primary focus:outline-none"
              placeholder="Enter title..."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-primary/60">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-primary/30 bg-black p-2 text-primary focus:border-primary focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-primary/60">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none border border-primary/30 bg-transparent p-2 text-primary placeholder-primary/30 focus:border-primary focus:outline-none"
              placeholder="What do you want to share?"
              rows={6}
              required
            />
          </div>

          {/* Image Attachment */}
          <div>
            {!showImageInput ? (
              <button
                type="button"
                onClick={() => setShowImageInput(true)}
                className="flex items-center gap-2 text-sm text-primary/60 transition-colors hover:text-primary"
              >
                <ImagePlus className="h-4 w-4" />
                Add Image Attachment
              </button>
            ) : (
              <div className="space-y-2">
                <label className="mb-1 block text-xs uppercase text-primary/60">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 border border-primary/30 bg-transparent p-2 text-sm text-primary placeholder-primary/30 focus:border-primary focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('')
                      setShowImageInput(false)
                    }}
                    className="text-primary/60 transition-colors hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {imageUrl && (
                  <div className="mt-2 border border-border-muted p-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-32 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-primary/30 px-4 py-2 text-sm uppercase text-primary/60 transition-colors hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-primary bg-primary px-4 py-2 text-sm uppercase text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
