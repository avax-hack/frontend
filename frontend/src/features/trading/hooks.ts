'use client'

import { useQuery } from '@tanstack/react-query'
import { tradingKeys } from './query-keys'
import { getTokenList, getTokenDetail, getChartData, getSwapHistory, getTokenHolders, getTrendingTokens } from './services'
import type { SortType, ChartResolution } from './types'

export function useTokenList(
  sortType?: SortType,
  params?: { page?: number; limit?: number; category?: string; search?: string; is_ido?: boolean },
) {
  return useQuery({
    queryKey: tradingKeys.list(sortType ?? 'creation_time_desc', params),
    queryFn: () => getTokenList(sortType ?? 'creation_time_desc', params),
  })
}

export function useTrendingTokens() {
  return useQuery({
    queryKey: tradingKeys.trend(),
    queryFn: getTrendingTokens,
    staleTime: 30_000,
  })
}

export function useTokenDetail(tokenId: string) {
  return useQuery({
    queryKey: tradingKeys.detail(tokenId),
    queryFn: () => getTokenDetail(tokenId),
    enabled: !!tokenId,
  })
}

export function useChartData(tokenId: string, resolution: ChartResolution = '1m') {
  return useQuery({
    queryKey: tradingKeys.chart(tokenId, resolution),
    queryFn: () =>
      getChartData(tokenId, {
        resolution,
        from: 0,
        to: 9999999999,
        countback: 300,
      }),
    enabled: !!tokenId,
  })
}

export function useSwapHistory(
  tokenId: string,
  params?: { page?: number; limit?: number; trade_type?: string },
) {
  return useQuery({
    queryKey: tradingKeys.swapHistory(tokenId, params),
    queryFn: () => getSwapHistory(tokenId, params),
    enabled: !!tokenId,
  })
}

export function useTokenHolders(
  tokenId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: tradingKeys.holders(tokenId, params),
    queryFn: () => getTokenHolders(tokenId, params),
    enabled: !!tokenId,
  })
}
