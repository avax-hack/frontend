import { httpGet, ApiError } from '@/lib/api'
import type {
  ITokenData,
  ITokenListData,
  ITrendingData,
  ITradingChartData,
  ITokenSwapHistoryData,
  ITokenHolderListData,
  SortType,
  ChartResolution,
} from './types'

export function getTokenList(
  sortType: SortType = 'creation_time_desc',
  params?: { page?: number; limit?: number; category?: string; search?: string; is_ido?: boolean },
): Promise<ITokenListData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  if (params?.category && params.category !== 'all') searchParams.set('category', params.category)
  if (params?.search) searchParams.set('search', params.search)
  if (params?.is_ido !== undefined) searchParams.set('is_ido', String(params.is_ido))
  const query = searchParams.toString()
  return httpGet<ITokenListData>(`/order/${sortType}${query ? `?${query}` : ''}`)
}

export function getTrendingTokens(): Promise<ITrendingData> {
  return httpGet<ITrendingData>('/trend')
}

export async function getTokenDetail(tokenId: string): Promise<ITokenData | null> {
  try {
    return await httpGet<ITokenData>(`/token/${tokenId}`)
  } catch (e) {
    if (e instanceof ApiError && e.isNotFound) return null
    throw e
  }
}

export function getChartData(
  tokenAddress: string,
  params: {
    resolution: ChartResolution
    from: number
    to: number
    countback?: number
  },
): Promise<ITradingChartData> {
  const searchParams = new URLSearchParams()
  searchParams.set('resolution', params.resolution)
  searchParams.set('from', String(params.from))
  searchParams.set('to', String(params.to))
  if (params.countback !== undefined) searchParams.set('countback', String(params.countback))
  return httpGet<ITradingChartData>(
    `/trade/chart/${tokenAddress}?${searchParams.toString()}`,
  )
}

export function getSwapHistory(
  tokenId: string,
  params?: { page?: number; limit?: number; direction?: string; trade_type?: string },
): Promise<ITokenSwapHistoryData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  if (params?.direction) searchParams.set('direction', params.direction)
  if (params?.trade_type) searchParams.set('trade_type', params.trade_type)
  const query = searchParams.toString()
  return httpGet<ITokenSwapHistoryData>(
    `/trade/swap-history/${tokenId}${query ? `?${query}` : ''}`,
  )
}

export function getTokenHolders(
  tokenId: string,
  params?: { page?: number; limit?: number },
): Promise<ITokenHolderListData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<ITokenHolderListData>(
    `/trade/holder/${tokenId}${query ? `?${query}` : ''}`,
  )
}
