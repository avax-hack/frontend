import type { IProjectInfo, IProjectMarketInfo } from '@/types/project'
import type { IMilestoneInfo } from '@/types/milestone'

const mockCreator = {
  account_id: '0xA9cc000000000000000000000000000000007777',
  nickname: 'DemoBuilder',
  bio: 'Building the future',
  image_uri: '',
}

export const mockProjects: { project_info: IProjectInfo; market_info: IProjectMarketInfo; milestones: IMilestoneInfo[] }[] = [
  {
    project_info: {
      project_id: '0x1234000000000000000000000000000000005678',
      name: 'NovaDex',
      symbol: 'NOVD',
      image_uri: '',
      description: '## About NovaDex\n\nDecentralized trading platform of the future.',
      tagline: 'Decentralized trading platform of the future.',
      category: 'defi',
      creator: mockCreator,
      website: 'https://nova-dex.io',
      twitter: 'https://x.com/NovaDex',
      github: 'https://github.com/NovaDexLabs',
      telegram: 'https://t.me/novadex',
      created_at: 1714521600,
    },
    market_info: {
      project_id: '0x1234000000000000000000000000000000005678',
      status: 'funding',
      target_raise: '500000000000000000000000',
      total_committed: '312450000000000000000000',
      funded_percent: 62,
      investor_count: 1247,
    },
    milestones: [
      { milestone_id: 'ms_001', order: 1, title: 'MVP Launch', description: 'Ship MVP to testnet', fund_allocation_percent: 25, fund_release_amount: '125000000000000000000000', status: 'completed', funds_released: true, evidence_uri: null, submitted_at: 1717232400, verified_at: 1717248600 },
      { milestone_id: 'ms_002', order: 2, title: 'Beta Release', description: 'Public beta', fund_allocation_percent: 25, fund_release_amount: '125000000000000000000000', status: 'in_verification', funds_released: false, evidence_uri: null, submitted_at: 1721030400, verified_at: null },
      { milestone_id: 'ms_003', order: 3, title: 'Mainnet Deploy', description: 'Deploy to C-Chain', fund_allocation_percent: 25, fund_release_amount: '125000000000000000000000', status: 'pending', funds_released: false, evidence_uri: null, submitted_at: null, verified_at: null },
      { milestone_id: 'ms_004', order: 4, title: '1000 Users', description: 'Achieve 1000 active users', fund_allocation_percent: 25, fund_release_amount: '125000000000000000000000', status: 'pending', funds_released: false, evidence_uri: null, submitted_at: null, verified_at: null },
    ],
  },
  {
    project_info: {
      project_id: '0xabcd000000000000000000000000000000ef0001',
      name: 'AvaLend',
      symbol: 'ALND',
      image_uri: '',
      description: 'Decentralized lending protocol on Avalanche.',
      tagline: 'Lend and borrow with milestone protection.',
      category: 'defi',
      creator: { ...mockCreator, nickname: 'AvaTeam' },
      website: null, twitter: null, github: null, telegram: null,
      created_at: 1715000000,
    },
    market_info: {
      project_id: '0xabcd000000000000000000000000000000ef0001',
      status: 'funding',
      target_raise: '200000000000000000000000',
      total_committed: '160000000000000000000000',
      funded_percent: 80,
      investor_count: 523,
    },
    milestones: [
      { milestone_id: 'ms_101', order: 1, title: 'Protocol Design', description: 'Finalize protocol spec', fund_allocation_percent: 30, fund_release_amount: '60000000000000000000000', status: 'completed', funds_released: true, evidence_uri: null, submitted_at: 1716000000, verified_at: 1716100000 },
      { milestone_id: 'ms_102', order: 2, title: 'Smart Contracts', description: 'Deploy and audit', fund_allocation_percent: 40, fund_release_amount: '80000000000000000000000', status: 'pending', funds_released: false, evidence_uri: null, submitted_at: null, verified_at: null },
      { milestone_id: 'ms_103', order: 3, title: 'Launch', description: 'Mainnet launch', fund_allocation_percent: 30, fund_release_amount: '60000000000000000000000', status: 'pending', funds_released: false, evidence_uri: null, submitted_at: null, verified_at: null },
    ],
  },
]
