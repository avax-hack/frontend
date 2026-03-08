'use client'

import { Card } from '@/components/ui/card'

interface MilestoneStatusCardProps {
  completed: number
  total: number
}

export function MilestoneStatusCard({ completed, total }: MilestoneStatusCardProps) {
  if (total === 0) return null

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Milestone Status</span>
        <span className="text-sm font-medium">{completed}/{total}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < completed ? 'bg-emerald-500' : 'bg-secondary'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}
