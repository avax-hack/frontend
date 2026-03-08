export type MilestoneStatus = 'pending' | 'in_verification' | 'completed' | 'failed';

export interface IMilestone {
  id: string;
  title: string;
  description: string;
  allocation_percent: number;
  status: MilestoneStatus;
  deadline?: string;
  proof_url?: string;
  created_at?: string;
  updated_at?: string;
}
