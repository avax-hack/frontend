'use client'

import { Button } from '@/components/ui/button'
import type { ChartResolution } from '@/features/trading/types'

const INTERVALS = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1D', value: '1D' },
] as const

interface ChartIntervalSelectorProps {
  value: ChartResolution
  onChange: (resolution: ChartResolution) => void
}

export function ChartIntervalSelector({
  value,
  onChange,
}: ChartIntervalSelectorProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Chart interval">
      {INTERVALS.map((interval) => (
        <Button
          key={interval.value}
          size="sm"
          variant={value === interval.value ? 'secondary' : 'ghost'}
          role="radio"
          aria-checked={value === interval.value}
          onClick={() => onChange(interval.value)}
        >
          {interval.label}
        </Button>
      ))}
    </div>
  )
}
