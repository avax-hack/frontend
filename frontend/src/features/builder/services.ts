import { httpGet, httpPost, ApiError } from '@/lib/api'
import type {
  IAccountCreatedTokenData,
  IBuilderOverviewData,
  IBuilderStatsData,
  IMilestoneSubmitResponse,
  IMilestoneVerificationData,
  IEvidenceUploadResponse,
} from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

// Public endpoint — no auth
export function getCreatedProjects(
  accountId: string,
  params?: { page?: number; limit?: number },
): Promise<IAccountCreatedTokenData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<IAccountCreatedTokenData>(
    `/profile/tokens/created/${accountId}${query ? `?${query}` : ''}`,
  )
}

// Auth required (cookie session)
export function getBuilderOverview(projectId: string): Promise<IBuilderOverviewData> {
  return httpGet<IBuilderOverviewData>(`/builder/overview/${projectId}`, {
    auth: 'cookie',
  })
}

// Auth required (cookie session)
export function getBuilderStats(projectId: string): Promise<IBuilderStatsData> {
  return httpGet<IBuilderStatsData>(`/builder/stats/${projectId}`, {
    auth: 'cookie',
  })
}

// Auth required (cookie session), JSON body
export function submitMilestone(
  milestoneId: string,
  body: { evidence_text: string; evidence_uri?: string | null },
): Promise<IMilestoneSubmitResponse> {
  return httpPost<IMilestoneSubmitResponse>(`/milestone/submit/${milestoneId}`, {
    body,
    auth: 'cookie',
  })
}

// Public endpoint
export function getVerificationStatus(
  milestoneId: string,
): Promise<IMilestoneVerificationData> {
  return httpGet<IMilestoneVerificationData>(`/milestone/verification/${milestoneId}`)
}

// Auth required, multipart/form-data — bypasses baseFetch
export async function uploadEvidence(file: File): Promise<IEvidenceUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/metadata/evidence`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    // Do NOT set Content-Type — browser sets multipart boundary automatically
  })

  if (!res.ok) {
    let serverMessage: string | undefined
    try {
      const errorBody = await res.json()
      serverMessage = errorBody.message ?? errorBody.error
    } catch {
      // not JSON
    }
    throw new ApiError(res.status, serverMessage)
  }

  return res.json() as Promise<IEvidenceUploadResponse>
}
