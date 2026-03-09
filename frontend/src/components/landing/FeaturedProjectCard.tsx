import Link from 'next/link'
import { getAddress } from 'viem'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatTokenToUSD } from '@/lib/utils'
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
  other: { label: 'Other', variant: 'gray' },
}

const statusVariants: Record<ProjectStatus, { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue' }> = {
  funding: { label: 'Funding', variant: 'blue' },
  active: { label: 'Active', variant: 'green' },
  completed: { label: 'Completed', variant: 'green' },
  failed: { label: 'Failed', variant: 'red' },
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const { project_info, market_info } = project
  const category = categoryVariants[project_info.category] ?? { label: project_info.category ?? 'Unknown', variant: 'gray' as const }
  const status = statusVariants[market_info.status] ?? { label: market_info.status ?? 'Unknown', variant: 'gray' as const }
  const href = `/projects/${getAddress(project_info.project_id)}`

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10"
    >
      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5">
          <StatusBadge label={status.label} variant={status.variant} size="sm" />
          <StatusBadge label={category.label} variant={category.variant} size="sm" />
        </div>

        <div className="flex items-center gap-3">
          {project_info.image_uri ? (
            <img
              src={project_info.image_uri}
              alt={project_info.name}
              className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 font-bold ring-1 ring-white/20">
              {project_info.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-white">{project_info.name}</h4>
            <span className="text-xs text-white/40">{project_info.symbol}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Total Raise</span>
          <span className="font-semibold text-white">{formatTokenToUSD(market_info.target_raise)}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Committed</span>
          <span className="font-semibold text-white">{formatTokenToUSD(market_info.total_committed)}</span>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0" />
    </Link>
  )
}
