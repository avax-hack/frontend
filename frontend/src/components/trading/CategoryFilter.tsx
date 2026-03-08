'use client'

import { Button } from '@/components/ui/button'
import type { TokenCategory } from '@/features/trading/types'

const CATEGORY_OPTIONS: { label: string; value: TokenCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'DeFi', value: 'defi' },
  { label: 'Infra', value: 'infra' },
  { label: 'AI', value: 'ai' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Social', value: 'social' },
  { label: 'Meme', value: 'meme' },
] as const

interface CategoryFilterProps {
  value: TokenCategory
  onChange: (cat: TokenCategory) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide"
      role="radiogroup"
      aria-label="Filter by category"
    >
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = value === option.value
        return (
          <Button
            key={option.value}
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
