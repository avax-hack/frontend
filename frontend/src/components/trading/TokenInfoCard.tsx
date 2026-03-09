'use client'

import { formatNumber, formatLargeNumber } from '@/lib/utils'
import type { ITokenData } from '@/features/trading/types'

interface TokenInfoCardProps {
  token: ITokenData
}

export function TokenInfoCard({ token }: TokenInfoCardProps) {
  const { token_info, market_info } = token
  const mcap = Number(market_info.total_supply) * Number(market_info.token_price)

  const rows = [
    { label: 'Price (USD)', value: `$${formatNumber(Number(market_info.token_price), 6)}` },
    { label: 'FDV', value: `$${formatLargeNumber(mcap)}` },
    { label: 'Supply', value: formatLargeNumber(Number(market_info.total_supply)) },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {token_info.image_uri ? (
          <img
            src={token_info.image_uri}
            alt={`${token_info.name} logo`}
            className="size-6 rounded-full object-cover"
          />
        ) : (
          <div className="size-6 rounded-full bg-secondary" aria-hidden="true" />
        )}
        <span className="text-sm font-semibold">{token_info.name}</span>
        <span className="text-xs text-muted-foreground">${token_info.symbol}</span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className="text-xs font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
