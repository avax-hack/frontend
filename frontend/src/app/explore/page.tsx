'use client'

import { useProjectList } from '@/features/project/hooks'
import { ProjectCard } from '@/components/common/ProjectCard'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'

export default function ExplorePage() {
  const { data, isLoading } = useProjectList('recent')
  const projects = data?.projects ?? []

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <p className="text-muted-foreground">
          Discover milestone-verified projects on Avalanche
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          message="No projects found"
          description="Be the first to launch on OpenLaunch"
          actionLabel="Launch a Project"
          actionHref="/launch"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.project_info.project_id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
