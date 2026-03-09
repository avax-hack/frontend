'use client'

import { truncateAddress, formatNumber } from '@/lib/utils'
import { SNOWTRACE_URL } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import type { ISwapRecord } from '@/features/trading/types'

interface TradesTableProps {
  swaps: ISwapRecord[]
  isLoading?: boolean
}

function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function TradesTable({ swaps, isLoading }: TradesTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (swaps.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No trades yet
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">USDC</TableHead>
          <TableHead className="text-right">Tokens</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead>TX</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {swaps.map((swap) => (
          <TableRow key={swap.transaction_hash}>
            <TableCell>{formatRelativeTime(swap.created_at)}</TableCell>
            <TableCell>
              {swap.event_type === 'BUY' ? (
                <span className="text-emerald-400">Buy</span>
              ) : (
                <span className="text-red-400">Sell</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              ${formatNumber(Number(swap.native_amount), 2)}
            </TableCell>
            <TableCell className="text-right">
              {formatNumber(Number(swap.token_amount), 2)}
            </TableCell>
            <TableCell>
              {truncateAddress(swap.account_info.account_id)}
            </TableCell>
            <TableCell>
              <a
                href={`${SNOWTRACE_URL}/tx/${swap.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View transaction"
                className="text-sky-400 hover:underline"
              >
                {truncateAddress(swap.transaction_hash)}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
