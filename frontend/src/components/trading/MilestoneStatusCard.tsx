'use client'

import { Card } from '@/components/ui/card'

interface MilestoneStatusCardProps {
  completed: number
  total: number
}

export function MilestoneStatusCard({ completed, total }: MilestoneStatusCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <span className="text-sm font-medium">Milestone Status</span>
      <span className="text-xs text-muted-foreground">
        {completed} of {total} completed
      </span>
      <div className="flex flex-col">
        {Array.from({ length: total }).map((_, i) => {
          let icon: string
          let iconClass: string

          if (i < completed) {
            icon = '✓'
            iconClass = 'bg-emerald-500/20 text-emerald-400'
          } else if (i === completed) {
            icon = '◐'
            iconClass = 'bg-amber-500/20 text-amber-400'
          } else {
            icon = '○'
            iconClass = 'bg-neutral-500/20 text-neutral-400'
          }

          return (
            <div key={i} className="flex flex-col">
              <div className="flex items-center gap-3">
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-xs ${iconClass}`}
                >
                  {icon}
                </div>
                <span className="text-sm">Milestone {i + 1}</span>
              </div>
              {i < total - 1 && (
                <div className="flex">
                  <div className="flex w-6 items-center justify-center">
                    <div className="w-px h-4 bg-border" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
