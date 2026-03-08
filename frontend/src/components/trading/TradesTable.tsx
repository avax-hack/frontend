'use client'

import { truncateAddress, formatNumber } from '@/lib/utils'
import { SNOWTRACE_URL } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Time</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Type</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Amount</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Price</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Wallet</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">TX</th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap) => (
            <tr key={swap.transaction_hash} className="border-t border-border">
              <td className="px-3 py-2 text-sm">{formatRelativeTime(swap.created_at)}</td>
              <td className="px-3 py-2 text-sm">
                {swap.event_type === 'BUY' ? (
                  <span className="text-emerald-400">Buy</span>
                ) : (
                  <span className="text-red-400">Sell</span>
                )}
              </td>
              <td className="px-3 py-2 text-sm">
                {formatNumber(Number(swap.token_amount) / 1e18, 2)}
              </td>
              <td className="px-3 py-2 text-sm">${swap.native_price}</td>
              <td className="px-3 py-2 text-sm">
                {truncateAddress(swap.account_info.account_id)}
              </td>
              <td className="px-3 py-2 text-sm">
                <a
                  href={`${SNOWTRACE_URL}/tx/${swap.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View transaction"
                  className="text-sky-400 hover:underline"
                >
                  {truncateAddress(swap.transaction_hash)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
