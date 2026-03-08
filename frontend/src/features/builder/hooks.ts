'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { builderKeys } from './query-keys'
import {
  getCreatedProjects,
  getBuilderOverview,
  getBuilderStats,
  submitMilestone,
  getVerificationStatus,
  uploadEvidence,
} from './services'
import { ApiError } from '@/lib/api'

const TERMINAL_VERIFICATION_STATUSES = new Set(['verified', 'rejected'])

export function useCreatedProjects(
  accountId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: builderKeys.createdProjects(accountId ?? ''),
    queryFn: () => getCreatedProjects(accountId!, params),
    enabled: !!accountId,
  })
}

export function useBuilderOverview(projectId: string | undefined) {
  return useQuery({
    queryKey: builderKeys.overview(projectId ?? ''),
    queryFn: () => getBuilderOverview(projectId!),
    enabled: !!projectId,
  })
}

export function useBuilderStats(projectId: string | undefined) {
  return useQuery({
    queryKey: builderKeys.stats(projectId ?? ''),
    queryFn: () => getBuilderStats(projectId!),
    enabled: !!projectId,
  })
}

export function useVerificationStatus(
  milestoneId: string | undefined,
  shouldPoll: boolean = false,
) {
  return useQuery({
    queryKey: builderKeys.verification(milestoneId ?? ''),
    queryFn: () => getVerificationStatus(milestoneId!),
    enabled: !!milestoneId,
    refetchInterval: (query) => {
      if (!shouldPoll) return false
      const status = query.state.data?.status
      if (status && TERMINAL_VERIFICATION_STATUSES.has(status)) return false
      return 30000
    },
  })
}

export function useSubmitMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      milestoneId,
      evidenceText,
      file,
    }: {
      milestoneId: string
      evidenceText: string
      file?: File
    }) => {
      // Step 1: Upload evidence file if provided
      let evidenceUri: string | undefined
      if (file) {
        const uploadResult = await uploadEvidence(file)
        evidenceUri = uploadResult.evidence_uri
      }
      // Step 2: Submit milestone with evidence
      return submitMilestone(milestoneId, {
        evidence_text: evidenceText,
        evidence_uri: evidenceUri ?? null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: builderKeys.all })
      toast.success('Milestone submitted for verification')
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.isUnauthorized) {
          toast.error('Session expired', { description: 'Please re-authenticate.' })
        } else {
          toast.error('Submission failed', {
            description: error.serverMessage ?? 'Please try again.',
          })
        }
      } else {
        toast.error('Something went wrong')
      }
    },
  })
}
