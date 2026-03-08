import Link from 'next/link'
import { getAddress } from 'viem'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatTokenToUSD } from '@/lib/utils'
import type { IProjectListItem, ProjectCategory, ProjectStatus } from '@/types/project'

interface FeaturedProjectCardProps {
  project: IProjectListItem
  totalSlides: number
  currentSlide: number
  onSlideChange: (index: number) => void
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

export function FeaturedProjectCard({
  project,
  totalSlides,
  currentSlide,
  onSlideChange,
}: FeaturedProjectCardProps) {
  const { project_info, market_info, milestone_completed, milestone_total } = project
  const category = categoryVariants[project_info.category] ?? { label: project_info.category ?? "Unknown", variant: "gray" as const }
  const status = statusVariants[market_info.status] ?? { label: market_info.status ?? "Unknown", variant: "gray" as const }

  const href = `/projects/${getAddress(project_info.project_id)}`

  return (
    <div className="relative flex h-[380px] w-full flex-col overflow-hidden rounded-2xl text-white sm:h-[360px] sm:flex-row"
      style={{
        background: 'linear-gradient(135deg, #0c1220 0%, #162040 40%, #1a1040 70%, #0e0e2c 100%)',
      }}
    >
      {/* Aurora glow effects */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(59,130,246,0.15) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 60% at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 40% at 60% 60%, rgba(6,182,212,0.08) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      {/* Bar indicators */}
      {totalSlides > 1 && (
        <div className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); onSlideChange(i) }}
              className={`h-[3px] w-12 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white' : 'bg-white/25'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Left: Project info — flex-1 = 50% */}
      <Link href={href} className="relative z-[1] flex flex-1 flex-col justify-between p-7 pt-14 sm:p-10 sm:pt-14">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            {project_info.image_uri ? (
              <img
                src={project_info.image_uri}
                alt={project_info.name}
                className="size-[72px] shrink-0 rounded-xl object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="size-[72px] shrink-0 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold text-2xl ring-1 ring-white/20">
                {project_info.name.charAt(0)}
              </div>
            )}
            <h3 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">{project_info.name}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={status.label} variant={status.variant} size="md" />
            <StatusBadge label={category.label} variant={category.variant} size="md" />
          </div>
        </div>

        <p className="h-[60px] text-base leading-relaxed text-white/50 line-clamp-3">
          {project_info.description || 'No description provided.'}
        </p>
      </Link>

      {/* Right: Metrics — flex-1 = 50% */}
      <Link href={href} className="relative z-[1] flex flex-1 flex-row justify-between border-t border-white/[0.06] p-7 sm:flex-col sm:justify-center sm:gap-8 sm:border-t-0 sm:border-l sm:p-10">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Target</span>
          <span className="truncate text-xl font-bold tracking-tight sm:text-[32px]">{formatTokenToUSD(market_info.target_raise)}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Total Committed</span>
          <span className="truncate text-xl font-bold tracking-tight sm:text-[32px]">{formatTokenToUSD(market_info.total_committed)}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Milestones</span>
          <span className="text-xl font-bold tracking-tight sm:text-[32px]">{milestone_completed}/{milestone_total}</span>
        </div>
      </Link>
    </div>
  )
}
