'use client'

import { useState, useCallback } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseUnits, decodeEventLog } from 'viem'
import type { Address, Hash } from 'viem'
import { toast } from 'sonner'
import { contracts, IDO_ABI, ERC20_ABI, SWAP_ROUTER_ABI } from '@/lib/contracts'
import { OPENLAUNCH_CONTRACTS, SNOWTRACE_URL } from '@/lib/constants'
import { isUserRejection } from '@/lib/errors'

// ===== Types =====

export type TxStep = 'idle' | 'approving' | 'waiting-approval' | 'executing' | 'waiting-execution' | 'success' | 'error'

interface TxState {
  step: TxStep
  txHash: Hash | null
  error: string | null
}

// ===== Invest Hook =====

/**
 * useInvest — approve USDC (if needed) → IDO.buy(token, usdcAmount)
 *
 * USDC has 6 decimals. Amount input is in USD whole numbers (e.g. 100 = $100).
 * Converts to 6-decimal USDC units internally.
 */
export function useInvest() {
  const { address } = useAccount()
  const [txState, setTxState] = useState<TxState>({ step: 'idle', txHash: null, error: null })

  const { writeContractAsync } = useWriteContract()

  const execute = useCallback(async (tokenAddress: Address, usdcAmount: number): Promise<Hash | null> => {
    if (!address) return null

    setTxState({ step: 'idle', txHash: null, error: null })

    try {
      const amountInUnits = parseUnits(String(usdcAmount), 6) // USDC has 6 decimals

      // Step 1: Approve USDC spending
      setTxState({ step: 'approving', txHash: null, error: null })

      const approveHash = await writeContractAsync({
        ...contracts.usdc,
        functionName: 'approve',
        args: [OPENLAUNCH_CONTRACTS.IDO, amountInUnits],
      })

      setTxState({ step: 'waiting-approval', txHash: approveHash, error: null })

      const { waitForTransactionReceipt } = await import('wagmi/actions')
      const { wagmiConfig } = await import('@/components/providers/wagmi-config')
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })

      // Step 2: Execute buy
      setTxState({ step: 'executing', txHash: null, error: null })

      const buyHash = await writeContractAsync({
        ...contracts.ido,
        functionName: 'buy',
        args: [tokenAddress, amountInUnits],
      })

      setTxState({ step: 'waiting-execution', txHash: buyHash, error: null })

      await waitForTransactionReceipt(wagmiConfig, { hash: buyHash })

      setTxState({ step: 'success', txHash: buyHash, error: null })

      toast.success('Investment successful!', {
        description: `TX: ${buyHash.slice(0, 10)}…`,
        action: {
          label: 'View on Snowtrace',
          onClick: () => window.open(`${SNOWTRACE_URL}/tx/${buyHash}`, '_blank'),
        },
      })

      return buyHash
    } catch (error: unknown) {
      const errorMsg = isUserRejection(error)
        ? 'Transaction rejected'
        : getContractErrorMessage(error)

      setTxState({ step: 'error', txHash: null, error: errorMsg })

      if (isUserRejection(error)) {
        toast.error('Transaction rejected', {
          description: 'You rejected the transaction in your wallet.',
        })
      } else {
        toast.error('Investment failed', {
          description: errorMsg,
        })
      }
      return null
    }
  }, [address, writeContractAsync])

  const reset = useCallback(() => {
    setTxState({ step: 'idle', txHash: null, error: null })
  }, [])

  return { ...txState, execute, reset }
}

// ===== Refund Hook =====

/**
 * useRefund — approve project token → IDO.refund(token, tokenAmount)
 *
 * The IDO contract calls safeTransferFrom to pull project tokens from the user,
 * so the user must first approve the IDO contract to spend their project tokens.
 */
export function useRefund() {
  const { address } = useAccount()
  const [txState, setTxState] = useState<TxState>({ step: 'idle', txHash: null, error: null })

  const { writeContractAsync } = useWriteContract()

  const execute = useCallback(async (tokenAddress: Address, tokenAmount: bigint): Promise<Hash | null> => {
    if (!address) return null

    setTxState({ step: 'idle', txHash: null, error: null })

    try {
      // Step 1: Approve project token spending
      setTxState({ step: 'approving', txHash: null, error: null })

      const approveHash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [OPENLAUNCH_CONTRACTS.IDO, tokenAmount],
      })

      setTxState({ step: 'waiting-approval', txHash: approveHash, error: null })

      const { waitForTransactionReceipt } = await import('wagmi/actions')
      const { wagmiConfig } = await import('@/components/providers/wagmi-config')
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })

      // Step 2: Execute refund
      setTxState({ step: 'executing', txHash: null, error: null })

      const hash = await writeContractAsync({
        ...contracts.ido,
        functionName: 'refund',
        args: [tokenAddress, tokenAmount],
      })

      setTxState({ step: 'waiting-execution', txHash: hash, error: null })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      setTxState({ step: 'success', txHash: hash, error: null })

      toast.success('Refund claimed successfully!', {
        description: `TX: ${hash.slice(0, 10)}…`,
        action: {
          label: 'View on Snowtrace',
          onClick: () => window.open(`${SNOWTRACE_URL}/tx/${hash}`, '_blank'),
        },
      })

      return hash
    } catch (error: unknown) {
      const errorMsg = isUserRejection(error)
        ? 'Transaction rejected'
        : getContractErrorMessage(error)

      setTxState({ step: 'error', txHash: null, error: errorMsg })

      if (isUserRejection(error)) {
        toast.error('Transaction rejected')
      } else {
        toast.error('Refund failed', { description: errorMsg })
      }
      return null
    }
  }, [address, writeContractAsync])

  const reset = useCallback(() => {
    setTxState({ step: 'idle', txHash: null, error: null })
  }, [])

  return { ...txState, execute, reset }
}

// ===== Create Project Hook =====

/**
 * useCreateProjectContract — IDO.create(CreateParams)
 *
 * Returns the created token address extracted from ProjectCreated event.
 *
 * CreateParams struct:
 * - name: string
 * - symbol: string
 * - tokenURI: string
 * - idoTokenAmount: uint256 (18 decimals, project token)
 * - tokenPrice: uint256 (USDC per token, 6 decimals)
 * - deadline: uint256 (unix timestamp)
 * - milestonePercentages: uint256[] (whole numbers, must sum to 100)
 * - salt: bytes32 (random for CREATE2)
 */
export function useCreateProjectContract() {
  const { address } = useAccount()
  const [txState, setTxState] = useState<TxState>({ step: 'idle', txHash: null, error: null })

  const { writeContractAsync } = useWriteContract()

  const execute = useCallback(async (params: {
    name: string
    symbol: string
    tokenURI: string
    idoTokenAmount: bigint
    tokenPrice: bigint
    deadline: bigint
    milestonePercentages: bigint[]
    salt: `0x${string}`
  }): Promise<{ hash: Hash; tokenAddress: Address } | null> => {
    if (!address) return null

    setTxState({ step: 'idle', txHash: null, error: null })

    try {
      setTxState({ step: 'executing', txHash: null, error: null })

      const hash = await writeContractAsync({
        ...contracts.ido,
        functionName: 'create',
        args: [{
          name: params.name,
          symbol: params.symbol,
          tokenURI: params.tokenURI,
          idoTokenAmount: params.idoTokenAmount,
          tokenPrice: params.tokenPrice,
          deadline: params.deadline,
          milestonePercentages: params.milestonePercentages,
          salt: params.salt,
        }],
      })

      setTxState({ step: 'waiting-execution', txHash: hash, error: null })

      const { waitForTransactionReceipt } = await import('wagmi/actions')
      const { wagmiConfig } = await import('@/components/providers/wagmi-config')
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })

      // Extract token address from ProjectCreated event
      let tokenAddress: Address | null = null
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: IDO_ABI,
            data: log.data,
            topics: log.topics,
          })
          if (decoded.eventName === 'ProjectCreated') {
            tokenAddress = (decoded.args as unknown as { token: Address }).token
            break
          }
        } catch {
          // Not a matching event, skip
        }
      }

      if (!tokenAddress) {
        throw new Error('Could not find ProjectCreated event in transaction receipt')
      }

      setTxState({ step: 'success', txHash: hash, error: null })

      toast.success('Project created on-chain!', {
        description: `Token: ${tokenAddress.slice(0, 10)}…`,
        action: {
          label: 'View on Snowtrace',
          onClick: () => window.open(`${SNOWTRACE_URL}/tx/${hash}`, '_blank'),
        },
      })

      return { hash, tokenAddress }
    } catch (error: unknown) {
      const errorMsg = isUserRejection(error)
        ? 'Transaction rejected'
        : getContractErrorMessage(error)

      setTxState({ step: 'error', txHash: null, error: errorMsg })

      if (isUserRejection(error)) {
        toast.error('Transaction rejected')
      } else {
        toast.error('Project creation failed', { description: errorMsg })
      }
      return null
    }
  }, [address, writeContractAsync])

  const reset = useCallback(() => {
    setTxState({ step: 'idle', txHash: null, error: null })
  }, [])

  return { ...txState, execute, reset }
}

// ===== Swap Hook =====

/**
 * useSwap — SwapRouter.swap(key, params)
 *
 * Pool is USDC ↔ Token (NOT AVAX).
 * - currency0 < currency1 (sorted by address)
 * - buy: USDC → Token (amount in USDC, 6 decimals)
 * - sell: Token → USDC (amount in Token, 18 decimals)
 * - amountSpecified: negative = exact input
 * - Requires approve on input token to SwapRouter before swap
 */
export function useSwap() {
  const { address } = useAccount()
  const [txState, setTxState] = useState<TxState>({ step: 'idle', txHash: null, error: null })

  const { writeContractAsync } = useWriteContract()

  const execute = useCallback(async (params: {
    tokenAddress: Address
    side: 'buy' | 'sell'
    amount: bigint // buy: USDC units (6 dec), sell: token units (18 dec)
    slippageBps: number
  }): Promise<Hash | null> => {
    if (!address) return null

    setTxState({ step: 'idle', txHash: null, error: null })

    try {
      const usdcAddress = OPENLAUNCH_CONTRACTS.USDC as Address
      const swapRouterAddress = OPENLAUNCH_CONTRACTS.SWAP_ROUTER as Address

      // Sort currencies for PoolKey (currency0 < currency1)
      const tokenLower = params.tokenAddress.toLowerCase()
      const usdcLower = usdcAddress.toLowerCase()
      const currency0 = tokenLower < usdcLower ? params.tokenAddress : usdcAddress
      const currency1 = tokenLower < usdcLower ? usdcAddress : params.tokenAddress
      const tokenIsCurrency0 = tokenLower < usdcLower

      // Determine swap direction
      // buy (USDC → Token): sell USDC side → zeroForOne depends on which is currency0
      // sell (Token → USDC): sell Token side
      const zeroForOne = params.side === 'buy'
        ? !tokenIsCurrency0  // selling USDC: if USDC is currency0, zeroForOne=true
        : tokenIsCurrency0   // selling Token: if Token is currency0, zeroForOne=true

      // Exact input (negative amountSpecified)
      const amountSpecified = BigInt(0) - params.amount

      const MIN_SQRT_PRICE = BigInt('4295128739')
      const MAX_SQRT_PRICE = BigInt('1461446703485210103287273052203988822378723970342')
      const sqrtPriceLimitX96 = zeroForOne
        ? MIN_SQRT_PRICE + BigInt(1)
        : MAX_SQRT_PRICE - BigInt(1)

      // Step 1: Approve input token to SwapRouter
      const inputTokenAddress = params.side === 'buy' ? usdcAddress : params.tokenAddress

      setTxState({ step: 'approving', txHash: null, error: null })

      const approveHash = await writeContractAsync({
        address: inputTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [swapRouterAddress, params.amount],
      })

      setTxState({ step: 'waiting-approval', txHash: approveHash, error: null })

      const { waitForTransactionReceipt } = await import('wagmi/actions')
      const { wagmiConfig } = await import('@/components/providers/wagmi-config')
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })

      // Step 2: Execute swap via SwapRouter
      setTxState({ step: 'executing', txHash: null, error: null })

      const hash = await writeContractAsync({
        address: swapRouterAddress,
        abi: SWAP_ROUTER_ABI,
        functionName: 'swap',
        args: [
          {
            currency0,
            currency1,
            fee: 3000,
            tickSpacing: 60,
            hooks: OPENLAUNCH_CONTRACTS.SWAP_FEE_HOOK,
          },
          {
            zeroForOne,
            amountSpecified,
            sqrtPriceLimitX96,
          },
        ],
      })

      setTxState({ step: 'waiting-execution', txHash: hash, error: null })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      setTxState({ step: 'success', txHash: hash, error: null })

      toast.success(`${params.side === 'buy' ? 'Buy' : 'Sell'} successful!`, {
        description: `TX: ${hash.slice(0, 10)}…`,
        action: {
          label: 'View on Snowtrace',
          onClick: () => window.open(`${SNOWTRACE_URL}/tx/${hash}`, '_blank'),
        },
      })

      return hash
    } catch (error: unknown) {
      const errorMsg = isUserRejection(error)
        ? 'Transaction rejected'
        : getContractErrorMessage(error)

      setTxState({ step: 'error', txHash: null, error: errorMsg })

      if (isUserRejection(error)) {
        toast.error('Transaction rejected')
      } else {
        toast.error('Swap failed', { description: errorMsg })
      }
      return null
    }
  }, [address, writeContractAsync])

  const reset = useCallback(() => {
    setTxState({ step: 'idle', txHash: null, error: null })
  }, [])

  return { ...txState, execute, reset }
}

// ===== Error Mapping =====

/** Map contract custom errors to user-friendly messages */
function getContractErrorMessage(error: unknown): string {
  if (error === null || typeof error !== 'object') return 'Something went wrong. Please try again.'

  const errorString = String(error)

  // IDO contract errors
  if (errorString.includes('IDONotActive')) return 'This IDO is not currently active.'
  if (errorString.includes('IDOExceedsSupply')) return 'This amount exceeds the available token supply.'
  if (errorString.includes('InsufficientPurchaseAmount')) return 'Purchase amount is too small.'
  if (errorString.includes('ZeroAmount')) return 'Amount must be greater than zero.'
  if (errorString.includes('ProjectNotFailed')) return 'This project has not failed — refund unavailable.'
  if (errorString.includes('CreatorCannotRefund')) return 'Project creators cannot claim refunds.'
  if (errorString.includes('ExceedsRefundableAmount')) return 'Amount exceeds your refundable balance.'
  if (errorString.includes('InvalidDeadline')) return 'Invalid deadline. Must be in the future.'
  if (errorString.includes('InvalidIdoTokenAmount')) return 'Invalid token amount.'
  if (errorString.includes('InvalidMilestonePercentages')) return 'Milestone allocations must sum to 100%.'
  if (errorString.includes('InvalidName')) return 'Invalid project name.'
  if (errorString.includes('InvalidSymbol')) return 'Invalid ticker symbol.'
  if (errorString.includes('InvalidTokenPrice')) return 'Invalid token price.'
  if (errorString.includes('TooManyMilestones')) return 'Too many milestones (max 6).'
  if (errorString.includes('ProjectNotFound')) return 'Project not found on-chain.'

  // ERC20 errors
  if (errorString.includes('ERC20InsufficientBalance')) return 'Insufficient token balance.'
  if (errorString.includes('ERC20InsufficientAllowance')) return 'Insufficient token allowance. Please approve first.'

  // Generic
  if (errorString.includes('user rejected') || errorString.includes('User denied')) return 'Transaction rejected.'

  return 'Something went wrong. Please try again.'
}
