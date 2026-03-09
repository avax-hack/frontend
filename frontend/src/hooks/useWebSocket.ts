'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getWsClient } from '@/lib/ws'
import { IS_MOCK } from '@/lib/mock'
import { tradingKeys } from '@/features/trading/query-keys'
import { projectKeys } from '@/features/project/query-keys'
import { builderKeys } from '@/features/builder/query-keys'
import type { ChartResolution } from '@/features/trading/types'

const CHART_RESOLUTIONS = ['1m', '5m', '15m', '1h', '4h', '1D'] as const

const RESOLUTION_MAP: Record<string, string> = {
  '1m': '1', '5m': '5', '15m': '15',
  '1h': '60', '4h': '240', '1D': '1D',
}

export function useTradingSubscription(tokenId: string, chartResolution: ChartResolution) {
  const qc = useQueryClient()
  const chartKeyRef = useRef<string | null>(null)

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

  // chart_subscribe — re-subscribes when resolution changes
  useEffect(() => {
    if (IS_MOCK || !tokenId) return

    const ws = getWsClient()
    ws.connect()

    // Unsubscribe previous chart subscription
    if (chartKeyRef.current) {
      ws.unsubscribe(chartKeyRef.current)
    }

    const resolution = RESOLUTION_MAP[chartResolution] ?? '1'
    const k = ws.subscribe(
      'chart_subscribe',
      { token_id: tokenId, resolution },
      () => {
        qc.invalidateQueries({ queryKey: tradingKeys.chart(tokenId, chartResolution) })
      },
    )
    chartKeyRef.current = k

    return () => {
      ws.unsubscribe(k)
      chartKeyRef.current = null
    }
  }, [tokenId, chartResolution, qc])
}

export function useProjectSubscription(projectId: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (IS_MOCK || !projectId) return

    const ws = getWsClient()
    ws.connect()

    const k1 = ws.subscribe('project_subscribe', { project_id: projectId }, (params: unknown) => {
      const p = params as { type?: string }

      qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) })

      if (p.type === 'GRADUATED' || p.type === 'PROJECT_FAILED') {
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
      const p = params as { type?: string }

      if (
        p.type === 'PROJECT_CREATED' ||
        p.type === 'GRADUATED' ||
        p.type === 'PROJECT_FAILED'
      ) {
        qc.invalidateQueries({ queryKey: projectKeys.all })
      }

      if (p.type === 'LIQUIDITY_ALLOCATED') {
        qc.invalidateQueries({ queryKey: tradingKeys.all })
      }
    })

    return () => {
      ws.unsubscribe(k)
    }
  }, [qc])
}
