'use client'

import { useReadContract } from 'wagmi'
import { contracts } from '@/lib/contracts'
import { IS_MOCK } from '@/lib/mock'
import type { Address } from 'viem'

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
