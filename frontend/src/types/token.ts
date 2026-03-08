import type { IAccountInfo } from './common'

export type MarketType = 'CURVE' | 'DEX' | 'IDO'

export interface ITokenInfo {
  token_id: string
  name: string
  symbol: string
  image_uri: string
  banner_uri?: string | null
  description: string | null
  category: string
  is_graduated: boolean
  creator?: IAccountInfo
  website?: string | null
  twitter?: string | null
  telegram?: string | null
  created_at: number
  project_id: string | null
}

export interface IMarketInfo {
  market_type: MarketType
  token_id: string
  token_price: string
  native_price: string
  price: string
  ath_price: string
  total_supply: string
  volume: string
  holder_count: number
  bonding_percent: number
  milestone_completed: number
  milestone_total: number
}

export interface ITokenData {
  token_info: ITokenInfo
  market_info: IMarketInfo
}

export interface ITokenListData {
  data: ITokenData[]
  total_count: number
}
