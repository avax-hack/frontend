'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { useVerificationStatus } from '@/features/builder/hooks'

interface VerificationStatusProps {
  milestoneId: string
}

const TERMINAL_STATUSES = new Set(['verified', 'rejected'])

const statusDisplay: Record<string, { label: string; variant: 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'purple' }> = {
  pending: { label: 'Verification Pending', variant: 'amber' },
  verified: { label: 'Verified — Funds Released', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
  disputed: { label: 'Disputed', variant: 'red' },
}

export function VerificationStatus({ milestoneId }: VerificationStatusProps) {
  const { data, isLoading } = useVerificationStatus(
    milestoneId,
    true, // poll enabled — hook stops on terminal states below
  )
  const prevStatusRef = useRef<string | undefined>(undefined)

  // Toast on verified transition (B-9)
  useEffect(() => {
    if (data?.status === 'verified' && prevStatusRef.current && prevStatusRef.current !== 'verified') {
      toast.success('Milestone Verified!', {
        description: 'Funds have been released.',
      })
    }
    prevStatusRef.current = data?.status
  }, [data?.status])

  if (isLoading) return <Skeleton className="h-6 w-32" />
  if (!data) return null

  const display = statusDisplay[data.status] ?? { label: data.status, variant: 'gray' as const }

  return <StatusBadge label={display.label} variant={display.variant} />
}
