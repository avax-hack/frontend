import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ProgressBar } from '@/components/common/ProgressBar'
import { MilestoneDots } from '@/components/common/MilestoneDots'
import { formatWeiToUSD } from '@/lib/utils'
import type { IProjectListItem, ProjectCategory, ProjectStatus } from '@/types/project'

interface FeaturedProjectCardProps {
  project: IProjectListItem
}

const categoryVariants: Record<ProjectCategory, { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue' }> = {
  defi: { label: 'DeFi', variant: 'blue' },
  infra: { label: 'Infra', variant: 'gray' },
  ai: { label: 'AI', variant: 'purple' },
  gaming: { label: 'Gaming', variant: 'green' },
  social: { label: 'Social', variant: 'amber' },
  meme: { label: 'Meme', variant: 'red' },
}

const statusVariants: Record<ProjectStatus, { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue' }> = {
  funding: { label: 'Funding', variant: 'blue' },
  active: { label: 'Active', variant: 'green' },
  completed: { label: 'Completed', variant: 'green' },
  failed: { label: 'Failed', variant: 'red' },
}

function getProgressColor(percent: number): 'green' | 'purple' | 'blue' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'purple'
  return 'blue'
}

function getMilestoneVariant(completed: number, total: number): 'green' | 'purple' | 'gray' {
  if (completed === total) return 'green'
  if (completed > 0) return 'purple'
  return 'gray'
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const category = categoryVariants[project_info.category]
  const status = statusVariants[market_info.status]

  return (
    <Link
      href={`/projects/${project_info.project_id}`}
      aria-label={`View featured project ${project_info.name}`}
    >
      <Card className="flex flex-col gap-6 p-6 hover:border-primary/30 transition-colors cursor-pointer md:flex-row md:items-start">
        {/* Left: Image placeholder + info */}
        <div className="flex flex-col gap-4 md:flex-1">
          <div className="flex items-center gap-4">
            {project_info.image_uri ? (
              <img
                src={project_info.image_uri}
                alt={project_info.name}
                className="size-16 rounded-xl object-cover"
              />
            ) : (
              <div className="size-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl" aria-hidden="true">
                {project_info.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{project_info.name}</h3>
                <StatusBadge label={status.label} variant={status.variant} size="sm" />
                <StatusBadge
                  label={`${milestone_completed}/${milestone_total} MS`}
                  variant={getMilestoneVariant(milestone_completed, milestone_total)}
                  size="sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">${project_info.symbol}</p>
              <StatusBadge label={category.label} variant={category.variant} size="sm" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{project_info.tagline}</p>

          {project_info.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {project_info.description}
            </p>
          )}
        </div>

        {/* Right: Funding + Milestone */}
        <div className="flex flex-col gap-4 md:flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Target</span>
              <span className="font-bold">{formatWeiToUSD(market_info.target_raise)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Committed</span>
              <span className="font-bold">{formatWeiToUSD(market_info.total_committed)}</span>
            </div>
          </div>

          <ProgressBar
            percent={market_info.funded_percent}
            color={getProgressColor(market_info.funded_percent)}
            showLabel
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {milestone_completed} of {milestone_total} milestones completed
            </span>
            <MilestoneDots completed={milestone_completed} total={milestone_total} size="md" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
