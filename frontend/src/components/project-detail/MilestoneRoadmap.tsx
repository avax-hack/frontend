'use client'

import { cn } from '@/lib/utils'
import type { IMilestoneInfo, MilestoneStatus } from '@/types/milestone'

interface MilestoneRoadmapProps {
  milestones: IMilestoneInfo[]
}

const STATUS_CONFIG: Record<MilestoneStatus, { icon: string; colorClass: string; label: string }> = {
  completed: { icon: '✓', colorClass: 'bg-emerald-500 text-white', label: 'Completed' },
  in_verification: { icon: '◐', colorClass: 'bg-amber-500 text-white', label: 'In Verification' },
  submitted: { icon: '◐', colorClass: 'bg-amber-500 text-white', label: 'Submitted' },
  pending: { icon: '○', colorClass: 'bg-secondary text-muted-foreground', label: 'Pending' },
  failed: { icon: '✕', colorClass: 'bg-red-500 text-white', label: 'Failed' },
}

export function MilestoneRoadmap({ milestones }: MilestoneRoadmapProps) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Milestone Roadmap</h2>

      <div className="overflow-x-auto pb-2">
        <div
          className="flex items-start gap-1"
          role="list"
          aria-label="Milestone roadmap"
        >
          {sorted.map((milestone, index) => {
            const config = STATUS_CONFIG[milestone.status]
            return (
              <div
                key={milestone.milestone_id}
                className="flex items-start"
                role="listitem"
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Node */}
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-sm font-bold',
                      config.colorClass,
                    )}
                    aria-label={`${milestone.title}: ${config.label}`}
                  >
                    {config.icon}
                  </div>

                  {/* Title */}
                  <span className="max-w-[100px] text-center text-xs font-medium leading-[1.2]">
                    {milestone.title}
                  </span>

                  {/* Fund release label (D-6) */}
                  <span className="text-[10px] text-muted-foreground">
                    Fund Release {milestone.fund_allocation_percent}%
                  </span>
                </div>

                {/* Connector line */}
                {index < sorted.length - 1 && (
                  <div className="mt-3 flex items-center px-1">
                    <div
                      className={cn(
                        'h-0.5 w-8',
                        milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-secondary',
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
