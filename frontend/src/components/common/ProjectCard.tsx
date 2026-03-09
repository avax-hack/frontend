import Link from 'next/link'
import { UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatTokenToUSD, safeGetAddress } from '@/lib/utils'
import { ProgressBar } from './ProgressBar'
import type { IProjectListItem } from '@/types/project'

interface ProjectCardProps {
  project: IProjectListItem
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const { funded_percent, target_raise, total_committed, investor_count, status } = market_info
  const checkedId = safeGetAddress(project_info.project_id)
  const href = checkedId ? `/projects/${checkedId}` : null

  const stageLabel =
    status === 'funding'
      ? `Milestone ${milestone_completed + 1}`
      : status === 'active'
        ? 'Initial Offering'
        : status === 'completed'
          ? 'Completed'
          : 'Failed'

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all hover:border-red-500/20 hover:bg-white/[0.05]">
      {/* Top glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-1 flex-col gap-3.5 p-5">
        {/* Header: logo + name + description */}
        <div className="flex items-start gap-3">
          {project_info.image_uri ? (
            <img
              src={project_info.image_uri}
              alt={project_info.name}
              className="size-11 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 text-sm font-bold text-white/70 ring-1 ring-white/10">
              {project_info.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 pt-0.5">
            <p className="truncate text-[15px] font-semibold text-white">
              {project_info.name}
              <span className="ml-1.5 text-sm font-normal text-white/30">({project_info.symbol})</span>
            </p>
            {project_info.description && (
              <p className="mt-0.5 truncate text-xs leading-relaxed text-white/35">{project_info.description}</p>
            )}
          </div>
        </div>

        {/* Committed row */}
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/40">Committed:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white">{formatTokenToUSD(total_committed)}</span>
            <span className={cn(
              'text-xs font-semibold',
              funded_percent >= 75 ? 'text-emerald-400' : funded_percent >= 40 ? 'text-blue-400' : 'text-rose-400',
            )}>
              {Math.round(funded_percent)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar percent={funded_percent} color="red" size="sm" />

        {/* Meta row */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3 text-white/30">
            <span>Target: <span className="text-white/50">{formatTokenToUSD(target_raise)}</span></span>
            <span className="h-3 w-px bg-white/10" />
            <span>Stage: <span className="text-white/50">{stageLabel}</span></span>
          </div>
          {investor_count > 0 && (
            <span className="flex items-center gap-1 text-white/40">
              <UsersIcon className="h-3 w-3" />
              <span className="font-medium">{investor_count}</span>
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
          <span className={cn(
            'text-xs',
            funded_percent >= 75
              ? 'font-medium text-emerald-400/80'
              : 'text-white/25',
          )}>
            Funded {Math.round(funded_percent)}%
          </span>
          {href ? (
            <Button asChild size="sm" variant="gradient">
              <Link href={href}>View Project</Link>
            </Button>
          ) : (
            <Button size="sm" variant="gradient" disabled>
              View Project
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
