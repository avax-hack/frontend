'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircleIcon, ClockIcon, LockIcon, AlertTriangleIcon } from 'lucide-react'
import type { IMilestoneInfo, MilestoneStatus } from '@/types/milestone'

interface MilestoneManagementProps {
  milestones: IMilestoneInfo[] | undefined
  isLoading: boolean
  onSubmit: (milestone: IMilestoneInfo) => void
}

const statusConfig: Record<MilestoneStatus, {
  icon: React.ReactNode
  variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue'
  label: string
}> = {
  completed: {
    icon: <CheckCircleIcon className="size-5 text-emerald-500" />,
    variant: 'green',
    label: 'Completed',
  },
  in_verification: {
    icon: <ClockIcon className="size-5 text-amber-500" />,
    variant: 'amber',
    label: 'In Verification',
  },
  submitted: {
    icon: <ClockIcon className="size-5 text-amber-500" />,
    variant: 'amber',
    label: 'Submitted',
  },
  pending: {
    icon: <LockIcon className="size-5 text-muted-foreground" />,
    variant: 'gray',
    label: 'Pending',
  },
  failed: {
    icon: <AlertTriangleIcon className="size-5 text-red-500" />,
    variant: 'red',
    label: 'Failed',
  },
}

export function MilestoneManagement({
  milestones,
  isLoading,
  onSubmit,
}: MilestoneManagementProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!milestones || milestones.length === 0) return null

  // Find first actionable milestone (first pending one after completed/verification ones)
  const activeIndex = milestones.findIndex(
    (m) => m.status === 'pending' || m.status === 'failed',
  )
  // Only the first pending milestone is submittable
  const submittableId =
    activeIndex !== -1 && milestones[activeIndex].status === 'pending'
      ? milestones[activeIndex].milestone_id
      : undefined

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Milestones</h2>
      {milestones.map((milestone) => {
        const config = statusConfig[milestone.status]
        const isSubmittable = milestone.milestone_id === submittableId

        return (
          <Card
            key={milestone.milestone_id}
            className={`p-4 flex flex-col gap-3 ${
              milestone.status === 'pending' && !isSubmittable ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div aria-hidden="true">{config.icon}</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Milestone {milestone.order}
                    </span>
                    <StatusBadge
                      label={config.label}
                      variant={config.variant}
                      size="sm"
                    />
                  </div>
                  <span className="font-medium">{milestone.title}</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                {milestone.fund_allocation_percent}%
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-[1.2]">
              {milestone.description}
            </p>

            {milestone.funds_released && (
              <StatusBadge label="Funds Released" variant="green" size="sm" />
            )}

            {isSubmittable && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onSubmit(milestone)}
              >
                Submit for Verification
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}
