// Re-export existing types
export type { ITokenInfo, IMarketInfo, ITokenData, ITokenListData } from '@/types/token'
export type { IAccountInfo } from '@/types/common'

// Import for local use
import type { IAccountInfo } from '@/types/common'
import type { ITokenData } from '@/types/token'

// Chart data
export interface IChartBar {
  time: number
  open: string
  high: string
  low: string
  close: string
  volume: string
}

export interface ITradingChartData {
  bars: IChartBar[]
}

// Swap history
export interface ISwapRecord {
  event_type: 'BUY' | 'SELL'
  native_amount: string
  token_amount: string
  transaction_hash: string
  value: string
  account_info: IAccountInfo
  created_at: number
}

export interface ITokenSwapHistoryData {
  data: ISwapRecord[]
  total_count: number
}

// Holder data
export interface ITokenHolder {
  account_info: IAccountInfo
  balance: string
}

export interface ITokenHolderListData {
  data: ITokenHolder[]
  total_count: number
}

// Trending
export interface ITrendingData {
  tokens: ITokenData[]
}

// Union types for API params
export type ChartResolution = '1m' | '5m' | '15m' | '1h' | '4h' | '1D'
export type SortType = 'mcap' | 'creation_time_desc' | 'trending' | 'most_funded'
export type TokenCategory = 'all' | 'defi' | 'infra' | 'ai' | 'gaming' | 'social' | 'meme' | 'other'
