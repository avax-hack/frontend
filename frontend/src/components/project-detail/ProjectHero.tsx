import { StatusBadge } from '@/components/common/StatusBadge'
import type { IProjectData, ProjectStatus } from '@/types/project'

const STATUS_BADGE_MAP: Record<ProjectStatus, { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue' }> = {
  funding: { label: 'Funding', variant: 'blue' },
  active: { label: 'Active', variant: 'green' },
  completed: { label: 'Completed', variant: 'purple' },
  failed: { label: 'Failed', variant: 'red' },
}

interface ProjectHeroProps {
  project: IProjectData
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { project_info, market_info } = project
  const statusBadge = STATUS_BADGE_MAP[market_info.status]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {/* Logo placeholder */}
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-2xl font-bold text-primary"
          aria-hidden="true"
        >
          {project_info.image_uri ? (
            <img
              src={project_info.image_uri}
              alt=""
              className="size-16 rounded-xl object-cover"
            />
          ) : (
            project_info.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">
              {project_info.name}{' '}
              <span className="text-lg font-normal text-muted-foreground">
                ({project_info.symbol})
              </span>
            </h1>
          </div>

          <p className="text-sm leading-[1.2] text-muted-foreground">
            {project_info.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={statusBadge.label} variant={statusBadge.variant} />
            <StatusBadge label="❄️ Avalanche C-Chain" variant="purple" size="sm" />
          </div>
        </div>
      </div>
    </section>
  )
}
