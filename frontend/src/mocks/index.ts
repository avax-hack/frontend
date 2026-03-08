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

// Add more mock handlers as features are built
