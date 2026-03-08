'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { OPENLAUNCH_CONTRACTS } from '@/lib/constants'
import MockUSDC_ABI from '@/lib/abi/MockUSDC.json'

const MINT_AMOUNT = parseUnits('100', 6) // 100 USDC (6 decimals)

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
      <span className="text-xs text-muted-foreground">
        {balance !== undefined ? `${formatUnits(balance as bigint, 6)} USDC` : '—'}
      </span>
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Confirm...' : isConfirming ? 'Minting...' : 'Faucet 100 USDC'}
      </button>
      {isSuccess && <span className="text-xs text-green-600">Minted!</span>}
      {error && <span className="text-xs text-red-500 max-w-[120px] truncate">{error}</span>}
    </div>
  )
}
