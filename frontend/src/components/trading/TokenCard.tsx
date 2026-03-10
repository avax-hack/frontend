'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'

import { formatNumber, safeGetAddress } from '@/lib/utils'
import type { ITokenData } from '@/features/trading/types'

function getMilestoneVariant(milestone: number): 'gray' | 'amber' | 'green' {
  if (milestone === 0) return 'gray'
  if (milestone <= 2) return 'amber'
  return 'green'
}

function formatCompactUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1_000 ? 1 : 2,
  }).format(value)
}

interface TokenCardProps {
  token: ITokenData
}

export function TokenCard({ token }: TokenCardProps) {
  const { token_info, market_info } = token

  const price = Number(market_info.token_price)
  const mcap = Number(market_info.total_supply) * Number(market_info.token_price)

  const checkedId = safeGetAddress(token_info.token_id)
  const href = checkedId ? `/trading/${checkedId}` : undefined


  const inner = (
    <>
      <Card className="flex flex-col gap-3 p-4 transition hover:bg-secondary/50">
        <div className="flex items-start justify-between">
          <StatusBadge
            label={`${market_info.milestone_completed}/4`}
            variant={getMilestoneVariant(market_info.milestone_completed)}
            size="sm"
          />
          <span className="text-xs text-muted-foreground">{token_info.category}</span>
        </div>

        <div className="flex items-center gap-3">
          {token_info.image_uri ? (
            <img
              src={token_info.image_uri}
              alt={`${token_info.name} logo`}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-secondary" aria-hidden="true" />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{token_info.name}</span>
            <span className="text-xs text-muted-foreground">{token_info.symbol}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-sm font-medium">${formatNumber(price)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">MCap</span>
            <span className="text-sm font-medium">{formatCompactUSD(mcap)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Holders</span>
            <span className="text-sm font-medium">{formatNumber(market_info.holder_count, 0)}</span>
          </div>
        </div>
      </Card>
    </>
  )

  if (href) {
    return <Link href={href} aria-label={`View ${token_info.name} trading`}>{inner}</Link>
  }
  return <div>{inner}</div>
}
