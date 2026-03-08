import type { IAccountInfo } from './common'
import type { IMilestoneInfo } from './milestone'

export type ProjectStatus = 'funding' | 'active' | 'completed' | 'failed'
export type ProjectCategory = 'defi' | 'infra' | 'ai' | 'gaming' | 'social' | 'meme'

export interface IProjectInfo {
  project_id: string
  name: string
  symbol: string
  image_uri: string
  description: string | null
  tagline: string
  category: ProjectCategory
  creator: IAccountInfo
  website: string | null
  twitter: string | null
  github: string | null
  telegram: string | null
  created_at: number
}

export interface IProjectMarketInfo {
  project_id: string
  status: ProjectStatus
  target_raise: string
  total_committed: string
  funded_percent: number
  investor_count: number
}

export interface IProjectData {
  project_info: IProjectInfo
  market_info: IProjectMarketInfo
  milestones: IMilestoneInfo[]
}

export interface IProjectListItem {
  project_info: IProjectInfo
  market_info: IProjectMarketInfo
  milestone_completed: number
  milestone_total: number
}

export interface IProjectListData {
  projects: IProjectListItem[]
  total_count: number
}

export interface IProjectFeaturedData {
  projects: IProjectListItem[]
}
