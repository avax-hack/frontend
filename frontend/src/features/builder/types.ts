import type { IProjectInfo, IProjectMarketInfo } from '@/types/project'

// GET /profile/tokens/created/:accountId — item shape
export interface ICreatedProjectItem {
  project_id: string
  name: string
  symbol: string
  image_uri: string
  status: string
  created_at: number
}

export interface IAccountCreatedTokenData {
  data: ICreatedProjectItem[]
  total_count: number
}

// GET /builder/overview/:projectId
export interface IBuilderOverviewData {
  project_info: IProjectInfo
  market_info: IProjectMarketInfo
  current_milestone: {
    order: number
    title: string
    status: string
  }
  total_milestones: number
}

// GET /builder/stats/:projectId
export interface IBuilderStatsData {
  funding_over_time: {
    date: number
    cumulative: string
  }[]
  investors_over_time: {
    date: number
    count: number
  }[]
}

// POST /milestone/submit/:milestoneId response
export interface IMilestoneSubmitResponse {
  transaction_hash: string
  oracle_request_id: string
  status: string
}

// GET /milestone/verification/:milestoneId
export interface IMilestoneVerificationData {
  milestone_id: string
  status: 'pending' | 'verified' | 'rejected' | 'disputed'
  submitted_at: number
  estimated_completion: number | null
  dispute_info: unknown | null
}

// POST /metadata/evidence response
export interface IEvidenceUploadResponse {
  evidence_uri: string
  size: number
}
