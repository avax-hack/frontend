'use client'

import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAccount, useBalance } from 'wagmi'
import { parseEther, formatUnits } from 'viem'
import type { Address } from 'viem'
import { useSwap, useTokenBalance } from '@/features/contracts'
import { IS_MOCK } from '@/lib/mock'
import { SNOWTRACE_URL } from '@/lib/constants'
import type { ITokenData } from '@/features/trading/types'

interface TradePanelProps {
  token: ITokenData
}

const MOCK_BALANCE = 10.5
const SLIPPAGE_OPTIONS = ['0.5', '1', '3', '5'] as const
const PERCENT_OPTIONS = [25, 50, 75, 100] as const

export function TradePanel({ token }: TradePanelProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState('3')
  const [customSlippage, setCustomSlippage] = useState('')

  const { token_info } = token

  // Hooks (always called unconditionally)
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const swap = useSwap()
  const { data: avaxBalanceData } = useBalance({ address })
  const { data: tokenBalance } = useTokenBalance(
    token_info.token_id as Address,
    address,
  )

  // Derived balance
  const currentBalance = useMemo(() => {
    if (IS_MOCK) return MOCK_BALANCE
    if (side === 'buy') {
      return avaxBalanceData ? parseFloat(avaxBalanceData.formatted) : 0
    }
    // sell side — tokenBalance is bigint (18 decimals)
    return tokenBalance ? parseFloat(formatUnits(tokenBalance as bigint, 18)) : 0
  }, [side, avaxBalanceData, tokenBalance])

  const balanceLabel = useMemo(() => {
    if (IS_MOCK) return `${MOCK_BALANCE} AVAX`
    if (side === 'buy') {
      const formatted = avaxBalanceData
        ? parseFloat(avaxBalanceData.formatted).toFixed(4)
        : '0'
      return `${formatted} AVAX`
    }
    const formatted = tokenBalance
      ? parseFloat(formatUnits(tokenBalance as bigint, 18)).toFixed(4)
      : '0'
    return `${formatted} ${token_info.symbol}`
  }, [side, avaxBalanceData, tokenBalance, token_info.symbol])

  // Swap state helpers
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

  function handlePresetPercent(percent: number) {
    const val = (currentBalance * percent) / 100
    setAmount(String(parseFloat(val.toFixed(6))))
  }

  async function handleSubmit() {
    if (IS_MOCK) {
      toast('Coming soon', {
        description: 'Trading will be available in a future update.',
      })
      return
    }

    if (!amount || parsedAmount <= 0) return

    const amountBigInt = parseEther(amount)

    const hash = await swap.execute({
      tokenAddress: token_info.token_id as Address,
      side,
      amount: amountBigInt,
      slippageBps,
    })

    if (hash) {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
      setAmount('')
    }
  }

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex">
        <Button
          className={cn(
            'flex-1 rounded-r-none',
            side === 'buy'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-secondary text-muted-foreground',
          )}
          onClick={() => setSide('buy')}
        >
          Buy
        </Button>
        <Button
          className={cn(
            'flex-1 rounded-l-none',
            side === 'sell'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-secondary text-muted-foreground',
          )}
          onClick={() => setSide('sell')}
        >
          Sell
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="trade-amount">
          Amount
        </label>
        <Input
          id="trade-amount"
          type="text"
          inputMode="decimal"
          placeholder={
            side === 'buy' ? '0.00 AVAX…' : `0.00 ${token_info.symbol}…`
          }
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex gap-2">
          {PERCENT_OPTIONS.map((pct) => (
            <Button
              key={pct}
              size="sm"
              variant="outline"
              onClick={() => handlePresetPercent(pct)}
            >
              {pct}%
            </Button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          Balance: {balanceLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Slippage</label>
        <div className="flex gap-2">
          {SLIPPAGE_OPTIONS.map((opt) => (
            <Button
              key={opt}
              size="sm"
              variant={slippage === opt ? 'secondary' : 'outline'}
              onClick={() => {
                setSlippage(opt)
                setCustomSlippage('')
              }}
            >
              {opt}%
            </Button>
          ))}
          <div className="flex items-center gap-1">
            <Input
              className="w-16 text-center"
              inputMode="decimal"
              placeholder="Custom"
              value={customSlippage}
              onChange={(e) => handleCustomSlippageChange(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-label="Custom slippage"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <Button
        className={cn(
          'w-full text-white',
          side === 'buy'
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-red-600 hover:bg-red-700',
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

      {swap.step === 'success' && swap.txHash && (
        <a
          href={`${SNOWTRACE_URL}/tx/${swap.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-center text-emerald-500 hover:underline"
        >
          View transaction on Snowtrace ↗
        </a>
      )}

      {swap.step === 'error' && swap.error && (
        <p className="text-xs text-center text-red-500">{swap.error}</p>
      )}
    </Card>
  )
}
