'use client'

import { useState, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import type { Address } from 'viem'
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
import { useInvest, type TxStep } from '@/features/contracts'
import { IS_MOCK } from '@/lib/mock'
import { SNOWTRACE_URL } from '@/lib/constants'
import type { IProjectData } from '@/types/project'

interface InvestModalProps {
  project: IProjectData
  amount: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function getStepLabel(step: TxStep): string {
  switch (step) {
    case 'approving':
      return 'Step 1/2: Approving USDC…'
    case 'waiting-approval':
      return 'Step 1/2: Waiting for approval…'
    case 'executing':
      return 'Step 2/2: Investing…'
    case 'waiting-execution':
      return 'Step 2/2: Confirming…'
    default:
      return 'Confirming…'
  }
}

export function InvestModal({ project, amount, open, onOpenChange, onSuccess }: InvestModalProps) {
  const [isMockPending, setIsMockPending] = useState(false)
  const { project_info } = project
  const { isConnected } = useAccount()
  const { step: txStep, txHash, execute: executeInvest, reset: resetInvest } = useInvest()
  const queryClient = useQueryClient()

  const isRealTxInProgress = !IS_MOCK
    && txStep !== 'idle'
    && txStep !== 'success'
    && txStep !== 'error'

  const isPending = IS_MOCK ? isMockPending : isRealTxInProgress

  // Use a ref to read latest isConnected in async callback
  const isConnectedRef = useRef(isConnected)
  useEffect(() => { isConnectedRef.current = isConnected }, [isConnected])

  // Reset invest state when modal closes
  useEffect(() => {
    if (!open) {
      resetInvest()
    }
  }, [open, resetInvest])

  async function handleConfirm() {
    if (isPending) return // double-submit prevention

    if (IS_MOCK) {
      // Mock TX — simulate contract interaction
      setIsMockPending(true)

      try {
        await new Promise(resolve => setTimeout(resolve, 2000))

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
        setIsMockPending(false)
      }
    } else {
      // Real TX flow — hook handles toasts internally
      const tokenAddress = project_info.project_id as Address
      const hash = await executeInvest(tokenAddress, amount)

      if (hash) {
        queryClient.invalidateQueries({ queryKey: ['readContract'] })
        onSuccess()
        onOpenChange(false)
      }
      // If null, hook already showed error/rejection toast
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

          {/* TX step progress (real mode only) */}
          {!IS_MOCK && isRealTxInProgress && (
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
              <LoaderIcon className="size-4 animate-spin text-primary" aria-hidden="true" />
              <span>{getStepLabel(txStep)}</span>
            </div>
          )}

          {/* TX success with Snowtrace link (real mode only) */}
          {!IS_MOCK && txStep === 'success' && txHash && (
            <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm dark:bg-green-950">
              <span className="text-green-700 dark:text-green-300">Transaction confirmed!</span>
              <a
                href={`${SNOWTRACE_URL}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                View on Snowtrace
              </a>
            </div>
          )}
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
            {isPending
              ? (!IS_MOCK ? getStepLabel(txStep) : 'Confirming…')
              : 'Confirm Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
