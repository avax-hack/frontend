'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { getAddress, encodeFunctionData, decodeFunctionResult } from 'viem'
import type { Address } from 'viem'
import { contracts, V4_QUOTER_ABI } from '@/lib/contracts'
import { OPENLAUNCH_CONTRACTS } from '@/lib/constants'
import { IS_MOCK } from '@/lib/mock'

/** Read USDC balance for an address */
export function useUsdcBalance(address: Address | undefined) {
  return useReadContract({
    ...contracts.usdc,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !IS_MOCK && !!address,
    },
  })
}

/** Read USDC allowance for owner→spender */
export function useUsdcAllowance(owner: Address | undefined, spender: Address | undefined) {
  return useReadContract({
    ...contracts.usdc,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !IS_MOCK && !!owner && !!spender,
    },
  })
}

/** Read on-chain project data from IDO contract */
export function useProjectOnChain(tokenAddress: Address | undefined) {
  return useReadContract({
    ...contracts.ido,
    functionName: 'projects',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !IS_MOCK && !!tokenAddress,
    },
  })
}

/** Read milestones from IDO contract */
export function useMilestonesOnChain(tokenAddress: Address | undefined) {
  return useReadContract({
    ...contracts.ido,
    functionName: 'getMilestones',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !IS_MOCK && !!tokenAddress,
    },
  })
}

/** Read ERC20 token balance (for project tokens, used in refund) */
export function useTokenBalance(tokenAddress: Address | undefined, userAddress: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: contracts.usdc.abi, // standard ERC20 ABI
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !IS_MOCK && !!tokenAddress && !!userAddress,
    },
  })
}

/**
 * useQuote — V4Quoter.quoteExactInputSingle via eth_call
 *
 * Returns the expected output amount for a given input.
 * Debounces input by 500ms to avoid spamming RPC.
 */
export function useQuote(params: {
  tokenAddress: Address | undefined
  side: 'buy' | 'sell'
  amount: string // raw user input string
}) {
  const { tokenAddress, side, amount } = params

  // Debounce amount
  const [debouncedAmount, setDebouncedAmount] = useState(amount)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAmount(amount), 500)
    return () => clearTimeout(timer)
  }, [amount])

  const parsedAmount = debouncedAmount ? parseFloat(debouncedAmount) : 0
  const enabled = !IS_MOCK && parsedAmount > 0 && !!tokenAddress

  return useQuery({
    queryKey: ['v4-quote', tokenAddress, side, debouncedAmount],
    queryFn: async () => {
      const token = getAddress(tokenAddress!)
      const usdc = getAddress(OPENLAUNCH_CONTRACTS.USDC as Address)
      const quoterAddress = getAddress(OPENLAUNCH_CONTRACTS.V4_QUOTER as Address)

      // Sort currencies (same logic as useSwap)
      const tokenLower = token.toLowerCase()
      const usdcLower = usdc.toLowerCase()
      const currency0 = tokenLower < usdcLower ? token : usdc
      const currency1 = tokenLower < usdcLower ? usdc : token
      const tokenIsCurrency0 = tokenLower < usdcLower

      const zeroForOne = side === 'buy'
        ? !tokenIsCurrency0
        : tokenIsCurrency0

      // buy: USDC input (6 dec), sell: token input (18 dec)
      const decimals = side === 'buy' ? 6 : 18
      const { parseUnits } = await import('viem')
      const exactAmount = parseUnits(debouncedAmount, decimals)

      const calldata = encodeFunctionData({
        abi: V4_QUOTER_ABI,
        functionName: 'quoteExactInputSingle',
        args: [{
          poolKey: {
            currency0,
            currency1,
            fee: 3000,
            tickSpacing: 60,
            hooks: OPENLAUNCH_CONTRACTS.SWAP_FEE_HOOK,
          },
          zeroForOne,
          exactAmount,
          hookData: '0x' as `0x${string}`,
        }],
      })

      // V4Quoter is nonpayable but works via eth_call (revert-catch internally)
      const { getPublicClient } = await import('wagmi/actions')
      const { wagmiConfig } = await import('@/components/providers/wagmi-config')
      const publicClient = getPublicClient(wagmiConfig)

      const { data } = await publicClient.call({
        to: quoterAddress,
        data: calldata,
      })

      if (!data) throw new Error('Quote returned empty data')

      const [amountOut] = decodeFunctionResult({
        abi: V4_QUOTER_ABI,
        functionName: 'quoteExactInputSingle',
        data,
      }) as [bigint, bigint]

      // buy output: token (18 dec), sell output: USDC (6 dec)
      const { formatUnits } = await import('viem')
      const outDecimals = side === 'buy' ? 18 : 6
      return formatUnits(amountOut, outDecimals)
    },
    enabled,
    staleTime: 10_000,
    retry: false,
  })
}
