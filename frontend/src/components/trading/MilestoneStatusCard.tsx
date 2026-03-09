'use client'

interface MilestoneStatusCardProps {
  completed: number
  total: number
}

export function MilestoneStatusCard({ completed, total }: MilestoneStatusCardProps) {
  if (total === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Milestone Progress</span>
        <span className="text-xs text-muted-foreground font-medium">
          {completed}/{total}
        </span>
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
    </div>
  )
}
