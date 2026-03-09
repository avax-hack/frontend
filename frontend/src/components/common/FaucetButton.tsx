'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/button'
import { parseUnits, formatUnits } from 'viem'
import { OPENLAUNCH_CONTRACTS } from '@/lib/constants'
import MockUSDC_ABI from '@/lib/abi/MockUSDC.json'

const MINT_AMOUNT = parseUnits('10000', 6) // 10,000 USDC (6 decimals)

export function FaucetButton() {
  const { address, isConnected } = useAccount()
  const [error, setError] = useState<string | null>(null)

  const { data: balance, refetch } = useReadContract({
    address: OPENLAUNCH_CONTRACTS.USDC,
    abi: MockUSDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  })

  // Refetch balance after success
  if (isSuccess && hash) {
    refetch()
  }

  function handleMint() {
    if (!address) return
    setError(null)
    writeContract(
      {
        address: OPENLAUNCH_CONTRACTS.USDC,
        abi: MockUSDC_ABI,
        functionName: 'mint',
        args: [address, MINT_AMOUNT],
      },
      {
        onError: (err) => setError(err.message.split('\n')[0]),
      },
    )
  }

  if (!isConnected) return null

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40">
        {balance !== undefined ? `${formatUnits(balance as bigint, 6)} USDC` : '—'}
      </span>
      <Button
        size="sm"
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400"
      >
        {isPending ? 'Confirm...' : isConfirming ? 'Minting...' : 'Faucet 10,000 USDC'}
      </Button>
      {isSuccess && <span className="text-xs text-emerald-400">Minted!</span>}
      {error && <span className="max-w-[120px] truncate text-xs text-red-400">{error}</span>}
    </div>
  )
}
