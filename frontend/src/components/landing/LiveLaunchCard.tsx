import Link from 'next/link'
import { getAddress } from 'viem'
import { ProgressBar } from '@/components/common/ProgressBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatTokenToUSD } from '@/lib/utils'
import type { IProjectListItem, ProjectCategory } from '@/types/project'

interface LiveLaunchCardProps {
  project: IProjectListItem
}

const categoryVariants: Record<
  ProjectCategory,
  { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue' }
> = {
  defi: { label: 'DeFi', variant: 'blue' },
  infra: { label: 'Infra', variant: 'gray' },
  ai: { label: 'AI', variant: 'purple' },
  gaming: { label: 'Gaming', variant: 'green' },
  social: { label: 'Social', variant: 'amber' },
  meme: { label: 'Meme', variant: 'red' },
  other: { label: 'Other', variant: 'gray' },
}

export function LiveLaunchCard({ project }: LiveLaunchCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const category = categoryVariants[project_info.category] ?? {
    label: project_info.category ?? 'Unknown',
    variant: 'gray' as const,
  }
  const href = `/projects/${getAddress(project_info.project_id)}`

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl lg:w-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">
          Live Launch
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          LIVE NOW
        </span>
      </div>

      {/* Project Info */}
      <div className="flex items-center gap-3 pb-5">
        {project_info.image_uri ? (
          <img
            src={project_info.image_uri}
            alt={project_info.name}
            className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-white/20"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg font-bold ring-1 ring-white/20">
            {project_info.name.charAt(0)}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <h4 className="truncate text-lg font-bold text-white">{project_info.name}</h4>
          <div className="flex items-center gap-1.5">
            <StatusBadge label={category.label} variant={category.variant} size="sm" />
            <span className="text-xs text-white/40">{project_info.symbol}</span>
          </div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="flex flex-col gap-3 pb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Funded</span>
          <span className="font-semibold text-white">{market_info.funded_percent.toFixed(1)}%</span>
        </div>
        <ProgressBar percent={market_info.funded_percent} color="blue" size="sm" />
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2.5 pb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Investors</span>
          <span className="font-medium text-white">
            {market_info.investor_count.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Milestones</span>
          <span className="font-medium text-white">
            {milestone_completed}/{milestone_total}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Raise</span>
          <span className="font-medium text-white">
            {formatTokenToUSD(market_info.total_committed)}{' '}
            <span className="text-white/40">/ {formatTokenToUSD(market_info.target_raise)}</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={href}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        View Project
      </Link>
    </div>
  )
}
