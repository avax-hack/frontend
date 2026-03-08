import { httpPost } from '@/lib/api'

const TAKEN_TICKERS = new Set(['AVAX', 'ETH'])

/** Mock ticker availability check. Rejects "AVAX" and "ETH". */
export async function checkTickerAvailability(
  ticker: string
): Promise<{ available: boolean }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300))
  return { available: !TAKEN_TICKERS.has(ticker.toUpperCase()) }
}

// --- Project Creation ---

export interface CreateProjectPayload {
  name: string
  symbol: string
  tagline: string
  description: string
  image_uri: string
  website: string | null
  twitter: string | null
  github: string | null
  target_raise: string // wei string
  token_supply: string // wei string
  milestones: {
    order: number
    title: string
    description: string
    fund_allocation_percent: number
  }[]
}

export interface CreateProjectResponse {
  project_id: string
  transaction_hash: string
}

export function createProject(
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> {
  return httpPost<CreateProjectResponse>('/project/create', {
    body: payload,
    auth: 'cookie',
  })
}
