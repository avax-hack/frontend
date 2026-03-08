'use client'

import Link from 'next/link'
import { getAddress } from 'viem'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((item) => {
            const balance = Number(item.balance_info.balance) / 1e18
            const price = Number(item.balance_info.token_price)
            const value = balance * price

            return (
              <TableRow key={item.token_info.token_id}>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(balance)}
                </TableCell>
                <TableCell className="text-right">
                  ${formatNumber(price, 4)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${formatNumber(value, 2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/trading/${getAddress(item.token_info.token_id)}`}>
                      Trade
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
