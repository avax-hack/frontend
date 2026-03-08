'use client'

import { Button } from '@/components/ui/button'
import type { SortType } from '@/features/trading/types'

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: 'Recent', value: 'creation_time_desc' },
  { label: 'Market Cap', value: 'mcap' },
  { label: 'Trending', value: 'trending' },
  { label: 'Most Funded', value: 'most_funded' },
] as const

interface SortFilterProps {
  value: SortType
  onChange: (sort: SortType) => void
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Sort tokens">
      {SORT_OPTIONS.map((option) => {
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
