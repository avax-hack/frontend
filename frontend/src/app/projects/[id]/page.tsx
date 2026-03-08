'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, SearchXIcon } from 'lucide-react'
import { useProjectDetail } from '@/features/project/hooks'
import {
  ProjectHero,
  FundingStats,
  FundingProgress,
  MilestoneRoadmap,
  FundAllocationBar,
  ProjectOverview,
  TeamSection,
  InvestPanel,
} from '@/components/project-detail'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

function ProjectDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      {/* Hero skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="size-16 shrink-0 rounded-xl" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="flex flex-col gap-2 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32" />
          </Card>
        ))}
      </div>

      {/* Two-column skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-3 w-48" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="size-8 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectNotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center md:px-6">
      <SearchXIcon className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-2xl font-bold">Project Not Found</h1>
      <p className="text-sm text-muted-foreground">
        The project you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild variant="outline">
        <Link href="/explore">
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Browse Projects
        </Link>
      </Button>
    </div>
  )
}

function ProjectDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center md:px-6">
      <p className="text-sm text-destructive">Something went wrong</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

function ProjectDetailContent({ id }: { id: string }) {
  const { data: project, isLoading, isError, refetch } = useProjectDetail(id)

  if (isLoading) {
    return <ProjectDetailSkeleton />
  }

  if (isError) {
    return <ProjectDetailError onRetry={() => refetch()} />
  }

  if (!project) {
    return <ProjectNotFound />
  }

  return (
    <>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 pb-24 md:px-6">
        {/* Hero — full width */}
        <ProjectHero project={project} />

        {/* Funding stats — full width */}
        <FundingStats project={project} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column — 2/3 */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <FundingProgress project={project} />

            {project.project_info.description && (
              <ProjectOverview description={project.project_info.description} />
            )}

            <TeamSection project={project} />
          </div>

          {/* Right column — 1/3 sidebar */}
          <aside className="flex flex-col gap-8" aria-label="Project milestones and allocation">
            <MilestoneRoadmap milestones={project.milestones} />
            <FundAllocationBar milestones={project.milestones} />
          </aside>
        </div>
      </div>

      {/* Sticky bottom invest panel */}
      <InvestPanel project={project} />
    </>
  )
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = React.use(params)

  return (
    <main>
      <ProjectDetailContent id={id.toLowerCase()} />
    </main>
  )
}
