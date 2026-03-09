'use client'

import { useFeaturedProjects, useProjectList } from '@/features/project/hooks'
import { useNewContentSubscription } from '@/hooks/useWebSocket'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { FeaturedCarousel } from '@/components/landing/FeaturedCarousel'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { WhyOpenLaunch } from '@/components/landing/WhyOpenLaunch'
import { SuccessStories } from '@/components/landing/SuccessStories'
import { BottomCTA } from '@/components/landing/BottomCTA'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'

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

  return (
    <div className="flex flex-col">
      <HeroSection />

      <StatsBar
        projectCount={projectCount}
        totalCommitted={totalCommitted}
        investorCount={investorCount}
        milestonesVerified={milestonesVerified}
      />

      <div className="mx-auto w-full max-w-[90%] py-12 lg:max-w-[80%]">
        {featured.isLoading ? (
          <SkeletonCard />
        ) : featured.isError ? (
          <EmptyState
            message="Something went wrong"
            actionLabel="Try Again"
            onAction={() => featured.refetch()}
          />
        ) : featured.data?.projects?.length ? (
          <FeaturedCarousel projects={featured.data.projects} />
        ) : null}
      </div>

      <HowItWorks />

      <WhyOpenLaunch />

      <SuccessStories />

      <BottomCTA />
    </div>
  )
}
