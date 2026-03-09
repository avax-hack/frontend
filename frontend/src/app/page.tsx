'use client'

import { useFeaturedProjects, useProjectList } from '@/features/project/hooks'
import { useNewContentSubscription } from '@/hooks/useWebSocket'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProjectCard } from '@/components/landing/FeaturedProjectCard'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { WhyOpenLaunch } from '@/components/landing/WhyOpenLaunch'
import { SuccessStories } from '@/components/landing/SuccessStories'
import { BottomCTA } from '@/components/landing/BottomCTA'
import { SkeletonCard } from '@/components/common/SkeletonCard'

export default function HomePage() {
  useNewContentSubscription()
  const featured = useFeaturedProjects()
  const projectList = useProjectList('recent')

  const projects = projectList.data?.data ?? []
  const projectCount = projectList.data?.total_count ?? 0
  const investorCount = projects.reduce(
    (sum, p) => sum + (p.market_info.investor_count ?? 0),
    0
  )
  const milestonesVerified = projects.reduce(
    (sum, p) => sum + p.milestone_completed,
    0
  )
  const totalCommittedNum = projects.reduce(
    (sum, p) => sum + parseFloat(p.market_info.total_committed || '0'),
    0
  )
  const totalCommitted =
    totalCommittedNum >= 1_000_000
      ? `$${(totalCommittedNum / 1_000_000).toFixed(1)}M`
      : totalCommittedNum >= 1_000
        ? `$${(totalCommittedNum / 1_000).toFixed(1)}K`
        : `$${totalCommittedNum}`

  const featuredProjects = featured.data?.projects ?? []
  const featuredProject = featuredProjects[0] ?? null

  return (
    <div className="flex min-h-screen flex-col bg-[#070b14]">
      <HeroSection
        featuredProject={featuredProject}
        stats={{ projectCount, totalCommitted, investorCount, milestonesVerified }}
      />

      {/* Featured Projects Grid */}
      {featuredProjects.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-3 pb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-red-500">
              Featured
            </span>
            <h2 className="text-2xl font-bold text-white lg:text-3xl">
              The #1 launchpad to launch your project on Avalanche.
            </h2>
          </div>
          {featured.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.slice(0, 4).map((p) => (
                <FeaturedProjectCard key={p.project_info.project_id} project={p} />
              ))}
            </div>
          )}
        </section>
      )}

      <WhyOpenLaunch />

      <HowItWorks />

      <SuccessStories />

      <BottomCTA />
    </div>
  )
}
