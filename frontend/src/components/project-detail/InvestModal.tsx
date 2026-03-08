'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from 'lucide-react'
import { isUserRejection } from '@/lib/errors'
import type { IProjectData } from '@/types/project'

interface InvestModalProps {
  project: IProjectData
  amount: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InvestModal({ project, amount, open, onOpenChange, onSuccess }: InvestModalProps) {
  const [isPending, setIsPending] = useState(false)
  const { project_info } = project
  const { isConnected } = useAccount()

  // Use a ref to read latest isConnected in async callback
  const isConnectedRef = useRef(isConnected)
  useEffect(() => { isConnectedRef.current = isConnected }, [isConnected])

  async function handleConfirm() {
    if (isPending) return // double-submit prevention
    setIsPending(true)

    try {
      // Mock TX — simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Replace with real contract call
      // const hash = await writeContract({...})
      // await waitForTransactionReceipt({hash})

      // Check if still connected after TX
      if (!isConnectedRef.current) {
        toast.error('Wallet disconnected', {
          description: 'Please reconnect and try again.',
        })
        onOpenChange(false)
        return
      }

      toast.success('Investment successful!', {
        description: `You committed $${amount.toLocaleString()} to ${project_info.name}`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      if (isUserRejection(error)) {
        toast.error('Transaction rejected', {
          description: 'You rejected the transaction in your wallet.',
        })
      } else {
        toast.error('Investment failed', {
          description: 'Something went wrong. Please try again.',
        })
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Investment</DialogTitle>
          <DialogDescription>
            Review your investment details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Project</span>
            <span className="font-medium">{project_info.name} ({project_info.symbol})</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">${amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">Avalanche C-Chain</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />}
            {isPending ? 'Confirming…' : 'Confirm Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
