export type MilestoneStatus = 'completed' | 'in_verification' | 'submitted' | 'pending' | 'failed'

export interface IMilestoneInfo {
  milestone_id: string
  order: number
  title: string
  description: string
  fund_allocation_percent: number
  fund_release_amount: string
  status: MilestoneStatus
  funds_released: boolean
  evidence_uri: string | null
  submitted_at: number | null
  verified_at: number | null
}
