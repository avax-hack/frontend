import type { ITokenInfo, IMarketInfo } from '@/types/token'
import type { IProjectInfo, IProjectMarketInfo } from '@/types/project'

// GET /profile/portfolio/:accountId
export interface IPortfolioSummaryData {
  portfolio_value: string
  total_invested_ido: string
  trading_pnl: string
  trading_pnl_percent: number
  active_idos: number
  refunds_received: string
}

// GET /profile/hold-token/:accountId → items in .tokens[]
export interface IHoldTokenItem {
  token_info: ITokenInfo
  market_info: IMarketInfo
  balance_info: {
    balance: string
    token_price: string
    native_price: string
    created_at: number
  }
  origin: 'ido' | 'market'
  milestone_progress: {
    completed: number
    total: number
  }
}

export interface IAccountHoldTokenData {
  tokens: IHoldTokenItem[]
  total_count: number
}

// GET /profile/ido-history/:accountId → items in .participations[]
export interface IIdoParticipation {
  project_info: IProjectInfo
  market_info: IProjectMarketInfo
  invested_amount: string
  tokens_received: string
  status: string
  milestone_progress: {
    completed: number
    total: number
  }
  created_at: number
}

export interface IAccountIDOHistoryData {
  participations: IIdoParticipation[]
  total_count: number
}

// GET /profile/swap-history/:accountId → items in .swaps[]
export interface IAccountSwapRecord {
  event_type: 'BUY' | 'SELL'
  token_info: ITokenInfo
  native_amount: string
  token_amount: string
  native_price: string
  transaction_hash: string
  value: string
  created_at: number
}

export interface IAccountSwapHistoryData {
  swaps: IAccountSwapRecord[]
  total_count: number
}

// GET /profile/refund-history/:accountId → items in .refunds[]
export interface IRefundRecord {
  project_info: IProjectInfo
  original_investment: string
  refund_amount: string
  failed_milestone: string
  transaction_hash: string
  created_at: number
}

export interface IAccountRefundHistoryData {
  refunds: IRefundRecord[]
  total_count: number
}

// Activity tab filter type
export type ActivityTab = 'all' | 'ido' | 'trades' | 'refunds'
