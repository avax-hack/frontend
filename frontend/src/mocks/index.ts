import { registerMock } from '@/lib/mock'
import { mockProjects } from './data/projects'
import { mockTokens } from './data/tokens'
import { mockProjectDetail } from './project-detail'

// --- Project ---
registerMock('/project/featured', () => ({
  projects: mockProjects.slice(0, 3).map(p => ({
    project_info: p.project_info,
    market_info: p.market_info,
    milestone_completed: p.milestones.filter(m => m.status === 'completed').length,
    milestone_total: p.milestones.length,
  })),
}))

registerMock('/order/project/:sortType', () => ({
  projects: mockProjects.map(p => ({
    project_info: p.project_info,
    market_info: p.market_info,
    milestone_completed: p.milestones.filter(m => m.status === 'completed').length,
    milestone_total: p.milestones.length,
  })),
  total_count: mockProjects.length,
}))

registerMock('/project/:projectId', (path) => {
  const id = path.split('/').pop()
  // Try to find in mockProjects first, fall back to detailed mock
  const project = mockProjects.find(p => p.project_info.project_id === id)
  if (project) return project
  // Default: return the detailed mock project
  return mockProjectDetail
})

registerMock('/project/create', () => {
  if (!mockSession) {
    throw new ApiError(401, 'Not authenticated')
  }
  return {
    project_id: '0xNEW0000000000000000000000000000000PROJ1',
    transaction_hash: '0xMOCK_TX_HASH_' + Date.now(),
  }
})

// --- Token ---
registerMock('/trend', () => ({
  tokens: mockTokens,
}))

registerMock('/order/:sortType', () => ({
  tokens: mockTokens,
  total_count: mockTokens.length,
}))

registerMock('/token/:tokenId', (path) => {
  const id = path.split('/').pop()
  const token = mockTokens.find(t => t.token_info.token_id === id)
  return token ?? mockTokens[0]
})

// --- Auth ---
import type { IAccountInfo } from '@/types/common'
import { ApiError } from '@/lib/api'

// In-memory session state for mock mode
let mockSession: { account_info: IAccountInfo } | null = null

const mockAccountInfo: IAccountInfo = {
  account_id: '0xA9cc000000000000000000000000000000007777',
  nickname: 'MockUser',
  bio: '',
  image_uri: '',
}

registerMock('/auth/nonce', () => ({
  nonce: 'Sign this message to verify your identity: mock-nonce-' + Date.now(),
}))

registerMock('/auth/session', () => {
  mockSession = { account_info: mockAccountInfo }
  return mockSession
})

registerMock('/auth/delete_session', () => {
  mockSession = null
  return {}
})

registerMock('/account/get_account', () => {
  if (!mockSession) {
    throw new ApiError(401, 'Not authenticated')
  }
  return mockSession.account_info
})

// Add more mock handlers as features are built
