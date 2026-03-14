'use client'

import { useState, useEffect } from 'react'
import { getWsClient } from '@/lib/ws'
import { IS_MOCK } from '@/lib/mock'
import { truncateAddress } from '@/lib/utils'

interface TickerEvent {
  id: number
  wallet: string
  eventType: 'BUY' | 'SELL'
  tokenAmount: string
  tokenSymbol: string
}

const MAX_EVENTS = 20
let tickerIdCounter = 0

function isTradeEvent(data: unknown): data is {
  type: 'TRADE'
  buyer: string
  event_type: 'BUY' | 'SELL'
  token_amount: string
  token_symbol: string
} {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return d.type === 'TRADE' && typeof d.buyer === 'string' && typeof d.token_symbol === 'string'
}

function formatTickerAmount(raw: string): string {
  const num = parseFloat(raw)
  if (isNaN(num) || num === 0) return '0'
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toFixed(2)
}

export function LiveTicker() {
  const [events, setEvents] = useState<TickerEvent[]>([])

  useEffect(() => {
    if (IS_MOCK) return

    const ws = getWsClient()
    ws.connect()

    const key = ws.subscribe('trade_subscribe', {}, (data: unknown) => {
      if (!isTradeEvent(data)) return

      const newEvent: TickerEvent = {
        id: ++tickerIdCounter,
        wallet: data.buyer,
        eventType: data.event_type,
        tokenAmount: data.token_amount,
        tokenSymbol: data.token_symbol,
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, MAX_EVENTS))
    })

    return () => {
      ws.unsubscribe(key)
    }
  }, [])

  if (events.length === 0) return null

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 bg-secondary/30 py-2">
      <div className="animate-marquee flex gap-6 motion-reduce:animate-none motion-reduce:[animation-play-state:paused]">
        {events.map((e) => (
          <span key={e.id} className="flex shrink-0 items-center gap-1 text-sm">
            <span className="text-muted-foreground">{truncateAddress(e.wallet)}</span>
            <span className={e.eventType === 'BUY' ? 'text-green-400' : 'text-red-400'}>
              {e.eventType === 'BUY' ? 'bought' : 'sold'}
            </span>
            <span className="font-medium">{formatTickerAmount(e.tokenAmount)}</span>
            <span className="text-muted-foreground">{e.tokenSymbol}</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {events.map((e) => (
          <span key={`dup-${e.id}`} className="flex shrink-0 items-center gap-1 text-sm" aria-hidden="true">
            <span className="text-muted-foreground">{truncateAddress(e.wallet)}</span>
            <span className={e.eventType === 'BUY' ? 'text-green-400' : 'text-red-400'}>
              {e.eventType === 'BUY' ? 'bought' : 'sold'}
            </span>
            <span className="font-medium">{formatTickerAmount(e.tokenAmount)}</span>
            <span className="text-muted-foreground">{e.tokenSymbol}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
