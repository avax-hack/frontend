'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
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
    const val = (MOCK_BALANCE * percent) / 100
    setAmount(String(val))
  }

  function handleSubmit() {
    toast('Coming soon', {
      description: 'Trading will be available in a future update.',
    })
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
          placeholder="0.00 AVAX…"
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
          Balance: {MOCK_BALANCE} AVAX
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
      >
        {side === 'buy' ? `Buy ${token_info.symbol}` : `Sell ${token_info.symbol}`}
      </Button>
    </Card>
  )
}
