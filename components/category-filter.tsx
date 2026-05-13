'use client'

interface CategoryFilterProps {
  categories: readonly string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`border px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
            selected === category
              ? 'border-primary bg-primary text-black'
              : 'border-primary/30 text-primary/60 hover:border-primary hover:text-primary'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
