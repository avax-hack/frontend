import { registerMock } from '@/lib/mock'
import { ApiError } from '@/lib/api'
import type { IAccountInfo } from '@/types/common'
import { mockProjects } from './data/projects'
import { mockProjectDetail } from './project-detail'
import { mockTradingTokens, generateMockChartBars, mockSwapHistory } from './trading'

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
  const project = mockProjects.find(p => p.project_info.project_id === id)
  if (project) return project
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

// --- Token / Trading ---
registerMock('/trend', () => ({
  tokens: mockTradingTokens,
}))

registerMock('/order/:sortType', (path) => {
  const [pathPart, queryString] = path.split('?')
  const sortType = pathPart.split('/').pop() ?? ''
  const params = new URLSearchParams(queryString ?? '')
  const category = params.get('category')
  const search = params.get('search')

  let tokens = [...mockTradingTokens]

  if (category && category !== 'all') {
    tokens = tokens.filter(t => t.token_info.category === category)
  }
  if (search) {
    const q = search.toLowerCase()
    tokens = tokens.filter(
      t =>
        t.token_info.name.toLowerCase().includes(q) ||
        t.token_info.symbol.toLowerCase().includes(q),
    )
  }

  // Apply sort
  switch (sortType) {
    case 'mcap':
      tokens.sort((a, b) => {
        const mcapA = (Number(a.market_info.total_supply) / 1e18) * Number(a.market_info.token_price)
        const mcapB = (Number(b.market_info.total_supply) / 1e18) * Number(b.market_info.token_price)
        return mcapB - mcapA
      })
      break
    case 'trending':
      tokens.sort((a, b) => Number(b.market_info.volume) - Number(a.market_info.volume))
      break
    case 'most_funded':
      tokens.sort((a, b) => b.market_info.bonding_percent - a.market_info.bonding_percent)
      break
    case 'creation_time_desc':
    default:
      tokens.sort((a, b) => b.token_info.created_at - a.token_info.created_at)
      break
  }

  return { tokens, total_count: tokens.length }
})

registerMock('/token/:tokenId', (path) => {
  const [pathPart] = path.split('?')
  const id = pathPart.split('/').pop()
  const token = mockTradingTokens.find(t => t.token_info.token_id === id)
  if (!token) throw new ApiError(404, 'Token not found')
  return token
})

registerMock('/trade/chart/:tokenAddress', () => {
  return generateMockChartBars()
})

registerMock('/trade/swap-history/:tokenId', () => {
  return mockSwapHistory
})

// --- Auth ---

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
