import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/common/ProjectCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { IProjectListItem } from '@/types/project'

interface ActiveProjectsGridProps {
  projects: IProjectListItem[]
}

export function ActiveProjectsGrid({ projects }: ActiveProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        message="No active projects yet"
        description="Be the first to launch on OpenLaunch"
        actionLabel="Launch a Project"
        actionHref="/launch"
      />
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Active Projects</h2>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
            Live Now
          </span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/explore">View All Projects →</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.project_info.project_id} project={project} />
        ))}
      </div>
    </section>
  )
}
