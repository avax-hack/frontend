'use client'

import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTokenToUSD, formatNumber } from '@/lib/utils'
import type { IBuilderOverviewData } from '@/features/builder/types'

interface ProjectOverviewCardProps {
  data: IBuilderOverviewData | undefined
  isLoading: boolean
}

const statusVariant: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'gray' | 'purple'> = {
  funding: 'blue',
  active: 'green',
  completed: 'purple',
  failed: 'red',
}

export function ProjectOverviewCard({ data, isLoading }: ProjectOverviewCardProps) {
  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />
  }

  if (!data) return null

  const { project_info, market_info, current_milestone, total_milestones } = data

  return (
    <Card className="p-6 flex flex-col gap-4 bg-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {project_info.image_uri ? (
            <img src={project_info.image_uri} alt="" className="size-10 rounded-full" />
          ) : (
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold">
              {project_info.symbol.charAt(0)}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold truncate">{project_info.name}</span>
            <span className="text-sm text-muted-foreground">{project_info.symbol}</span>
          </div>
        </div>
        <StatusBadge
          label={market_info.status}
          variant={statusVariant[market_info.status] ?? 'gray'}
        />
      </div>

      <ProgressBar percent={market_info.funded_percent} color="green" showLabel />

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Total Raised</span>
          <span className="font-bold">{formatTokenToUSD(market_info.total_committed)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Investors</span>
          <span className="font-bold">{formatNumber(market_info.investor_count)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Current Milestone</span>
          <span className="font-bold">
            {current_milestone.order}/{total_milestones}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {current_milestone.title}
          </span>
        </div>
      </div>
    </Card>
  )
}
