import type { IProjectData } from '@/types/project'

/**
 * Detailed mock project for project detail page testing.
 * Includes all project_info fields, realistic market_info,
 * 4 milestones (2 completed, 1 in_verification, 1 pending).
 */
export const mockProjectDetail: IProjectData = {
  project_info: {
    project_id: '0x1234000000000000000000000000000000005678',
    name: 'NovaDex',
    symbol: 'NOVD',
    image_uri: '',
    description: `## About NovaDex

NovaDex is the next-generation decentralized exchange built natively on Avalanche C-Chain. Designed for speed, security, and composability.

### Key Features

- **Sub-second finality** — leveraging Avalanche's consensus for near-instant swaps
- **Concentrated liquidity** — capital-efficient AMM with customizable price ranges
- **Milestone-protected funding** — investor funds released only after verified milestones
- **Cross-subnet routing** — future-ready for Avalanche's multi-chain architecture

### Tokenomics

The NOVD token powers governance and fee sharing across the protocol. 60% allocated to community, 20% to team (4-year vest), 20% to ecosystem growth.

### Roadmap

Our 4-milestone plan ensures accountability at every stage. Each milestone must pass UMA oracle verification before funds are released to the team.`,
    tagline: 'Decentralized trading platform of the future.',
    category: 'defi',
    creator: {
      account_id: '0xA9cc000000000000000000000000000000007777',
      nickname: 'G0X',
      bio: 'Core developers building decentralized infrastructure on Avalanche. Our team brings experience from top DeFi protocols and traditional finance.',
      image_uri: '',
    },
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
    {
      milestone_id: 'ms_001',
      order: 1,
      title: 'MVP Launch',
      description: 'Ship minimum viable product to testnet with core swap functionality.',
      fund_allocation_percent: 25,
      fund_release_amount: '125000000000000000000000',
      status: 'completed',
      funds_released: true,
      evidence_uri: 'https://storage.example.com/evidence_ms1.pdf',
      submitted_at: 1717232400,
      verified_at: 1717248600,
    },
    {
      milestone_id: 'ms_002',
      order: 2,
      title: 'Beta Release',
      description: 'Public beta with user onboarding flow and liquidity pools.',
      fund_allocation_percent: 25,
      fund_release_amount: '125000000000000000000000',
      status: 'completed',
      funds_released: true,
      evidence_uri: 'https://storage.example.com/evidence_ms2.pdf',
      submitted_at: 1719000000,
      verified_at: 1719100000,
    },
    {
      milestone_id: 'ms_003',
      order: 3,
      title: 'Mainnet Deploy',
      description: 'Deploy audited smart contracts to Avalanche C-Chain mainnet.',
      fund_allocation_percent: 25,
      fund_release_amount: '125000000000000000000000',
      status: 'in_verification',
      funds_released: false,
      evidence_uri: 'https://storage.example.com/evidence_ms3.pdf',
      submitted_at: 1721030400,
      verified_at: null,
    },
    {
      milestone_id: 'ms_004',
      order: 4,
      title: '1000 Users',
      description: 'Achieve 1,000 active users on the platform within 3 months of mainnet.',
      fund_allocation_percent: 25,
      fund_release_amount: '125000000000000000000000',
      status: 'pending',
      funds_released: false,
      evidence_uri: null,
      submitted_at: null,
      verified_at: null,
    },
  ],
}
