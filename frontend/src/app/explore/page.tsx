'use client'

import { useState } from 'react'
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useProjectList } from '@/features/project/hooks'
import { useNewContentSubscription } from '@/hooks/useWebSocket'
import { ProjectCard } from '@/components/common/ProjectCard'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TABS = ['All', 'Live', 'Upcoming'] as const
const PER_PAGE = 9

export default function ExplorePage() {
  useNewContentSubscription()
  const [activeTab, setActiveTab] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useProjectList('recent', {
    page,
    limit: PER_PAGE,
  })

  const projects = data?.data ?? []
  const totalCount = data?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))

  const filtered = projects.filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !p.project_info.name.toLowerCase().includes(q) &&
        !p.project_info.symbol.toLowerCase().includes(q)
      )
        return false
    }
    if (activeTab === 'Live') return p.market_info.status === 'funding'
    if (activeTab === 'Upcoming') return p.market_info.status === 'active'
    return true
  })

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Full-page background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero-bg.webp"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#070b14]/90" />
      </div>

      {/* Hero heading */}
      <section className="-mt-16 pt-16">
        <div className="flex flex-col gap-3 px-4 pt-16 pb-20 text-center lg:pt-24 lg:pb-28">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Explore
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white lg:text-5xl">
            Explore Projects
          </h1>
          <p className="mx-auto max-w-2xl text-white/50">
            Discover milestone-verified projects on Avalanche
          </p>
        </div>
      </section>

      {/* Filters + Search */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1) }}
              className={cn(
                'rounded-full px-5 py-1.5 text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-full border border-white/[0.06] bg-white/[0.04] py-2 pr-4 pl-10 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/20 md:w-72"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-8 md:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PER_PAGE }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-red-400">Something went wrong</p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No projects found"
            description="Be the first to launch on OpenLaunch"
            actionLabel="Launch a Project"
            actionHref="/launch"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.project_info.project_id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mx-auto flex items-center gap-2 px-4 pb-16 md:px-6 lg:pb-20">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 w-9 rounded-lg border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all',
                p === page
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:bg-white/[0.04] hover:text-white/60',
              )}
            >
              {p}
            </button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 rounded-lg border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
