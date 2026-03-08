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
    return <EmptyState message="No active projects yet" actionLabel="Launch a Project" actionHref="/launch" />
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Active Projects</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.project_info.project_id} project={project} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/explore">View All Projects</Link>
        </Button>
      </div>
    </section>
  )
}
