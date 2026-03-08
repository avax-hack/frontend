import type { IProjectInfo, IProjectMarketInfo } from '@/types/project'
import type { IMilestoneInfo } from '@/types/milestone'

const mockCreator = {
  account_id: '0xA9cc000000000000000000000000000000007777',
  nickname: 'G0X',
  bio: 'Core developers building decentralized infrastructure on Avalanche. Our team brings experience from top DeFi protocols and traditional finance.',
  image_uri: '',
}

export const mockProjects: { project_info: IProjectInfo; market_info: IProjectMarketInfo; milestones: IMilestoneInfo[] }[] = [
  {
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
      description: `## About AvaLend

AvaLend is a decentralized lending protocol on Avalanche offering milestone-protected liquidity pools.

### How it Works

1. Lenders deposit AVAX or stablecoins into verified pools
2. Borrowers access capital at competitive rates
3. Protocol fees are distributed to ALND holders

### Security First

All smart contracts undergo multiple audits. Funds are milestone-locked, ensuring the team delivers before accessing capital.`,
      tagline: 'Lend and borrow with milestone protection.',
      category: 'defi',
      creator: { ...mockCreator, nickname: 'AvaTeam', bio: 'DeFi builders focused on secure lending infrastructure.' },
      website: 'https://avalend.fi',
      twitter: 'https://x.com/AvaLend',
      github: null,
      telegram: 'https://t.me/avalend',
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
  {
    project_info: {
      project_id: '0x9999000000000000000000000000000000000001',
      name: 'SubnetAI',
      symbol: 'SAI',
      image_uri: '',
      description: `## SubnetAI — Decentralized AI Inference

SubnetAI brings GPU compute to Avalanche subnets, enabling on-chain AI model inference at scale.

### Vision

Run machine learning models on a decentralized network of GPU providers, verified through Avalanche consensus.`,
      tagline: 'AI inference on Avalanche subnets.',
      category: 'ai',
      creator: { ...mockCreator, nickname: 'SubnetLabs', bio: 'AI + blockchain researchers from Stanford and MIT.' },
      website: 'https://subnetai.xyz',
      twitter: 'https://x.com/SubnetAI',
      github: 'https://github.com/SubnetAI',
      telegram: null,
      created_at: 1716000000,
    },
    market_info: {
      project_id: '0x9999000000000000000000000000000000000001',
      status: 'completed',
      target_raise: '1000000000000000000000000',
      total_committed: '1000000000000000000000000',
      funded_percent: 100,
      investor_count: 3412,
    },
    milestones: [
      { milestone_id: 'ms_201', order: 1, title: 'Prototype', description: 'GPU subnet prototype', fund_allocation_percent: 20, fund_release_amount: '200000000000000000000000', status: 'completed', funds_released: true, evidence_uri: null, submitted_at: 1717000000, verified_at: 1717100000 },
      { milestone_id: 'ms_202', order: 2, title: 'Testnet', description: 'Public testnet launch', fund_allocation_percent: 30, fund_release_amount: '300000000000000000000000', status: 'completed', funds_released: true, evidence_uri: null, submitted_at: 1718000000, verified_at: 1718100000 },
      { milestone_id: 'ms_203', order: 3, title: 'Mainnet', description: 'Production deployment', fund_allocation_percent: 30, fund_release_amount: '300000000000000000000000', status: 'completed', funds_released: true, evidence_uri: null, submitted_at: 1719000000, verified_at: 1719100000 },
      { milestone_id: 'ms_204', order: 4, title: 'Ecosystem', description: '100 model providers', fund_allocation_percent: 20, fund_release_amount: '200000000000000000000000', status: 'in_verification', funds_released: false, evidence_uri: null, submitted_at: 1720000000, verified_at: null },
    ],
  },
  {
    project_info: {
      project_id: '0xdead000000000000000000000000000000000001',
      name: 'FailedDAO',
      symbol: 'FDAO',
      image_uri: '',
      description: `## FailedDAO

A governance experiment that did not reach its milestones. This project has been marked as failed and investors can claim refunds.`,
      tagline: 'Governance experiment — failed.',
      category: 'defi',
      creator: { ...mockCreator, nickname: 'AnonymousDAO', bio: 'Experimental governance builders.' },
      website: null,
      twitter: null,
      github: null,
      telegram: null,
      created_at: 1713000000,
    },
    market_info: {
      project_id: '0xdead000000000000000000000000000000000001',
      status: 'failed',
      target_raise: '300000000000000000000000',
      total_committed: '150000000000000000000000',
      funded_percent: 50,
      investor_count: 89,
    },
    milestones: [
      { milestone_id: 'ms_f01', order: 1, title: 'MVP', description: 'Build initial DAO tooling', fund_allocation_percent: 50, fund_release_amount: '150000000000000000000000', status: 'failed', funds_released: false, evidence_uri: null, submitted_at: 1714000000, verified_at: null },
      { milestone_id: 'ms_f02', order: 2, title: 'Launch', description: 'Public launch', fund_allocation_percent: 50, fund_release_amount: '150000000000000000000000', status: 'pending', funds_released: false, evidence_uri: null, submitted_at: null, verified_at: null },
    ],
  },
]
