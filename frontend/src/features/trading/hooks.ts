'use client'

import { useQuery } from '@tanstack/react-query'
import { tradingKeys } from './query-keys'
import { getTokenList, getTokenDetail, getChartData, getSwapHistory, getTokenHolders } from './services'
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

export function useTokenDetail(tokenId: string) {
  return useQuery({
    queryKey: tradingKeys.detail(tokenId),
    queryFn: () => getTokenDetail(tokenId),
    enabled: !!tokenId,
  })
}

export function useChartData(tokenId: string, resolution: ChartResolution = '15') {
  const now = Math.floor(Date.now() / 1000)
  const rangeMap: Record<ChartResolution, number> = {
    '1': 3600,
    '5': 18000,
    '15': 54000,
    '60': 216000,
    '240': 864000,
    '1D': 2592000,
  }
  const from = now - (rangeMap[resolution] || 54000)

  return useQuery({
    queryKey: tradingKeys.chart(tokenId, resolution),
    queryFn: () =>
      getChartData(tokenId, {
        resolution,
        from,
        to: now,
        countback: 300,
        chart_type: 'price',
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
