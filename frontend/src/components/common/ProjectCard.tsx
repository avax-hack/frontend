import Link from 'next/link'
import { getAddress } from 'viem'
import { Card } from '@/components/ui/card'
import { cn, formatTokenToUSD, formatLaunchDate } from '@/lib/utils'
import { ProgressBar } from './ProgressBar'
import { MilestoneDots } from './MilestoneDots'
import type { IProjectListItem } from '@/types/project'

interface ProjectCardProps {
  project: IProjectListItem
}

function getFundedColor(percent: number): string {
  if (percent >= 75) return 'text-green-500'
  if (percent >= 40) return 'text-foreground'
  return 'text-muted-foreground'
}

function getProgressColor(percent: number): 'green' | 'purple' | 'blue' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'blue'
  return 'purple'
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const { funded_percent, target_raise, total_committed } = market_info

  return (
    <Link
      href={`/projects/${getAddress(project_info.project_id)}`}
      aria-label={`View ${project_info.name} (${project_info.symbol}) project details`}
    >
      <Card className={cn(
        'flex flex-col gap-3 p-4 hover:border-primary/30 transition-colors cursor-pointer',
      )}>
        {/* Header: logo + name */}
        <div className="flex items-center gap-3">
          {project_info.image_uri ? (
            <img
              src={project_info.image_uri}
              alt={project_info.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {project_info.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold truncate">
              {project_info.name}{' '}
              <span className="font-normal text-muted-foreground">({project_info.symbol})</span>
            </p>
          </div>
        </div>

        {project_info.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project_info.description}
          </p>
        )}

        {/* Metrics: Committed / Target */}
        <div className="flex items-center gap-4 text-sm">
          <span>Committed: {formatTokenToUSD(total_committed)}</span>
          <span className="text-muted-foreground">Target: {formatTokenToUSD(target_raise)}</span>
        </div>

        {/* Progress */}
        <ProgressBar percent={funded_percent} color={getProgressColor(funded_percent)} size="sm" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={cn('text-xs font-medium', getFundedColor(funded_percent))}>
            Funded {Math.round(funded_percent)}%
          </span>
          <MilestoneDots completed={milestone_completed} total={milestone_total} />
        </div>
      </Card>
    </Link>
  )
}
