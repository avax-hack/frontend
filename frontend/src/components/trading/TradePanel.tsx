'use client'

import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, safeGetAddress } from '@/lib/utils'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useSwap, useTokenBalance, useUsdcBalance, useQuote } from '@/features/contracts'
import { IS_MOCK } from '@/lib/mock'

import type { ITokenData } from '@/features/trading/types'
import Link from 'next/link'

interface TradePanelProps {
  token: ITokenData
}

const SLIPPAGE_OPTIONS = ['0.5', '1', '3', '5'] as const
const BUY_PRESETS = [
  { label: 'Reset', value: 0 },
  { label: '$10', value: 10 },
  { label: '$50', value: 50 },
  { label: '$100', value: 100 },
  { label: 'Max', value: -1 },
] as const
const SELL_PRESETS = [
  { label: 'Reset', value: 0 },
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: 'Max', value: 100 },
] as const

export function TradePanel({ token }: TradePanelProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('3')
  const [customSlippage, setCustomSlippage] = useState('')
  const [showSlippage, setShowSlippage] = useState(false)

  const { token_info } = token
  const tokenAddress = safeGetAddress(token_info.token_id)

  const { address } = useAccount()
  const queryClient = useQueryClient()
  const swap = useSwap()
  const { data: usdcBalance } = useUsdcBalance(address)
  const { data: tokenBalance } = useTokenBalance(
    tokenAddress,
    address,
  )

  const { data: quoteOut, isFetching: isQuoting } = useQuote({
    tokenAddress,
    side,
    amount,
  })

  const currentBalance = useMemo(() => {
    if (side === 'buy') {
      return usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)) : 0
    }
    return tokenBalance ? parseFloat(formatUnits(tokenBalance as bigint, 18)) : 0
  }, [side, usdcBalance, tokenBalance])

  const balanceLabel = useMemo(() => {
    if (side === 'buy') {
      const formatted = usdcBalance
        ? parseFloat(formatUnits(usdcBalance as bigint, 6)).toFixed(2)
        : '0'
      return `${formatted} USDC`
    }
    const formatted = tokenBalance
      ? parseFloat(formatUnits(tokenBalance as bigint, 18)).toFixed(4)
      : '0'
    return `${formatted} ${token_info.symbol}`
  }, [side, usdcBalance, tokenBalance, token_info.symbol])

  // IDO phase — not graduated
  if (!token.token_info.is_graduated) {
    return (
      <Card className="p-5 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          This token is still in IDO phase. Trading will be available after graduation.
        </p>
        {token.token_info.project_id && (() => {
          const projectAddr = safeGetAddress(token.token_info.project_id)
          return projectAddr ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${projectAddr}`}>Go to Project Page</Link>
            </Button>
          ) : null
        })()}
      </Card>
    )
  }

  const isSwapping =
    swap.step !== 'idle' && swap.step !== 'success' && swap.step !== 'error'

  const activeSlippage = customSlippage || slippage || '3'
  const slippageBps = Math.round(parseFloat(activeSlippage) * 100)

  const parsedAmount = amount ? parseFloat(amount) : 0
  const isDisabled =
    !amount ||
    parsedAmount <= 0 ||
    parsedAmount > currentBalance ||
    isSwapping ||
    (!IS_MOCK && !address)

  const stepLabel: Record<string, string> = {
    approving: 'Approving…',
    'waiting-approval': 'Waiting for approval…',
    executing: 'Swapping…',
    'waiting-execution': 'Confirming…',
  }

  function handleAmountChange(value: string) {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  function handleCustomSlippageChange(value: string) {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomSlippage(value)
      setSlippage('')
    }
  }

  function handlePreset(preset: { label: string; value: number }) {
    if (preset.value === 0) {
      setAmount('')
      return
    }
    if (side === 'buy') {
      // Buy presets are dollar amounts (except Max)
      if (preset.value === -1) {
        const val = currentBalance
        setAmount(String(parseFloat(val.toFixed(2))))
      } else {
        const val = Math.min(preset.value, currentBalance)
        setAmount(String(parseFloat(val.toFixed(2))))
      }
    } else {
      // Sell presets are percentages
      const val = (currentBalance * preset.value) / 100
      setAmount(String(parseFloat(val.toFixed(6))))
    }
  }

  async function handleSubmit() {
    if (IS_MOCK) {
      toast('Coming soon', {
        description: 'Trading will be available in a future update.',
      })
      return
    }

    if (!amount || parsedAmount <= 0) return

    const decimals = side === 'buy' ? 6 : 18
    const amountBigInt = parseUnits(amount, decimals)

    if (!tokenAddress) return

    const hash = await swap.execute({
      tokenAddress,
      side,
      amount: amountBigInt,
      slippageBps,
    })

    if (hash) {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
      setAmount('')
    }
  }

  const presets = side === 'buy' ? BUY_PRESETS : SELL_PRESETS
  const currencyLabel = side === 'buy' ? 'USDC' : token_info.symbol

  return (
    <Card className="p-4 flex flex-col gap-3">
      {/* Buy / Sell toggle */}
      <div className="bg-secondary rounded-full p-1 flex">
        <button
          type="button"
          className={cn(
            'flex-1 py-2 text-sm font-semibold rounded-full transition-colors',
            side === 'buy'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => { setSide('buy'); setAmount('') }}
        >
          Buy
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 py-2 text-sm font-semibold rounded-full transition-colors',
            side === 'sell'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => { setSide('sell'); setAmount('') }}
        >
          Sell
        </button>
      </div>

      {/* Slippage trigger */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          onClick={() => setShowSlippage((v) => !v)}
        >
          <span>⚙</span>
          <span>{activeSlippage}%</span>
        </button>
      </div>

      {/* Slippage options (collapsible) */}
      {showSlippage && (
        <div className="flex items-center gap-1.5">
          {SLIPPAGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                (slippage === opt && !customSlippage)
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
              onClick={() => {
                setSlippage(opt)
                setCustomSlippage('')
              }}
            >
              {opt}%
            </button>
          ))}
          <Input
            className="w-16 h-7 text-xs text-center rounded-full px-2"
            inputMode="decimal"
            placeholder="Custom"
            value={customSlippage ? `${customSlippage}` : ''}
            onChange={(e) => handleCustomSlippageChange(e.target.value.replace('%', ''))}
            autoComplete="off"
            spellCheck={false}
            aria-label="Custom slippage"
          />
        </div>
      )}

      {/* Amount input */}
      <div className="relative">
        <Input
          className="text-lg h-12 pr-16"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          {currencyLabel}
        </span>
      </div>

      {/* Expected output */}
      {(quoteOut || isQuoting) && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">Expected</span>
          <span className="text-xs text-foreground">
            {isQuoting
              ? '...'
              : `~${parseFloat(quoteOut!).toLocaleString(undefined, {
                  maximumFractionDigits: side === 'buy' ? 4 : 2,
                })} ${side === 'buy' ? token_info.symbol : 'USDC'}`}
          </span>
        </div>
      )}

      {/* Preset buttons */}
      <div className="flex gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="flex-1 px-2 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => handlePreset(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Balance */}
      <p className="text-xs text-muted-foreground">
        Balance: {balanceLabel}
      </p>

      {/* Submit */}
      <Button
        className={cn(
          'w-full rounded-xl h-12 text-base font-semibold text-white',
          side === 'buy'
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-red-500 hover:bg-red-600',
        )}
        onClick={handleSubmit}
        disabled={isDisabled}
      >
        {isSwapping
          ? (stepLabel[swap.step] ?? 'Processing…')
          : side === 'buy'
            ? `Buy ${token_info.symbol}`
            : `Sell ${token_info.symbol}`}
      </Button>

      {swap.step === 'error' && swap.error && (
        <p className="text-xs text-center text-red-500">{swap.error}</p>
      )}
    </Card>
  )
}
