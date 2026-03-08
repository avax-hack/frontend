import { httpGet } from '@/lib/api'
import type {
  IPortfolioSummaryData,
  IAccountHoldTokenData,
  IAccountIDOHistoryData,
  IAccountSwapHistoryData,
  IAccountRefundHistoryData,
} from './types'

// All profile endpoints are PUBLIC — they use accountId in path, no auth cookie needed

export function getPortfolioSummary(accountId: string): Promise<IPortfolioSummaryData> {
  return httpGet<IPortfolioSummaryData>(`/profile/portfolio/${accountId}`)
}

export function getHoldTokens(
  accountId: string,
  params?: { page?: number; limit?: number },
): Promise<IAccountHoldTokenData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<IAccountHoldTokenData>(
    `/profile/hold-token/${accountId}${query ? `?${query}` : ''}`,
  )
}

export function getIdoHistory(
  accountId: string,
  params?: { page?: number; limit?: number },
): Promise<IAccountIDOHistoryData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<IAccountIDOHistoryData>(
    `/profile/ido-history/${accountId}${query ? `?${query}` : ''}`,
  )
}

export function getSwapHistory(
  accountId: string,
  params?: { page?: number; limit?: number },
): Promise<IAccountSwapHistoryData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<IAccountSwapHistoryData>(
    `/profile/swap-history/${accountId}${query ? `?${query}` : ''}`,
  )
}

export function getRefundHistory(
  accountId: string,
  params?: { page?: number; limit?: number },
): Promise<IAccountRefundHistoryData> {
  const searchParams = new URLSearchParams()
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return httpGet<IAccountRefundHistoryData>(
    `/profile/refund-history/${accountId}${query ? `?${query}` : ''}`,
  )
}
