import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ProgressBar } from './ProgressBar'
import { MilestoneDots } from './MilestoneDots'
import type { IProjectListItem } from '@/types/project'

interface ProjectCardProps {
  project: IProjectListItem
}

function getProgressColor(percent: number): 'green' | 'cyan' | 'blue' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'cyan'
  return 'blue'
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const { funded_percent } = market_info

  return (
    <Link href={`/projects/${project_info.project_id}`}>
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
            <p className="font-bold truncate">{project_info.name}</p>
            <p className="text-sm text-muted-foreground">${project_info.symbol}</p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project_info.tagline}
        </p>

        {/* Progress */}
        <ProgressBar percent={funded_percent} color={getProgressColor(funded_percent)} size="sm" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Funded {Math.round(funded_percent)}%
          </span>
          <MilestoneDots completed={milestone_completed} total={milestone_total} />
        </div>
      </Card>
    </Link>
  )
}
