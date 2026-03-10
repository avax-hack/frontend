'use client'

import { truncateAddress, formatTokenAmount } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
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
      <div className="p-8 text-center text-white/50">
        No holders yet
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white/70">#</TableHead>
          <TableHead className="text-white/70">Address</TableHead>
          <TableHead className="text-right text-white/70">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holders.map((holder, i) => (
          <TableRow key={holder.account_info.account_id}>
            <TableCell className="text-white/60">{i + 1}</TableCell>
            <TableCell className="text-white">
              {truncateAddress(holder.account_info.account_id)}
            </TableCell>
            <TableCell className="text-right text-white">
              {formatTokenAmount(holder.balance)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
