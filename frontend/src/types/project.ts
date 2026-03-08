import { IMilestone } from './milestone';

export type ProjectStatus =
  | 'draft'
  | 'active'
  | 'funded'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface IProject {
  id: string;
  name: string;
  ticker: string;
  tagline: string;
  description: string;
  logo: string;
  status: ProjectStatus;
  target_raise: number;
  total_committed: number;
  milestones: IMilestone[];
  creator_address?: string;
  token_address?: string;
  created_at?: string;
  updated_at?: string;
}
