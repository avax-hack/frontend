'use client'

import { truncateAddress, formatNumber } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { ITokenHolder } from '@/features/trading/types'

interface HoldersTableProps {
  holders: ITokenHolder[]
  isLoading?: boolean
}

export function HoldersTable({ holders, isLoading }: HoldersTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (holders.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No holders yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Rank</th>
            <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Address</th>
            <th className="px-3 py-2 text-right text-xs text-muted-foreground font-medium">Balance</th>
            <th className="px-3 py-2 text-right text-xs text-muted-foreground font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder) => (
            <tr key={holder.account_info.account_id} className="border-t border-border">
              <td className="px-3 py-2 text-sm">{holder.rank}</td>
              <td className="px-3 py-2 text-sm">
                {truncateAddress(holder.account_info.account_id)}
              </td>
              <td className="px-3 py-2 text-sm text-right">
                {formatNumber(Number(holder.balance) / 1e18, 2)}
              </td>
              <td className="px-3 py-2 text-sm text-right">
                {holder.percent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
