import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ProgressBar } from '@/components/common/ProgressBar'
import { MilestoneDots } from '@/components/common/MilestoneDots'
import { formatWeiToUSD } from '@/lib/utils'
import type { IProjectListItem } from '@/types/project'
import type { ProjectStatus } from '@/types/project'

interface FeaturedProjectCardProps {
  project: IProjectListItem
}

const statusVariants: Record<ProjectStatus, { label: string; variant: 'blue' | 'green' | 'gray' | 'red' }> = {
  funding: { label: 'Funding', variant: 'blue' },
  active: { label: 'Active', variant: 'green' },
  completed: { label: 'Completed', variant: 'gray' },
  failed: { label: 'Failed', variant: 'red' },
}

function getProgressColor(percent: number): 'green' | 'cyan' | 'blue' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'cyan'
  return 'blue'
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const status = statusVariants[market_info.status]

  return (
    <Link href={`/projects/${project_info.project_id}`}>
      <Card className="flex flex-col gap-6 p-6 hover:border-primary/30 transition-colors cursor-pointer md:flex-row md:items-start">
        {/* Left: Project Info */}
        <div className="flex flex-col gap-3 md:flex-1">
          <div className="flex items-center gap-4">
            {project_info.image_uri ? (
              <img
                src={project_info.image_uri}
                alt={project_info.name}
                className="size-16 rounded-xl object-cover"
              />
            ) : (
              <div className="size-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
                {project_info.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">{project_info.name}</h3>
              <p className="text-sm text-muted-foreground">${project_info.symbol}</p>
              <StatusBadge label={status.label} variant={status.variant} size="sm" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project_info.tagline}
          </p>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col gap-3 md:flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Target</span>
              <span className="font-bold">{formatWeiToUSD(market_info.target_raise)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Committed</span>
              <span className="font-bold">{formatWeiToUSD(market_info.total_committed)}</span>
            </div>
          </div>
          <ProgressBar
            percent={market_info.funded_percent}
            color={getProgressColor(market_info.funded_percent)}
            showLabel
            label={`${Math.round(market_info.funded_percent)}% funded`}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Milestone Progress</span>
            <MilestoneDots completed={milestone_completed} total={milestone_total} size="md" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
