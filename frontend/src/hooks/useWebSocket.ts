'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getWsClient } from '@/lib/ws'
import { IS_MOCK } from '@/lib/mock'
import { tradingKeys } from '@/features/trading/query-keys'
import { projectKeys } from '@/features/project/query-keys'
import { builderKeys } from '@/features/builder/query-keys'

const CHART_RESOLUTIONS = ['1m', '5m', '15m', '1h', '4h', '1D'] as const

export function useTradingSubscription(tokenId: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (IS_MOCK || !tokenId) return

    const ws = getWsClient()
    ws.connect()

    const timers: ReturnType<typeof setTimeout>[] = []

    const k1 = ws.subscribe('trade_subscribe', { token_id: tokenId }, () => {
      timers.push(setTimeout(() => {
        qc.invalidateQueries({ queryKey: tradingKeys.detail(tokenId) })
        qc.invalidateQueries({ queryKey: tradingKeys.swapHistory(tokenId) })
        qc.invalidateQueries({ queryKey: tradingKeys.holders(tokenId) })
      }, 3000))
    })

    const k2 = ws.subscribe('price_subscribe', { token_id: tokenId }, () => {
      timers.push(setTimeout(() => {
        qc.invalidateQueries({ queryKey: tradingKeys.detail(tokenId) })
        for (const r of CHART_RESOLUTIONS) {
          qc.invalidateQueries({ queryKey: tradingKeys.chart(tokenId, r) })
        }
      }, 3000))
    })

    return () => {
      timers.forEach(clearTimeout)
      ws.unsubscribe(k1)
      ws.unsubscribe(k2)
    }
  }, [tokenId, qc])
}

export function useProjectSubscription(projectId: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (IS_MOCK || !projectId) return

    const ws = getWsClient()
    ws.connect()

    const k1 = ws.subscribe('project_subscribe', { project_id: projectId }, (params: unknown) => {
      const p = params as { event?: string }

      qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) })

      if (p.event === 'GRADUATED' || p.event === 'FAILED') {
        qc.invalidateQueries({ queryKey: projectKeys.all })
      }
    })

    const k2 = ws.subscribe('milestone_subscribe', { project_id: projectId }, () => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      qc.invalidateQueries({ queryKey: builderKeys.overview(projectId) })
    })

    return () => {
      ws.unsubscribe(k1)
      ws.unsubscribe(k2)
    }
  }, [projectId, qc])
}

export function useNewContentSubscription() {
  const qc = useQueryClient()

  useEffect(() => {
    if (IS_MOCK) return

    const ws = getWsClient()
    ws.connect()

    const k = ws.subscribe('new_content_subscribe', {}, (params: unknown) => {
      const p = params as { event?: string }

      if (
        p.event === 'PROJECT_CREATED' ||
        p.event === 'GRADUATED' ||
        p.event === 'FAILED'
      ) {
        qc.invalidateQueries({ queryKey: projectKeys.all })
      }

      if (p.event === 'LIQUIDITY_ALLOCATED') {
        qc.invalidateQueries({ queryKey: tradingKeys.all })
      }
    })

    return () => {
      ws.unsubscribe(k)
    }
  }, [qc])
}
