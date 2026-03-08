'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { formatNumber } from '@/lib/utils'
import { CoinsIcon } from 'lucide-react'
import type { IHoldTokenItem } from '@/features/portfolio/types'

interface HoldingsTableProps {
  tokens: IHoldTokenItem[] | undefined
  isLoading: boolean
}

export function HoldingsTable({ tokens, isLoading }: HoldingsTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!tokens || tokens.length === 0) {
    return (
      <EmptyState
        icon={<CoinsIcon />}
        message="No tokens yet"
        description="Start investing in IDO projects or trading tokens"
        actionLabel="Explore Projects"
        actionHref="/explore"
      />
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Token</th>
              <th className="px-4 py-3 text-right font-medium">Balance</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Value</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((item) => {
              const balance = Number(item.balance_info.balance) / 1e18
              const price = Number(item.balance_info.token_price)
              const value = balance * price

              return (
                <tr
                  key={item.token_info.token_id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.token_info.image_uri ? (
                        <img
                          src={item.token_info.image_uri}
                          alt=""
                          className="size-8 rounded-full"
                        />
                      ) : (
                        <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                          {item.token_info.symbol.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{item.token_info.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.token_info.symbol}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNumber(balance)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${formatNumber(price, 4)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${formatNumber(value, 2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/trading/${item.token_info.token_id}`}>
                        Trade
                      </Link>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
