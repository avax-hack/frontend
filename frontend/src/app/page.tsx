'use client'

import { useFeaturedProjects, useProjectList } from '@/features/project/hooks'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedCarousel } from '@/components/landing/FeaturedCarousel'
import { ActiveProjectsGrid } from '@/components/landing/ActiveProjectsGrid'
import { SkeletonCard } from '@/components/common/SkeletonCard'

export default function HomePage() {
  const featured = useFeaturedProjects()
  const projectList = useProjectList('recent')

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 md:px-6">
      <HeroSection />

      {featured.isLoading ? (
        <SkeletonCard />
      ) : featured.data?.projects?.length ? (
        <FeaturedCarousel projects={featured.data.projects} />
      ) : null}

      {projectList.isLoading ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Active Projects</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      ) : (
        <ActiveProjectsGrid
          projects={(projectList.data?.projects ?? []).slice(0, 6)}
        />
      )}
    </div>
  )
}
