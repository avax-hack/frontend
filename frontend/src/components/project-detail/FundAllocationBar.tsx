import { cn } from '@/lib/utils'
import type { IMilestoneInfo } from '@/types/milestone'

interface FundAllocationBarProps {
  milestones: IMilestoneInfo[]
}

const SEGMENT_COLORS = [
  'bg-primary',
  'bg-purple-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-rose-500',
] as const

const LEGEND_DOT_COLORS = [
  'bg-primary',
  'bg-purple-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-rose-500',
] as const

export function FundAllocationBar({ milestones }: FundAllocationBarProps) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">Fund Allocation</h2>

      {/* Stacked bar */}
      <div
        className="flex h-6 overflow-hidden rounded-full bg-white/[0.06]"
        role="img"
        aria-label="Fund allocation per milestone"
      >
        {sorted.map((milestone, index) => (
          <div
            key={milestone.milestone_id}
            className={cn(
              'flex items-center justify-center text-[10px] font-bold text-white transition-all',
              SEGMENT_COLORS[index % SEGMENT_COLORS.length],
            )}
            style={{ width: `${milestone.fund_allocation_percent}%` }}
            title={`${milestone.title}: ${milestone.fund_allocation_percent}%`}
          >
            {milestone.fund_allocation_percent >= 12 && (
              <span>{milestone.fund_allocation_percent}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {sorted.map((milestone, index) => (
          <div key={milestone.milestone_id} className="flex items-center gap-2">
            <span
              className={cn(
                'size-3 rounded-full',
                LEGEND_DOT_COLORS[index % LEGEND_DOT_COLORS.length],
              )}
              aria-hidden="true"
            />
            <span className="text-xs text-white/50">
              {milestone.title} ({milestone.fund_allocation_percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
