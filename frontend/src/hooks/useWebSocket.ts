'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getWsClient } from '@/lib/ws'
import { IS_MOCK } from '@/lib/mock'
import { tradingKeys } from '@/features/trading/query-keys'
import { projectKeys } from '@/features/project/query-keys'
import { builderKeys } from '@/features/builder/query-keys'
import type { ChartResolution, ITradingChartData, IChartBar, ITokenSwapHistoryData, ISwapRecord } from '@/features/trading/types'
import type { ITokenData } from '@/types/token'

const RESOLUTION_MAP: Record<string, string> = {
  '1m': '1', '5m': '5', '15m': '15',
  '1h': '60', '4h': '240', '1D': '1D',
}

// --- WS event payload types ---

interface TradeEvent {
  type: 'TRADE'
  token: string
  buyer: string
  event_type: 'BUY' | 'SELL'
  usdc_amount: string
  token_amount: string
}

interface PriceUpdateEvent {
  type: 'PRICE_UPDATE'
  token_id: string
  usdc_amount: string
  token_amount: string
  price: string
}

interface ChartUpdateEvent {
  type: 'CHART_UPDATE'
  token_id: string
  interval: string
  o: string
  h: string
  l: string
  c: string
  v: string
  t: number
}

type TradeChannelEvent = TradeEvent | { type: 'LIQUIDITY_ALLOCATED' | 'FEES_COLLECTED'; [k: string]: unknown }

// ---

export function useTradingSubscription(tokenId: string, chartResolution: ChartResolution) {
  const qc = useQueryClient()
  const chartKeyRef = useRef<string | null>(null)

  // trade_subscribe + price_subscribe
  useEffect(() => {
    if (IS_MOCK || !tokenId) return

    const ws = getWsClient()
    ws.connect()

    // --- trade events → prepend swap history, invalidate holders ---
    const k1 = ws.subscribe('trade_subscribe', { token_id: tokenId }, (data: unknown) => {
      const event = data as TradeChannelEvent
      if (event.type !== 'TRADE') {
        // LIQUIDITY_ALLOCATED / FEES_COLLECTED → just refresh detail
        qc.invalidateQueries({ queryKey: tradingKeys.detail(tokenId) })
        return
      }

      const trade = event as TradeEvent

      // Prepend to all swap history caches for this token
      qc.setQueriesData<ITokenSwapHistoryData>(
        { queryKey: ['trading', 'swapHistory', tokenId] },
        (old) => {
          if (!old) return old
          const newRecord: ISwapRecord = {
            event_type: trade.event_type,
            native_amount: trade.usdc_amount,
            token_amount: trade.token_amount,
            transaction_hash: '',
            value: trade.usdc_amount,
            account_info: { account_id: trade.buyer, nickname: '', bio: '', image_uri: '' },
            created_at: Math.floor(Date.now() / 1000),
          }
          return {
            ...old,
            data: [newRecord, ...old.data].slice(0, 50),
            total_count: old.total_count + 1,
          }
        },
      )

      // Update detail volume
      qc.setQueryData<ITokenData | null>(tradingKeys.detail(tokenId), (old) => {
        if (!old) return old
        const addedVolume = parseFloat(trade.usdc_amount) / 1e6
        const currentVolume = parseFloat(old.market_info.volume || '0')
        return {
          ...old,
          market_info: {
            ...old.market_info,
            volume: String(currentVolume + addedVolume),
          },
        }
      })

      // Holders might change — invalidate
      qc.invalidateQueries({ queryKey: tradingKeys.holders(tokenId) })
    })

    // --- price events → update token detail price directly ---
    const k2 = ws.subscribe('price_subscribe', { token_id: tokenId }, (data: unknown) => {
      const event = data as PriceUpdateEvent
      if (event.type !== 'PRICE_UPDATE') return

      qc.setQueryData<ITokenData | null>(tradingKeys.detail(tokenId), (old) => {
        if (!old) return old
        return {
          ...old,
          market_info: {
            ...old.market_info,
            price: event.price,
            token_price: event.price,
          },
        }
      })
    })

    return () => {
      ws.unsubscribe(k1)
      ws.unsubscribe(k2)
    }
  }, [tokenId, qc])

  // chart_subscribe — re-subscribes when resolution changes
  useEffect(() => {
    if (IS_MOCK || !tokenId) return

    const ws = getWsClient()
    ws.connect()

    if (chartKeyRef.current) {
      ws.unsubscribe(chartKeyRef.current)
    }

    const resolution = RESOLUTION_MAP[chartResolution] ?? '1'
    const k = ws.subscribe(
      'chart_subscribe',
      { token_id: tokenId, resolution },
      (data: unknown) => {
        const event = data as ChartUpdateEvent
        if (event.type !== 'CHART_UPDATE') return

        qc.setQueryData<ITradingChartData | null>(
          tradingKeys.chart(tokenId, chartResolution),
          (old) => {
            if (!old) return old
            const newBar: IChartBar = {
              time: event.t,
              open: event.o,
              high: event.h,
              low: event.l,
              close: event.c,
              volume: event.v,
            }
            const bars = [...old.bars]
            const existIdx = bars.findIndex((b) => b.time === event.t)
            if (existIdx >= 0) {
              bars[existIdx] = newBar
            } else {
              bars.push(newBar)
            }
            return { ...old, bars }
          },
        )
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
