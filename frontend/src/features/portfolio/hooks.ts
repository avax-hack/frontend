'use client'

import { useQuery } from '@tanstack/react-query'
import { portfolioKeys } from './query-keys'
import {
  getPortfolioSummary,
  getHoldTokens,
  getIdoHistory,
  getSwapHistory,
  getRefundHistory,
} from './services'

export function usePortfolioSummary(accountId: string | undefined) {
  return useQuery({
    queryKey: portfolioKeys.summary(accountId ?? ''),
    queryFn: () => getPortfolioSummary(accountId!),
    enabled: !!accountId,
  })
}

export function useHoldTokens(
  accountId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: portfolioKeys.holdTokens(accountId ?? '', params),
    queryFn: () => getHoldTokens(accountId!, params),
    enabled: !!accountId,
  })
}

export function useIdoHistory(
  accountId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: portfolioKeys.idoHistory(accountId ?? '', params),
    queryFn: () => getIdoHistory(accountId!, params),
    enabled: !!accountId,
  })
}

export function useSwapHistory(
  accountId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: portfolioKeys.swapHistory(accountId ?? '', params),
    queryFn: () => getSwapHistory(accountId!, params),
    enabled: !!accountId,
  })
}

export function useRefundHistory(
  accountId: string | undefined,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: portfolioKeys.refundHistory(accountId ?? '', params),
    queryFn: () => getRefundHistory(accountId!, params),
    enabled: !!accountId,
  })
}
