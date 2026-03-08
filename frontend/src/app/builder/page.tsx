'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useProfile } from '@/features/auth/hooks'
import { useCreatedProjects, useBuilderOverview } from '@/features/builder/hooks'
import { useProjectDetail } from '@/features/project/hooks'
import { ProjectSelector } from '@/components/builder/ProjectSelector'
import { ProjectOverviewCard } from '@/components/builder/ProjectOverviewCard'
import { MilestoneManagement } from '@/components/builder/MilestoneManagement'
import { SubmitModal } from '@/components/builder/SubmitModal'
import { VerificationStatus } from '@/components/builder/VerificationStatus'
import { EmptyState } from '@/components/common/EmptyState'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WalletIcon, RocketIcon } from 'lucide-react'
import type { IMilestoneInfo } from '@/types/milestone'

export default function BuilderPage() {
  const { isConnected } = useAccount()
  const { account, isAuthenticated, isLoading } = useProfile()
  const accountId = account?.account_id

  if (isConnected && isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <div className="text-muted-foreground" aria-hidden="true">
          <WalletIcon className="size-12" />
        </div>
        <h1 className="text-xl font-bold">Checking session…</h1>
      </div>
    )
  }

  // Auth gate
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <div className="text-muted-foreground" aria-hidden="true">
          <WalletIcon className="size-12" />
        </div>
        <h1 className="text-xl font-bold">Connect Your Wallet</h1>
        <p className="text-sm text-muted-foreground leading-[1.2]">
          Connect and sign in to manage your projects
        </p>
        <ConnectButton />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <div className="text-muted-foreground" aria-hidden="true">
          <WalletIcon className="size-12" />
        </div>
        <h1 className="text-xl font-bold">Sign In Required</h1>
        <p className="text-sm text-muted-foreground leading-[1.2]">
          Please sign in with your wallet to access the builder dashboard
        </p>
        <ConnectButton />
      </div>
    )
  }

  return <BuilderContent accountId={accountId!} />
}

function BuilderContent({ accountId }: { accountId: string }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined)
  const [submitTarget, setSubmitTarget] = useState<IMilestoneInfo | null>(null)

  const { data: createdProjects, isLoading: projectsLoading } = useCreatedProjects(accountId)
  const { data: overview, isLoading: overviewLoading } = useBuilderOverview(selectedProjectId)
  const { data: projectDetail, isLoading: detailLoading } = useProjectDetail(selectedProjectId ?? '')

  const projects = createdProjects?.data

  // Auto-select first project
  useEffect(() => {
    if (
      !selectedProjectId &&
      projects &&
      projects.length > 0
    ) {
      setSelectedProjectId(projects[0].project_id)
    }
  }, [projects, selectedProjectId])

  // No projects state (B-13)
  if (!projectsLoading && (!projects || projects.length === 0)) {
    return (
      <div className="px-4 py-6 mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold">Builder Dashboard</h1>
        <EmptyState
          icon={<RocketIcon />}
          message="No projects yet"
          description="Launch your first project to start building on OpenLaunch"
          actionLabel="Launch a Project"
          actionHref="/launch"
        />
      </div>
    )
  }

  // Find in-verification milestones for polling
  const verificationMilestones = projectDetail?.milestones?.filter(
    (m) => m.status === 'in_verification' || m.status === 'submitted',
  ) ?? []

  return (
    <div className="px-4 py-6 mx-auto max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Builder Dashboard</h1>
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
          isLoading={projectsLoading}
        />
      </div>

      <ProjectOverviewCard data={overview} isLoading={overviewLoading} />

      {/* Verification status badges for active verifications */}
      {verificationMilestones.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Active Verifications</h2>
          <div className="flex flex-wrap gap-2">
            {verificationMilestones.map((m) => (
              <div key={m.milestone_id} className="flex items-center gap-2">
                <span className="text-sm">{m.title}:</span>
                <VerificationStatus milestoneId={m.milestone_id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <MilestoneManagement
        milestones={projectDetail?.milestones}
        isLoading={detailLoading}
        onSubmit={(milestone) => setSubmitTarget(milestone)}
      />

      <SubmitModal
        milestone={submitTarget}
        open={submitTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSubmitTarget(null)
        }}
      />
    </div>
  )
}
